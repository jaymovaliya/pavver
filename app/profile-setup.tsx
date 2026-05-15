import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { ScreenContainer } from '@/components/ScreenContainer';
import { useUserStore } from '@/state/userStore';
import { colors, radius, spacing, typography, userColorOptions } from '@/theme';

const SWATCH_SIZE = 40;

/**
 * Placeholder route the AuthGate lands the user on after a stub sign-in.
 * Real Screen 3 (name + color picker per DESIGN_SPEC_2 §3) replaces this in Phase G.
 */
export default function ProfileSetupPlaceholder() {
  const providerId = useUserStore((s) => s.providerId);
  const email = useUserStore((s) => s.email);
  const signOut = useUserStore((s) => s.signOut);

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text style={[typography.overline, styles.label]}>Signed in</Text>
        <Text style={[typography.h2, styles.headline]}>
          {providerId != null ? `via ${providerId}` : 'via stub provider'}
        </Text>
        {email != null && (
          <Text style={[typography.body, styles.body]}>{email}</Text>
        )}

        <View style={styles.divider} />

        <Text style={[typography.bodySmall, styles.placeholder]}>
          Real Profile Setup (name + color picker) lands in a follow-up plan. The six
          territory colors below are what you&apos;ll choose from on the final screen.
        </Text>

        <View style={styles.swatches}>
          {userColorOptions.map((c) => (
            <View key={c.name} style={[styles.swatch, { backgroundColor: c.hex }]} />
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <Button label="Sign out" onPress={() => void signOut()} variant="outline" />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: spacing.xxl,
    gap: spacing.md,
  },
  label: {
    color: colors.text.tertiary,
  },
  headline: {
    color: colors.text.primary,
  },
  body: {
    color: colors.text.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.default,
    marginVertical: spacing.lg,
  },
  placeholder: {
    color: colors.text.secondary,
  },
  swatches: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
    flexWrap: 'wrap',
  },
  swatch: {
    width: SWATCH_SIZE,
    height: SWATCH_SIZE,
    borderRadius: radius.pill,
  },
  actions: {
    marginBottom: spacing.lg,
  },
});
