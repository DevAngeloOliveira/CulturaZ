import { Platform, TextStyle } from 'react-native';

const frauncesRegular = Platform.select({
  ios: 'Fraunces_400Regular',
  android: 'Fraunces_400Regular',
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

const inter600 = Platform.select({
  ios: 'Inter_600SemiBold',
  android: 'Inter_600SemiBold',
  default: 'System',
});

const inter900 = Platform.select({
  ios: 'Inter_900Black',
  android: 'Inter_900Black',
  default: 'System',
});

export const fontFamily = {
  frauncesRegular,
  fraunces500,
  inter400,
  inter600,
  inter900,
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
    fontFamily: frauncesRegular,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.4,
  },
  displayMd: {
    fontFamily: frauncesRegular,
    fontSize: 28,
    lineHeight: 33,
    letterSpacing: -0.2,
  },
  titleLg: {
    fontFamily: frauncesRegular,
    fontSize: 22,
    lineHeight: 28,
  },
  titleMd: {
    fontFamily: fraunces500,
    fontSize: 18,
    lineHeight: 24,
  },
  titleSm: {
    fontFamily: inter900,
    fontSize: 15,
    lineHeight: 21,
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
    fontFamily: inter900,
    fontSize: 11,
    lineHeight: 16.5,
  },
  caption: {
    fontFamily: inter400,
    fontSize: 12,
    lineHeight: 17,
  },
  button: {
    fontFamily: inter900,
    fontSize: 13,
    lineHeight: 20,
  },
  eyebrow: {
    fontFamily: inter900,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
};

export type TypographyToken = keyof typeof typography;
