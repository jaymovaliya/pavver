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
  newArchEnabled: true,
  ios: {
    bundleIdentifier: 'app.pavver.client',
    supportsTablet: false,
  },
  android: {
    package: 'app.pavver.client',
    adaptiveIcon: {
      backgroundColor: '#FFD60A',
      foregroundImage: './assets/images/adaptive-icon-foreground.png',
    },
    edgeToEdgeEnabled: true,
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
    // Phase C will install @rnmapbox/maps and @react-native-firebase/app and
    // re-enable these plugin entries. They're commented out so today's
    // foundation health check can boot without those native modules installed.
    //
    // [
    //   '@rnmapbox/maps',
    //   { RNMapboxMapsDownloadToken: process.env.MAPBOX_DOWNLOADS_TOKEN ?? '' },
    // ],
    // '@react-native-firebase/app',
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    mapboxPublicToken: process.env.MAPBOX_PUBLIC_TOKEN ?? '',
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID ?? '',
  },
};

export default config;
