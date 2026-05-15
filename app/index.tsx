import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { ScreenContainer } from '@/components/ScreenContainer';
import { type SocialProvider, useUserStore } from '@/state/userStore';
import { colors, spacing, typography } from '@/theme';

const ICON_SIZE = 20;

export default function SignInScreen() {
  const router = useRouter();
  const signInWith = useUserStore((s) => s.signInWith);
  const [loadingProvider, setLoadingProvider] = useState<SocialProvider | null>(null);

  const handleSocial = useCallback(
    async (provider: SocialProvider) => {
      if (loadingProvider != null) return;
      setLoadingProvider(provider);
      try {
        await signInWith(provider);
        // AuthGate navigates to /profile-setup once status flips to 'authenticated'.
      } catch {
        // userStore already logged the error and reset status to 'idle'.
      } finally {
        setLoadingProvider(null);
      }
    },
    [loadingProvider, signInWith],
  );

  const handleEmail = useCallback(() => {
    if (loadingProvider != null) return;
    router.push('/email-signin');
  }, [loadingProvider, router]);

  const anyLoading = loadingProvider != null;

  return (
    <ScreenContainer>
      <View style={styles.brand}>
        <Text style={[typography.h1, styles.wordmark]}>Pavver</Text>
        <Text style={[typography.bodySmall, styles.tagline]}>Walk. Claim. Repeat.</Text>
      </View>

      <View style={styles.headlineWrap}>
        <Text style={[typography.h2, styles.headline]}>Claim every street{'\n'}you walk.</Text>
      </View>

      <View style={styles.buttons}>
        <Button
          label="Continue with Google"
          onPress={() => handleSocial('google')}
          variant="socialLight"
          loading={loadingProvider === 'google'}
          disabled={anyLoading && loadingProvider !== 'google'}
          leftIcon={<Ionicons name="logo-google" size={ICON_SIZE} color={colors.bg.primary} />}
        />
        <Button
          label="Continue with Apple"
          onPress={() => handleSocial('apple')}
          variant="socialDark"
          loading={loadingProvider === 'apple'}
          disabled={anyLoading && loadingProvider !== 'apple'}
          leftIcon={<Ionicons name="logo-apple" size={ICON_SIZE} color={colors.text.primary} />}
        />
        <Button
          label="Continue with Email"
          onPress={handleEmail}
          variant="outline"
          disabled={anyLoading}
          leftIcon={<Ionicons name="mail-outline" size={ICON_SIZE} color={colors.text.primary} />}
        />
      </View>

      <View style={styles.footer}>
        <Text style={[typography.caption, styles.footerText]}>
          By continuing, you agree to our{' '}
          <Text style={styles.footerLink}>Terms</Text>
          {' '}and{' '}
          <Text style={styles.footerLink}>Privacy Policy</Text>
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  brand: {
    marginTop: spacing.massive,
    alignItems: 'center',
    gap: spacing.sm,
  },
  wordmark: {
    color: colors.text.primary,
  },
  tagline: {
    color: colors.text.secondary,
  },
  headlineWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headline: {
    color: colors.text.primary,
    textAlign: 'center',
  },
  buttons: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  footer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  footerText: {
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  footerLink: {
    color: colors.text.tertiary,
    textDecorationLine: 'underline',
  },
});
