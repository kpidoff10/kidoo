/**
 * Theme Context - Gestion du thème Light/Dark
 */

import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors, Colors } from './colors';
import { fonts, Fonts } from './fonts';
import { spacing, borderRadius, shadow, separators, Spacing, BorderRadius, Shadow, Separators } from './spacing';

export interface Theme {
  colors: Colors;
  fonts: Fonts;
  spacing: Spacing;
  borderRadius: BorderRadius;
  shadow: Shadow;
  separators: Separators;
  isDark: boolean;
}

const ThemeContext = createContext<Theme | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const theme = useMemo<Theme>(
    () => ({
      colors: isDark ? darkColors : lightColors,
      fonts,
      spacing,
      borderRadius,
      shadow,
      separators,
      isDark,
    }),
    [isDark]
  );

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): Theme {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/**
 * Hook pour créer des styles dynamiques basés sur le thème
 */
export function useThemedStyles<T>(
  styleFactory: (theme: Theme) => T
): T {
  const theme = useTheme();
  return useMemo(() => styleFactory(theme), [theme, styleFactory]);
}
