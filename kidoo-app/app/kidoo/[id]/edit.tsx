/**
 * Écran d'édition d'un Kidoo
 * Route dynamique qui redirige vers la bonne modale d'édition selon le modèle
 */

import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/contexts/AuthContext';
import { ThemedView } from '@/components/themed-view';
import { getKidooById } from '@/services/kidooService';
import type { Kidoo } from '@/services/kidooService';
import { LoadingState, ErrorState } from '@/screens/kidoo/models/components';
import { KidooEditRouter } from '@/screens/kidoo/models';

export default function KidooEditScreen() {
  const theme = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [kidoo, setKidoo] = useState<Kidoo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Ne pas déconnecter dans l'écran d'édition car on retourne toujours vers les détails
  // La déconnexion sera gérée par l'écran de détails quand on quitte vraiment

  useEffect(() => {
    const loadKidoo = async () => {
      if (!id || !user?.id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await getKidooById(id, user.id);
        if (result.success) {
          setKidoo(result.data);
        } else {
          setError(result.error || 'Erreur lors du chargement du Kidoo');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement du Kidoo');
      } finally {
        setIsLoading(false);
      }
    };

    loadKidoo();
  }, [id, user?.id]);

  const handleClose = () => {
    router.back();
  };

  console.log('kidoo', kidoo);

  return (
    <ThemedView style={[
      { flex: 1 },
      isLoading ? theme.components.loadingContainer : { paddingHorizontal: theme.spacing.xl, paddingTop: theme.spacing.md, paddingBottom: theme.spacing.xl }
    ]}>
      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : kidoo ? (
        <KidooEditRouter
          kidooId={kidoo.id}
          onClose={handleClose}
        />
      ) : null}
    </ThemedView>
  );
}
