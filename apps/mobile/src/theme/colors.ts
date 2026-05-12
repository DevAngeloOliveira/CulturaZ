export const colors = {
  primary: '#173F35',
  secondary: '#2F6F5E',
  background: '#F6F0E4',
  surface: '#FFFDF7',
  accent: '#D99A2B',
  usedPrice: '#B95F3B',
  textPrimary: '#26312E',
  textSecondary: '#65736E',
  success: '#2F8F5B',
  warning: '#E3B341',
  error: '#C95B55',
  info: '#4B6F9F',
  border: '#E4DED0',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  overlay: 'rgba(38, 49, 46, 0.6)',
  primaryMuted: 'rgba(23, 63, 53, 0.08)',
  accentMuted: 'rgba(217, 154, 43, 0.16)',
} as const;

export type ColorToken = keyof typeof colors;
