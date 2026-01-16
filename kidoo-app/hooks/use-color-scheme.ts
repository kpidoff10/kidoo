import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * Hook pour obtenir le schéma de couleurs du système
 * Version React Native (non-web)
 * 
 * Pour la version web, voir use-color-scheme.web.ts
 */
export function useColorScheme() {
  return useRNColorScheme() ?? 'light';
}
