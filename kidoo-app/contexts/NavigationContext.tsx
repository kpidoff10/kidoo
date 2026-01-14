/**
 * Contexte de navigation pour gérer l'état de navigation de l'application
 * Centralise la logique de détermination du titre actuel
 */

import { createContext, useContext, useMemo, useCallback, ReactNode } from 'react';
import { useSegments } from 'expo-router';
import { useTranslation } from 'react-i18next';

interface NavigationContextType {
  currentTitle: string;
  currentTab: string | null;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
}

/**
 * Provider pour le contexte de navigation
 * Gère la détermination du titre actuel basé sur la route
 */
export function NavigationProvider({ children }: NavigationProviderProps) {
  const segments = useSegments();
  const { t } = useTranslation();

  // Déterminer le titre basé sur la route actuelle
  const getTitle = useCallback(() => {
    // segments pour "(tabs)/index" sera ["(tabs)", "index"]
    // segments pour "(tabs)/explore" sera ["(tabs)", "explore"]
    // segments pour "(tabs)/kidoos" sera ["(tabs)", "kidoos"]
    const currentTab = segments[segments.length - 1] as string;

    if (segments[0] === '(tabs)') {
      switch (currentTab) {
        case 'index':
          return t('tabs.home');
        case 'explore':
          return t('tabs.explore');
        case 'kidoos':
          return t('tabs.kidoos');
        default:
          return 'Kidoo'; // Fallback par défaut
      }
    }

    return 'Kidoo'; // Fallback si pas dans les tabs
  }, [segments, t]);

  const currentTitle = useMemo(() => getTitle(), [getTitle]);

  const currentTab = useMemo(() => {
    if (segments[0] === '(tabs)') {
      return segments[segments.length - 1] as string;
    }
    return null;
  }, [segments]);

  const value = useMemo(
    () => ({
      currentTitle,
      currentTab,
    }),
    [currentTitle, currentTab]
  );

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

/**
 * Hook pour utiliser le contexte de navigation
 * @throws {Error} Si utilisé en dehors du NavigationProvider
 */
export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
