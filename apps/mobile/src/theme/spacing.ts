export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

export type SpacingToken = keyof typeof spacing;

export const space = (multiplier: number): number => 4 * multiplier;
