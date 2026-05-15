import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import * as auth from '@/services/auth';
import type { EmailAuthMode } from '@/services/auth';
import type { UserColorName } from '@/theme';

export type AuthStatus =
  | 'idle' // signed out
  | 'authenticating' // social handler in flight
  | 'authenticated' // signed in, profile not yet picked
  | 'profile-complete'; // signed in and profile-set; ready for the app

export type AuthProvider = 'google' | 'apple' | 'email';

/** Subset of AuthProvider that go through a single-button native flow. Email is separate. */
export type SocialProvider = Extract<AuthProvider, 'google' | 'apple'>;

export interface UserState {
  status: AuthStatus;
  userId: string | null;
  email: string | null;
  providerId: AuthProvider | null;
  displayName: string | null;
  colorName: UserColorName | null;
  /** Set true once AsyncStorage rehydration has completed (even on first launch). */
  hydrated: boolean;

  /** Google + Apple. Email goes through `signInWithEmailPassword`. */
  signInWith(provider: SocialProvider): Promise<void>;
  signInWithEmailPassword(email: string, password: string, mode: EmailAuthMode): Promise<void>;
  signOut(): Promise<void>;
  completeProfile(name: string, color: UserColorName): Promise<void>;
}

const STORAGE_KEY = 'pavver:user';

const initial = {
  status: 'idle' as AuthStatus,
  userId: null,
  email: null,
  providerId: null,
  displayName: null,
  colorName: null,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...initial,
      hydrated: false,

      async signInWith(provider) {
        set({ status: 'authenticating' });
        try {
          const result =
            provider === 'google' ? await auth.signInWithGoogle() : await auth.signInWithApple();
          set({
            status: 'authenticated',
            userId: result.userId,
            email: result.email,
            providerId: result.providerId,
          });
        } catch (err) {
          console.warn('[userStore] signInWith failed', err);
          set({ status: 'idle' });
          throw err;
        }
      },

      async signInWithEmailPassword(emailAddr, password, mode) {
        set({ status: 'authenticating' });
        try {
          const result = await auth.signInWithEmailPassword(emailAddr, password, mode);
          set({
            status: 'authenticated',
            userId: result.userId,
            email: result.email,
            providerId: result.providerId,
          });
        } catch (err) {
          console.warn('[userStore] signInWithEmailPassword failed', err);
          set({ status: 'idle' });
          throw err;
        }
      },

      async signOut() {
        await auth.signOut();
        set({ ...initial });
      },

      async completeProfile(name, color) {
        set({
          status: 'profile-complete',
          displayName: name,
          colorName: color,
        });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        status: s.status,
        userId: s.userId,
        email: s.email,
        providerId: s.providerId,
        displayName: s.displayName,
        colorName: s.colorName,
      }),
      onRehydrateStorage: () => (state) => {
        // Runs after AsyncStorage read completes (even when there's nothing stored).
        // Flip `hydrated` so the AuthGate stops blocking.
        if (state) {
          state.hydrated = true;
          // A status of 'authenticating' can leak across an app kill (mid-sign-in).
          // Reset to 'idle' so a relaunch doesn't show a spinner forever.
          if (state.status === 'authenticating') {
            state.status = 'idle';
          }
        } else {
          // No persisted state — first launch. Force the flag via setState below.
          useUserStore.setState({ hydrated: true });
        }
      },
    },
  ),
);
