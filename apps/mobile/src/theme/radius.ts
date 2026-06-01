export const radius = {
  sm: 12,
  md: 17,
  lg: 24,
  xl: 32,
  pill: 999,
} as const;

export type RadiusToken = keyof typeof radius;

export const touchTarget = 48;
