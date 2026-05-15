/**
 * Firebase + Google Sign-In bootstrap.
 *
 * Importing this module:
 *   - Lets `@react-native-firebase/app` auto-initialize from the native config files
 *     (GoogleService-Info.plist on iOS, google-services.json on Android). Both files
 *     live at the repo root and are gitignored.
 *   - Calls `GoogleSignin.configure({ webClientId })` once so the native Google
 *     flow returns a Firebase-compatible idToken.
 *
 * `src/services/auth.ts` imports from here; importing this file at app boot (via
 * the auth service) ensures GoogleSignin is configured before any sign-in attempt.
 */

import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Constants from 'expo-constants';

interface ExpoExtra {
  firebaseWebClientId?: string;
  firebaseProjectId?: string;
}

const extra = (Constants.expoConfig?.extra ?? {}) as ExpoExtra;
const webClientId = extra.firebaseWebClientId ?? '';

if (webClientId.length === 0) {
  console.warn(
    '[firebase] FIREBASE_WEB_CLIENT_ID is empty. Google sign-in will fail at signIn() time. ' +
      'Copy the OAuth 2.0 Web Client ID from Firebase Console → Authentication → Google → ' +
      '"Web SDK configuration" into .env.',
  );
}

GoogleSignin.configure({
  webClientId,
});

export { auth };
