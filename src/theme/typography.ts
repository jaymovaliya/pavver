/**
 * Pavver typography system.
 *
 * Uses Inter font via @expo-google-fonts/inter.
 * Install: npx expo install @expo-google-fonts/inter expo-font
 *
 * Then in App.tsx, load the font before rendering:
 *
 *   import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
 *
 *   const [fontsLoaded] = useFonts({
 *     Inter_400Regular,
 *     Inter_500Medium,
 *     Inter_700Bold,
 *     Inter_800ExtraBold,
 *   });
 *
 *   if (!fontsLoaded) return null;
 */

import { TextStyle } from 'react-native';

export const fontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  bold: 'Inter_700Bold',
  extraBold: 'Inter_800ExtraBold',
} as const;

/**
 * Predefined text styles. Apply via:
 *   <Text style={[typography.h1, { color: colors.text.primary }]}>
 *
 * Color is always set separately so the same style works in different contexts.
 */
export const typography: Record<string, TextStyle> = {
  /** Massive celebratory numbers, e.g. "+12 streets" on walk summary */
  hero: {
    fontFamily: fontFamily.extraBold,
    fontSize: 56,
    lineHeight: 60,
    letterSpacing: -0.03 * 56,
  },

  /** Page-level display heading, rarely used */
  display: {
    fontFamily: fontFamily.extraBold,
    fontSize: 48,
    lineHeight: 52,
    letterSpacing: -0.025 * 48,
  },

  /** Primary headlines on most screens */
  h1: {
    fontFamily: fontFamily.bold,
    fontSize: 32,
    lineHeight: 36,
    letterSpacing: -0.02 * 32,
  },

  /** Section headings */
  h2: {
    fontFamily: fontFamily.bold,
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: -0.02 * 28,
  },

  /** Card titles, list item headings */
  h3: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: -0.015 * 20,
  },

  /** Subheadings inside cards */
  h4: {
    fontFamily: fontFamily.medium,
    fontSize: 18,
    lineHeight: 22,
  },

  /** Standard body text */
  body: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 22,
  },

  /** Secondary body text (descriptions, helper text) */
  bodySmall: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
  },

  /** Tiny labels, captions, timestamps */
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
  },

  /** Caps labels above sections, e.g. "GROUP NAME" */
  overline: {
    fontFamily: fontFamily.medium,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.08 * 11,
    textTransform: 'uppercase',
  },

  /** Button text */
  button: {
    fontFamily: fontFamily.bold,
    fontSize: 17,
    lineHeight: 20,
  },

  /** Stat numbers (timers, distance) — use tabular numerals */
  stat: {
    fontFamily: fontFamily.bold,
    fontSize: 24,
    lineHeight: 28,
    fontVariant: ['tabular-nums'],
  },

  /** Large timer display, e.g. walk-in-progress "00:14:32" */
  statLarge: {
    fontFamily: fontFamily.bold,
    fontSize: 40,
    lineHeight: 44,
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.02 * 40,
  },
};
