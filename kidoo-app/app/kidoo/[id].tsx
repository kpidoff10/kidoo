/**
 * Écran de détails d'un Kidoo
 * Modale affichant les informations d'un Kidoo
 */

import { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/contexts/AuthContext';
import { ThemedView } from '@/components/themed-view';
import { getKidooById } from '@/services/kidooService';
import type { Kidoo } from '@/services/kidooService';
import { LoadingState, ErrorState } from '@/screens/kidoo/models/components';
import { KidooDetailRouter } from '@/screens/kidoo/models';

export default function KidooDetailScreen() {
  const theme = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [kidoo, setKidoo] = useState<Kidoo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          // Mettre à jour le titre de la modale avec le nom du Kidoo
          navigation.setOptions({
            title: result.data.name,
          });
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
  }, [id, user?.id, navigation]);

  // Note: La déconnexion Bluetooth est gérée par l'écran de liste des Kidoos
  // quand on retourne à la liste. Cela évite les problèmes de navigation
  // et garde la connexion active entre détails et édition.

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
        <KidooDetailRouter
          kidoo={kidoo}
          onEdit={() => {
            // Rediriger vers la modale d'édition selon le modèle
            router.push(`/kidoo/${kidoo.id}/edit`);
          }}
          onViewInfo={() => {
            // TODO: Implémenter l'affichage des informations détaillées
            console.log('Informations:', kidoo);
          }}
          onKidooUpdated={(updatedKidoo) => {
            if (updatedKidoo === null) {
              // Kidoo supprimé, fermer la modale et retourner à la liste
              router.back();
            } else {
              // Kidoo mis à jour, mettre à jour l'état et le titre
              setKidoo(updatedKidoo);
              navigation.setOptions({
                title: updatedKidoo.name,
              });
            }
          }}
        />
      ) : null}
    </ThemedView>
  );
}
