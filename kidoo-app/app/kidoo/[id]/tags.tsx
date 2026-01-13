/**
 * Écran de gestion des tags NFC d'un Kidoo
 * Route dynamique pour gérer les tags NFC
 */

import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { ThemedView } from '@/components/themed-view';
import { getKidooById } from '@/services/kidooService';
import type { Kidoo } from '@/services/kidooService';
import { LoadingState } from '@/screens/kidoo/models/components';
import { BasicNFCTags } from '@/screens/kidoo/models/basic/nfc';

export default function KidooTagsScreen() {
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [kidoo, setKidoo] = useState<Kidoo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger le Kidoo
  useEffect(() => {
    const loadKidoo = async () => {
      if (!id || !user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const result = await getKidooById(id, user.id);
        if (result.success) {
          setKidoo(result.data);
        }
      } catch (err) {
        console.error('[KidooTagsScreen] Erreur chargement Kidoo:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadKidoo();
  }, [id, user?.id]);

  if (isLoading || !kidoo) {
  return (
      <ThemedView style={{ flex: 1 }}>
        <LoadingState />
    </ThemedView>
  );
  }

  // Utiliser le composant BasicNFCTags qui gère tout le reste
  return <BasicNFCTags kidoo={kidoo} />;
}
