/**
 * Auth service — real Firebase implementations.
 *
 * Providers wired:
 *   - Google: native @react-native-google-signin → Firebase credential exchange
 *   - Apple: expo-apple-authentication → Firebase credential exchange (with SHA-256 nonce)
 *   - Email + password: direct Firebase signIn / createUser
 *
 * Module-load side effect: importing this file also imports `./firebase`, which
 * runs `GoogleSignin.configure()` exactly once.
 *
 * End-to-end testing requires:
 *   - Firebase project created + iOS/Android apps registered (bundle/package = app.pavver.client)
 *   - GoogleService-Info.plist (iOS) + google-services.json (Android) dropped at repo root
 *   - FIREBASE_WEB_CLIENT_ID + GOOGLE_IOS_URL_SCHEME set in .env
 *   - For Apple: Apple Developer "Sign in with Apple" capability + Services ID configured in Firebase
 *   - `npx expo prebuild --clean && expo run:ios|android` (Firebase needs native build)
 */

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';

import { auth } from './firebase';

import type { AuthProvider } from '@/state/userStore';

export interface AuthResult {
  userId: string;
  email: string;
  providerId: AuthProvider;
}

export type EmailAuthMode = 'signin' | 'signup';

// ---------------------------------------------------------------------------
// Google
// ---------------------------------------------------------------------------

export async function signInWithGoogle(): Promise<AuthResult> {
  // iOS: no-op. Android: prompts to install/update Google Play services if missing.
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

  const response = await GoogleSignin.signIn();
  if (response.type === 'cancelled') {
    throw new Error('Google sign-in was cancelled.');
  }

  const idToken = response.data.idToken;
  if (idToken == null) {
    throw new Error('Google sign-in returned no idToken. Check that FIREBASE_WEB_CLIENT_ID is set.');
  }

  const credential = auth.GoogleAuthProvider.credential(idToken);
  const userCredential = await auth().signInWithCredential(credential);

  return {
    userId: userCredential.user.uid,
    email: userCredential.user.email ?? response.data.user.email ?? '',
    providerId: 'google',
  };
}

// ---------------------------------------------------------------------------
// Apple
// ---------------------------------------------------------------------------

function makeRawNonce(): string {
  // 32 chars of random; entropy is plenty for replay protection.
  return (
    Math.random().toString(36).slice(2) +
    Math.random().toString(36).slice(2) +
    Math.random().toString(36).slice(2)
  ).slice(0, 32);
}

export async function signInWithApple(): Promise<AuthResult> {
  // Apple's flow: pass the SHA-256 of a nonce to the native sheet; pass the raw
  // nonce to Firebase's AppleAuthProvider.credential. Firebase verifies the hash.
  const rawNonce = makeRawNonce();
  const hashedNonce = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    rawNonce,
  );

  const appleCredential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
    nonce: hashedNonce,
  });

  const { identityToken, email } = appleCredential;
  if (identityToken == null) {
    throw new Error('Apple sign-in returned no identityToken.');
  }

  const firebaseCredential = auth.AppleAuthProvider.credential(identityToken, rawNonce);
  const userCredential = await auth().signInWithCredential(firebaseCredential);

  return {
    userId: userCredential.user.uid,
    // Apple only returns email on the user's FIRST sign-in; subsequent ones it's null,
    // so fall back to whatever Firebase stored on the initial sign-in.
    email: userCredential.user.email ?? email ?? '',
    providerId: 'apple',
  };
}

// ---------------------------------------------------------------------------
// Email + password
// ---------------------------------------------------------------------------

export async function signInWithEmailPassword(
  email: string,
  password: string,
  mode: EmailAuthMode,
): Promise<AuthResult> {
  const userCredential =
    mode === 'signup'
      ? await auth().createUserWithEmailAndPassword(email, password)
      : await auth().signInWithEmailAndPassword(email, password);

  return {
    userId: userCredential.user.uid,
    email: userCredential.user.email ?? email,
    providerId: 'email',
  };
}

// ---------------------------------------------------------------------------
// Sign out
// ---------------------------------------------------------------------------

export async function signOut(): Promise<void> {
  // Firebase first so the in-memory user is cleared even if Google cleanup fails.
  await auth().signOut();
  try {
    // Google caches the picked account at the OS level; without this, the next
    // sign-in skips the chooser and re-uses the previous account.
    await GoogleSignin.signOut();
  } catch (err) {
    console.warn('[auth] GoogleSignin.signOut failed (continuing)', err);
  }
  // Apple has no programmatic sign-out — the system manages it.
}
