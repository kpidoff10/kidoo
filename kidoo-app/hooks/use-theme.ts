/**
 * Hook pour accéder au thème de l'application
 * Fournit tous les styles, couleurs et espacements du thème actuel
 */

import { useMemo } from 'react';
import { themeColors, staticColors } from '@/theme/colors';
import { spacing, borderRadius, iconSize } from '@/theme/spacing';
import { shadows } from '@/theme/shadows';
import { typography } from '@/theme/typography';
import { createComponentStyles } from '@/theme/components';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useTheme() {
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';

  const theme = useMemo(
    () => ({
      // Mode actuel
      colorScheme,
      isDark,

      // Couleurs
      colors: themeColors[colorScheme],
      staticColors,

      // Espacements
      spacing,
      borderRadius,
      iconSize,

      // Ombres
      shadows,

      // Typographie
      typography,

      // Styles de composants
      components: createComponentStyles(colorScheme),
    }),
    [colorScheme, isDark]
  );

  return theme;
}
