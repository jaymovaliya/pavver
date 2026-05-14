import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';

/**
 * Placeholder Splash route — Foundation health check only.
 *
 * Phase G replaces this with Screen 1 (Splash + Phone Entry) from
 * `docs/DESIGN_SPEC_2.md`. For now it just verifies that:
 *   - Expo-router renders something at `/`
 *   - The `@/theme` alias resolves to `src/theme`
 *   - Dark mode looks right on a real device
 *   - SafeAreaView + base typography work end-to-end
 */
export default function FoundationHealthCheck() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Text style={[typography.overline, styles.overline]}>FOUNDATION CHECK</Text>
        <Text style={[typography.h1, styles.headline]}>Pavver</Text>
        <Text style={[typography.body, styles.tagline]}>Walk. Claim. Repeat.</Text>

        <View style={styles.divider} />

        <Text style={[typography.bodySmall, styles.body]}>
          If you can see this on your device, Phase A + B landed cleanly:
        </Text>
        <Text style={[typography.bodySmall, styles.bullet]}>• expo-router boots</Text>
        <Text style={[typography.bodySmall, styles.bullet]}>• theme tokens resolve via @/theme</Text>
        <Text style={[typography.bodySmall, styles.bullet]}>• dark background renders edge-to-edge</Text>
        <Text style={[typography.bodySmall, styles.bullet]}>• bundle id + scheme are app.pavver.client / pavver://</Text>

        <View style={styles.swatchRow}>
          <View style={[styles.swatch, { backgroundColor: colors.user.sunshine }]} />
          <View style={[styles.swatch, { backgroundColor: colors.user.coral }]} />
          <View style={[styles.swatch, { backgroundColor: colors.user.mint }]} />
          <View style={[styles.swatch, { backgroundColor: colors.user.sky }]} />
          <View style={[styles.swatch, { backgroundColor: colors.user.lavender }]} />
          <View style={[styles.swatch, { backgroundColor: colors.user.hotPink }]} />
        </View>
        <Text style={[typography.caption, styles.caption]}>
          The six territory colors (Phase G uses these in the color picker)
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xxl,
    gap: spacing.md,
  },
  overline: {
    color: colors.text.tertiary,
  },
  headline: {
    color: colors.text.primary,
  },
  tagline: {
    color: colors.accent.brand,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.default,
    marginVertical: spacing.lg,
  },
  body: {
    color: colors.text.secondary,
  },
  bullet: {
    color: colors.text.secondary,
    paddingLeft: spacing.sm,
  },
  swatchRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  swatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  caption: {
    color: colors.text.tertiary,
  },
});
