import { createContext, type ReactNode } from 'react';

import { theme, type Theme } from '@/theme';

export const ThemeContext = createContext<Theme | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => (
  <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
);
