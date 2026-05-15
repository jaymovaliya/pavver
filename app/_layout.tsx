import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AuthGate } from '@/components/AuthGate';
import { useUserStore } from '@/state/userStore';
import { colors } from '@/theme';

// Keep the native splash up until fonts have loaded AND the user store has
// rehydrated from AsyncStorage. This prevents a flash of the Sign-in screen
// for users who are already authenticated across cold launches.
SplashScreen.preventAutoHideAsync().catch(() => {
  // Splash was already hidden by something else (e.g. Fast Refresh) — fine.
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  const hydrated = useUserStore((s) => s.hydrated);

  const ready = (fontsLoaded || fontError != null) && hydrated;

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync().catch(() => {
        // Race or already hidden — fine.
      });
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <>
      <AuthGate>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.bg.primary },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="email-signin" />
          <Stack.Screen name="profile-setup" />
        </Stack>
      </AuthGate>
      <StatusBar style="light" />
    </>
  );
}
