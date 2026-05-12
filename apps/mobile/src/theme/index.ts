import { colors } from './colors';
import { radius, touchTarget } from './radius';
import { shadows } from './shadows';
import { space, spacing } from './spacing';
import { fontFamily, typography } from './typography';

export const theme = {
  colors,
  spacing,
  space,
  radius,
  touchTarget,
  typography,
  fontFamily,
  shadows,
} as const;

export type Theme = typeof theme;

export { colors, spacing, space, radius, touchTarget, typography, fontFamily, shadows };
