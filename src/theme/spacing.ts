/**
 * Pavver spacing scale.
 *
 * Everything is on a 4px grid. If you find yourself wanting 18px or 30px,
 * round to the nearest scale value (16 or 32).
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
  massive: 64,
} as const;

/**
 * Standard radii. Match Pavver's rounded, soft aesthetic.
 */
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  /** Full pill — use for buttons (rounded to half their height) */
  pill: 999,
} as const;

/**
 * Standard screen layout dimensions.
 */
export const layout = {
  /** Side padding on all screens */
  screenPadding: spacing.base,
  /** Vertical gap between major sections within a screen */
  sectionGap: spacing.xxl,
  /** Height of primary buttons */
  buttonHeightPrimary: 56,
  /** Height of secondary buttons */
  buttonHeightSecondary: 48,
  /** Height of input fields */
  inputHeight: 56,
} as const;
