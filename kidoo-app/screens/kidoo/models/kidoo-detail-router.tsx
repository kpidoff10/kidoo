/**
 * Routeur pour les modales de détails selon le modèle du Kidoo
 * Sélectionne automatiquement la bonne modale selon le modèle
 */

import { useKidooById } from '@/services/models/common/hooks/useKidoos';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingState, ErrorState } from './components';
import { ClassicDetailModal } from './classic/detail';
import { BasicDetailModal } from './basic/detail';

interface KidooDetailRouterProps {
  kidooId: string;
}

/**
 * Routeur qui sélectionne la bonne modale selon le modèle du Kidoo
 */
export function KidooDetailRouter({
  kidooId,
}: KidooDetailRouterProps) {
  const { user } = useAuth();
  const { data: kidooQuery, isLoading, error } = useKidooById(kidooId, !!user?.id);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !kidooQuery?.success) {
    return <ErrorState error={error?.message || 'Erreur lors du chargement du Kidoo'} />;
  }

  const kidoo = kidooQuery.data;
  const model = kidoo.model?.toLowerCase() || 'classic';

  switch (model) {
    case 'basic':
      return (
        <BasicDetailModal
          kidooId={kidoo.id}
        />
      );

    case 'classic':
    default:
      return (
        <ClassicDetailModal
          kidooId={kidoo.id}
        />
      );

    // Ajoutez ici les nouveaux modèles :
    // case 'mini':
    //   return <MiniDetailModal kidooId={kidooId} ... />;
    // case 'pro':
    //   return <ProDetailModal kidooId={kidooId} ... />;
  }
}
