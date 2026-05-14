/**
 * Pavver theme — single import point.
 *
 * Usage:
 *   import { colors, typography, spacing, radius } from '@/theme';
 *   // or
 *   import { theme } from '@/theme';
 *   // then: theme.colors.accent.brand, theme.spacing.base, etc.
 */

export { colors, userColorOptions, getUserColorHex } from './colors';
export type { UserColorName } from './colors';
export { typography, fontFamily } from './typography';
export { spacing, radius, layout } from './spacing';

import { colors } from './colors';
import { typography, fontFamily } from './typography';
import { spacing, radius, layout } from './spacing';

export const theme = {
  colors,
  typography,
  fontFamily,
  spacing,
  radius,
  layout,
};
