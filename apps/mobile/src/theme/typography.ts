import { Platform, TextStyle } from 'react-native';

const fraunces = Platform.select({
  ios: 'Fraunces_600SemiBold',
  android: 'Fraunces_600SemiBold',
  default: 'serif',
});

const fraunces500 = Platform.select({
  ios: 'Fraunces_500Medium',
  android: 'Fraunces_500Medium',
  default: 'serif',
});

const inter400 = Platform.select({
  ios: 'Inter_400Regular',
  android: 'Inter_400Regular',
  default: 'System',
});

const inter500 = Platform.select({
  ios: 'Inter_500Medium',
  android: 'Inter_500Medium',
  default: 'System',
});

const inter600 = Platform.select({
  ios: 'Inter_600SemiBold',
  android: 'Inter_600SemiBold',
  default: 'System',
});

export const fontFamily = {
  fraunces,
  fraunces500,
  inter400,
  inter500,
  inter600,
} as const;

export const typography: Record<
  | 'displayLg'
  | 'displayMd'
  | 'titleLg'
  | 'titleMd'
  | 'titleSm'
  | 'body'
  | 'bodyStrong'
  | 'label'
  | 'caption'
  | 'button'
  | 'eyebrow',
  TextStyle
> = {
  displayLg: {
    fontFamily: fraunces,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.4,
  },
  displayMd: {
    fontFamily: fraunces,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.2,
  },
  titleLg: {
    fontFamily: fraunces,
    fontSize: 22,
    lineHeight: 28,
  },
  titleMd: {
    fontFamily: fraunces500,
    fontSize: 18,
    lineHeight: 24,
  },
  titleSm: {
    fontFamily: inter600,
    fontSize: 16,
    lineHeight: 22,
  },
  body: {
    fontFamily: inter400,
    fontSize: 15,
    lineHeight: 22,
  },
  bodyStrong: {
    fontFamily: inter600,
    fontSize: 15,
    lineHeight: 22,
  },
  label: {
    fontFamily: inter500,
    fontSize: 13,
    lineHeight: 18,
  },
  caption: {
    fontFamily: inter400,
    fontSize: 12,
    lineHeight: 16,
  },
  button: {
    fontFamily: inter600,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  eyebrow: {
    fontFamily: inter600,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
};

export type TypographyToken = keyof typeof typography;
