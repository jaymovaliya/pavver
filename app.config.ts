import type { ExpoConfig } from 'expo/config';

// Load .env if dotenv is installed (Phase C). The try/catch lets this file
// load/typecheck before dotenv has been installed.
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('dotenv/config');
} catch {
  // dotenv not installed yet — env values must come from the shell.
}

const config: ExpoConfig = {
  name: 'Pavver',
  slug: 'pavver',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'pavver',
  userInterfaceStyle: 'dark',
  // New Architecture is opt-in in Expo SDK 54. We're leaving it OFF for now because
  // @react-native-firebase v24 + use_frameworks!(:static) + new arch combine to break
  // the iOS build (non-modular React-Core headers in the RNFBApp framework module).
  // Re-enable once RNFB ships a fix or we can swap to a different Firebase SDK.
  // See docs/IDEAS_AND_GAPS.md 2026-05-15 entry.
  newArchEnabled: false,
  ios: {
    bundleIdentifier: 'app.pavver.client',
    supportsTablet: false,
    // Required for Apple sign-in via expo-apple-authentication.
    usesAppleSignIn: true,
    // RNFirebase reads platform config from this file at the repo root (gitignored).
    googleServicesFile: process.env.GOOGLE_SERVICES_INFO_PLIST ?? './GoogleService-Info.plist',
  },
  android: {
    package: 'app.pavver.client',
    adaptiveIcon: {
      backgroundColor: '#FFD60A',
      foregroundImage: './assets/images/adaptive-icon-foreground.png',
    },
    edgeToEdgeEnabled: true,
    // RNFirebase reads platform config from this file at the repo root (gitignored).
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#0A0A0F',
      },
    ],
    // Mapbox stays commented out until that phase. Uncomment + install when ready:
    //   [
    //     '@rnmapbox/maps',
    //     { RNMapboxMapsDownloadToken: process.env.MAPBOX_DOWNLOADS_TOKEN ?? '' },
    //   ],
    '@react-native-firebase/app',
    '@react-native-firebase/auth',
    [
      '@react-native-google-signin/google-signin',
      {
        // The iOS reverse-client ID from your GoogleService-Info.plist (looks like
        // `com.googleusercontent.apps.1234567890-abc...`). Required for the native iOS
        // Google Sign-In SDK to handle the OAuth callback.
        iosUrlScheme: process.env.GOOGLE_IOS_URL_SCHEME ?? '',
      },
    ],
    'expo-apple-authentication',
    [
      // RNFirebase v24 requires iOS pods to use static frameworks. Without this the
      // build fails during pod install with a "use_frameworks!" / Firebase incompatibility.
      'expo-build-properties',
      {
        ios: { useFrameworks: 'static' },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    mapboxPublicToken: process.env.MAPBOX_PUBLIC_TOKEN ?? '',
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID ?? '',
    // The OAuth 2.0 Web Client ID from Firebase Console → Authentication → Sign-in method
    // → Google. Used by GoogleSignin.configure() to get a valid idToken from native sign-in.
    firebaseWebClientId: process.env.FIREBASE_WEB_CLIENT_ID ?? '',
  },
};

export default config;
