/**
 * Provider TanStack Query
 * Configure le QueryClient avec les options par défaut
 */

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Configuration du QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Temps avant que les données soient considérées comme "stale"
      staleTime: 1000 * 60 * 5, // 5 minutes

      // Temps de garde en cache après inutilisation
      gcTime: 1000 * 60 * 30, // 30 minutes

      // Ne pas re-fetch automatiquement quand la fenêtre reprend le focus
      refetchOnWindowFocus: false,

      // Re-fetch au montage du composant
      refetchOnMount: true,

      // Ne pas re-fetch quand on reconnecte au réseau
      refetchOnReconnect: false,

      // Retry en cas d'erreur
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // Retry en cas d'erreur pour les mutations
      retry: 1,
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

// Export du client pour utilisation directe si nécessaire
export { queryClient };
