import { useContext } from 'react';

import { ThemeContext } from '@/app/providers/ThemeProvider';
import { theme as defaultTheme, type Theme } from '@/theme';

export const useTheme = (): Theme => {
  const ctx = useContext(ThemeContext);
  return ctx ?? defaultTheme;
};
