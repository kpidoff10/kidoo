/**
 * Écran de détails d'un Kidoo
 * Modale affichant les informations d'un Kidoo
 * Le chargement du Kidoo est géré par KidooDetailRouter et KidooProvider
 */

import { useLocalSearchParams } from 'expo-router';
import { KidooDetailRouter } from '@/screens/kidoo/models';

export default function KidooDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  // Note: La déconnexion Bluetooth est gérée par l'écran de liste des Kidoos
  // quand on retourne à la liste. Cela évite les problèmes de navigation
  // et garde la connexion active entre détails et édition.

  if (!id) {
    return null;
  }

  return (
      <KidooDetailRouter kidooId={id} />
  );
}
