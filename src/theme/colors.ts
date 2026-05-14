/**
 * Pavver color system — single source of truth.
 *
 * Rules:
 * - NEVER hardcode hex values in components. Import from here.
 * - UI chrome stays neutral so user colors can pop.
 * - User colors are the six territory options; never use them as UI accents.
 * - Brand accent (Pavver Yellow) is used for primary CTAs only.
 */

export const colors = {
  /** Page and surface backgrounds (dark mode default) */
  bg: {
    primary: '#0A0A0F',
    secondary: '#16161D',
    tertiary: '#22222E',
  },

  /** Text colors */
  text: {
    primary: '#FFFFFF',
    secondary: '#9999A8',
    tertiary: '#5C5C6B',
    /** Dark text for use ON colored backgrounds (yellow buttons, etc.) */
    onAccent: '#0A0A0F',
  },

  /** Borders and dividers */
  border: {
    default: '#2A2A38',
    subtle: '#1F1F2A',
  },

  /** Brand accent — Pavver Yellow. For primary CTAs only. */
  accent: {
    brand: '#FFD60A',
  },

  /**
   * User territory colors. One per user, picked during onboarding.
   * Use these to render territory lines on the map and avatars,
   * NOT as UI accent colors.
   */
  user: {
    sunshine: '#FFD60A',
    coral: '#FF453A',
    mint: '#30D158',
    sky: '#0A84FF',
    lavender: '#BF5AF2',
    hotPink: '#FF2D92',
  },

  /** Semantic colors for status messages, badges, banners */
  semantic: {
    success: '#30D158',
    danger: '#FF453A',
    warning: '#FFD60A',
    info: '#0A84FF',
  },

  /** Transparent overlays */
  overlay: {
    scrim: 'rgba(10, 10, 15, 0.6)',
    glassBackdrop: 'rgba(22, 22, 29, 0.85)',
  },
} as const;

/**
 * Type-safe access to user colors.
 * Use when storing user.colorName in Firestore and rendering by name.
 */
export type UserColorName = keyof typeof colors.user;

export const userColorOptions: Array<{ name: UserColorName; hex: string; label: string }> = [
  { name: 'sunshine', hex: colors.user.sunshine, label: 'Sunshine' },
  { name: 'coral', hex: colors.user.coral, label: 'Coral' },
  { name: 'mint', hex: colors.user.mint, label: 'Mint' },
  { name: 'sky', hex: colors.user.sky, label: 'Sky' },
  { name: 'lavender', hex: colors.user.lavender, label: 'Lavender' },
  { name: 'hotPink', hex: colors.user.hotPink, label: 'Hot Pink' },
];

/**
 * Get a user's color hex from their stored color name.
 * Defensively returns sunshine if name is invalid.
 */
export function getUserColorHex(name: string): string {
  if (name in colors.user) {
    return colors.user[name as UserColorName];
  }
  return colors.user.sunshine;
}
