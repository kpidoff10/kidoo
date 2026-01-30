/**
 * App Ready Context
 * Gère l'état de préparation de l'application (splash screen caché, app prête)
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

interface AppReadyContextType {
  isAppReady: boolean;
}

const AppReadyContext = createContext<AppReadyContextType | undefined>(undefined);

interface AppReadyProviderProps {
  children: React.ReactNode;
}

export function AppReadyProvider({ children }: AppReadyProviderProps) {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Configurer l'animation de fondu pour le splash screen
        // Duration en millisecondes (500ms = 0.5 seconde)
        SplashScreen.setOptions({
          duration: 500,
          fade: true,
        });
        
        // Attendre que le splash screen soit caché avec animation de fondu
        await SplashScreen.hideAsync();
        
        // Petit délai supplémentaire pour s'assurer que l'animation est terminée
        await new Promise((resolve) => setTimeout(resolve, 100));
        
        setIsAppReady(true);
      } catch (error) {
        console.error('Erreur lors de la préparation de l\'app:', error);
        // Même en cas d'erreur, on considère l'app comme prête après un délai
        setTimeout(() => setIsAppReady(true), 1000);
      }
    }

    prepare();
  }, []);

  return (
    <AppReadyContext.Provider value={{ isAppReady }}>
      {children}
    </AppReadyContext.Provider>
  );
}

export function useAppReady(): AppReadyContextType {
  const context = useContext(AppReadyContext);
  if (context === undefined) {
    throw new Error('useAppReady must be used within an AppReadyProvider');
  }
  return context;
}
