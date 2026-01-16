/**
 * Hook utilitaire pour les queries "BLE First"
 * 
 * Ce hook permet de charger rapidement des données depuis BLE (appareil local), puis de les mettre à jour
 * avec des données DB en arrière-plan comme fallback si BLE n'est pas disponible.
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error } = useBleFirstQuery({
 *   queryKey: ['kidoo', kidooId, 'storage'],
 *   bleQueryFn: async () => await BasicStorageAction.getStorage(),
 *   dbQueryFn: async () => await getKidooStorage(kidooId, userId),
 *   isConnected: isConnected,
 *   enabled: !!kidooId && !!userId,
 *   transformBleData: (bleData) => ({
 *     totalBytes: bleData.totalBytes,
 *     freeBytes: bleData.freeBytes,
 *   }),
 *   transformDbData: (dbData) => ({
 *     totalBytes: dbData.totalBytes ?? undefined,
 *     freeBytes: dbData.freeBytes ?? undefined,
 *   }),
 * });
 * ```
 */

import { useQuery, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query';

export interface BleFirstQueryOptions<TBleData, TDbData, TData> {
  /** Clé de query principale (inclut isConnected pour re-fetch automatique) */
  queryKey: unknown[];
  /** Fonction pour charger depuis BLE (priorité) */
  bleQueryFn?: () => Promise<TBleData>;
  /** Fonction pour charger depuis la DB (fallback) */
  dbQueryFn: () => Promise<TDbData>;
  /** Indique si BLE est connecté */
  isConnected: boolean;
  /** Active/désactive la query */
  enabled?: boolean;
  /** Transforme les données BLE vers le format attendu */
  transformBleData?: (bleData: TBleData) => TData;
  /** Transforme les données DB vers le format attendu */
  transformDbData: (dbData: TDbData) => TData;
  /** Options supplémentaires pour React Query */
  queryOptions?: Omit<UseQueryOptions<TData, Error>, 'queryKey' | 'queryFn' | 'enabled' | 'placeholderData'>;
}

/**
 * Hook pour les queries "BLE First"
 * Charge rapidement depuis BLE si connecté, puis utilise DB en fallback
 */
export function useBleFirstQuery<TBleData, TDbData, TData>({
  queryKey,
  bleQueryFn,
  dbQueryFn,
  isConnected,
  enabled = true,
  transformBleData,
  transformDbData,
  queryOptions,
}: BleFirstQueryOptions<TBleData, TDbData, TData>): UseQueryResult<TData, Error> {
  // Query pour charger depuis BLE (utilisée comme placeholderData si disponible)
  const bleQuery = useQuery<TBleData, Error>({
    queryKey: [...queryKey, 'ble'],
    queryFn: bleQueryFn || (async () => { throw new Error('BLE query function not provided'); }),
    enabled: enabled && isConnected && !!bleQueryFn,
    staleTime: 30000, // 30s pour BLE
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Query pour charger depuis la DB (fallback)
  const dbQuery = useQuery<TDbData, Error>({
    queryKey: [...queryKey, 'db'],
    queryFn: dbQueryFn,
    enabled,
    staleTime: 60000, // 60s pour la DB
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Calculer le placeholderData depuis les données BLE si disponibles, sinon DB
  const placeholderData = bleQuery.data && transformBleData
    ? transformBleData(bleQuery.data)
    : dbQuery.data
    ? transformDbData(dbQuery.data)
    : undefined;

  // Query principale qui utilise BLE en priorité, puis DB en fallback
  const mainQuery = useQuery({
    queryKey: [...queryKey, isConnected],
    queryFn: async (): Promise<TData> => {
      // Si BLE est connecté et qu'on a une fonction BLE, essayer de charger depuis BLE
      if (isConnected && bleQueryFn && transformBleData) {
        try {
          const bleData = await bleQueryFn();
          return transformBleData(bleData);
        } catch (error) {
          // Si BLE échoue mais qu'on a des données DB, on les retourne
          if (dbQuery.data) {
            console.warn('[useBleFirstQuery] Erreur BLE, utilisation des données DB:', error);
            return transformDbData(dbQuery.data);
          }
          
          throw error instanceof Error ? error : new Error('Erreur lors de la récupération des données via BLE');
        }
      }

      // Si BLE n'est pas connecté ou pas de fonction BLE, retourner les données DB
      if (dbQuery.data) {
        return transformDbData(dbQuery.data);
      }

      if (dbQuery.error) {
        throw dbQuery.error;
      }

      // Aucune source disponible
      throw new Error('Impossible de récupérer les données : BLE non connecté et données non disponibles dans la base de données');
    },
    enabled,
    // @ts-expect-error - placeholderData nécessite un cast pour compatibilité avec les types React Query stricts
    placeholderData: placeholderData, // Utilise les données BLE comme placeholder, DB en fallback
    staleTime: isConnected ? 30000 : 60000, // 30s si connecté, 60s si déconnecté
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    ...queryOptions,
  });

  return mainQuery as UseQueryResult<TData, Error>;
}
