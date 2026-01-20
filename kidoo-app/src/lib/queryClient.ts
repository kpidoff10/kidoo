/**
 * React Query Configuration
 * QueryClient avec persist et gestion optimistic
 */

import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Créer le QueryClient avec configuration optimale
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache pendant 5 minutes
      staleTime: 1000 * 60 * 5,
      // Garder en cache 30 minutes
      gcTime: 1000 * 60 * 30,
      // Retry 2 fois en cas d'erreur
      retry: 2,
      // Refetch en background quand l'app revient au premier plan
      refetchOnWindowFocus: true,
      // Ne pas refetch automatiquement quand le composant monte
      refetchOnMount: true,
      // Refetch quand la connexion revient
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry une fois en cas d'erreur
      retry: 1,
    },
  },
});

// Créer le persister pour AsyncStorage
export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'KIDOO_QUERY_CACHE',
  // Throttle les writes pour éviter trop d'écritures
  throttleTime: 1000,
});

// Options de persistance
export const persistOptions = {
  persister: asyncStoragePersister,
  // Durée max de persistance (24h)
  maxAge: 1000 * 60 * 60 * 24,
  // Ne pas persister les queries en erreur
  dehydrateOptions: {
    shouldDehydrateQuery: (query: any) => {
      return query.state.status === 'success';
    },
  },
};
