/**
 * Routeur pour les modales de détails selon le modèle du Kidoo
 * Sélectionne automatiquement la bonne modale selon le modèle
 */

import type { Kidoo } from '@/services/kidooService';
import { BasicDetailModal } from './basic/detail';
import { ClassicDetailModal } from './classic/detail';

interface KidooDetailRouterProps {
  kidoo: Kidoo;
  onEdit?: () => void;
  onViewInfo?: () => void;
  onKidooUpdated?: (updatedKidoo: Kidoo | null) => void;
}

/**
 * Routeur qui sélectionne la bonne modale selon le modèle du Kidoo
 */
export function KidooDetailRouter({
  kidoo,
  onEdit,
  onViewInfo,
  onKidooUpdated,
}: KidooDetailRouterProps) {
  const model = kidoo.model?.toLowerCase() || 'classic';

  switch (model) {
    case 'basic':
      return (
        <BasicDetailModal
          kidoo={kidoo}
          onEdit={onEdit}
          onViewInfo={onViewInfo}
          onKidooUpdated={onKidooUpdated}
        />
      );

    case 'classic':
    default:
      return (
        <ClassicDetailModal
          kidoo={kidoo}
          onEdit={onEdit}
          onViewInfo={onViewInfo}
          onKidooUpdated={onKidooUpdated}
        />
      );

    // Ajoutez ici les nouveaux modèles :
    // case 'mini':
    //   return <MiniDetailModal ... />;
    // case 'pro':
    //   return <ProDetailModal ... />;
  }
}
