import { usePathname, useRouter } from 'expo-router';
import { ReactNode, useEffect } from 'react';

import { useUserStore } from '@/state/userStore';

interface AuthGateProps {
  children: ReactNode;
}

/**
 * Routes the user based on auth status.
 *
 * - `!hydrated` → render `null` so the native splash stays up while AsyncStorage
 *   restores. Once hydrated, the gate is the source of truth for where the user lives.
 * - `idle` (signed out) → must be at `/` (Sign-in). Bounce them there if not.
 * - `authenticated` (signed in, no profile yet) → must be at `/profile-setup`. Bounce.
 * - `profile-complete` → app is ready. No tabs route exists yet, so stay put.
 *
 * Uses `usePathname()` rather than `useSegments()` because the typed-routes signature
 * for `useSegments()` doesn't model the empty root-route case correctly.
 */
export function AuthGate({ children }: AuthGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const status = useUserStore((s) => s.status);
  const hydrated = useUserStore((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated) return;

    const atRoot = pathname === '/';
    const atEmailSignIn = pathname === '/email-signin';
    const atProfileSetup = pathname === '/profile-setup';

    if (status === 'idle' && !atRoot && !atEmailSignIn) {
      router.replace('/');
      return;
    }

    if (status === 'authenticated' && !atProfileSetup) {
      router.replace('/profile-setup');
      return;
    }

    // 'profile-complete' has no destination yet — a future phase will add `/(tabs)`.
    // 'authenticating' is transient; no redirect — the Sign-in screen shows its own spinner.
  }, [hydrated, status, pathname, router]);

  if (!hydrated) {
    return null;
  }

  return <>{children}</>;
}
