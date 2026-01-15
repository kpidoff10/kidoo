/**
 * Écran de détails d'un tag NFC
 * Modale affichant le contenu d'un tag
 */
import { useLocalSearchParams } from 'expo-router';
import { TagDetails } from '@/screens/kidoo/models/basic/nfc/details';

export default function TagDetailScreen() {
  const { id: kidooId, tagId } = useLocalSearchParams<{ id: string; tagId: string }>();

  if (!kidooId || !tagId) {
    return null;
  }

  return <TagDetails kidooId={kidooId} tagId={tagId} />;
}
