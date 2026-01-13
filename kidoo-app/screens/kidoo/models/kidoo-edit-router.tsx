/**
 * Routeur pour les modales d'édition selon le modèle du Kidoo
 * Sélectionne automatiquement la bonne modale d'édition selon le modèle
 * Enveloppe les modales dans le contexte Bluetooth pour gérer la connexion
 */

import React from 'react';
import type { Kidoo } from '@/services/kidooService';
import { BasicEditModal } from './basic/edit';
import { ClassicEditModal } from './classic/edit';
import { KidooEditBluetoothProvider } from './kidoo-edit-bluetooth-context';

interface KidooEditRouterProps {
  kidoo: Kidoo;
  onClose: () => void;
  onSave: (updatedKidoo: Kidoo) => void;
}

/**
 * Routeur qui sélectionne la bonne modale d'édition selon le modèle du Kidoo
 * La connexion Bluetooth est gérée automatiquement par le contexte
 */
export function KidooEditRouter({
  kidoo,
  onClose,
  onSave,
}: KidooEditRouterProps) {
  const model = kidoo.model?.toLowerCase() || 'classic';

  const renderModal = () => {
    switch (model) {
      case 'basic':
        return (
          <BasicEditModal
            kidoo={kidoo}
          />
        );

      case 'classic':
      default:
        return (
          <ClassicEditModal
            kidoo={kidoo}
            onClose={onClose}
            onSave={onSave}
          />
        );

      // Ajoutez ici les nouveaux modèles :
      // case 'mini':
      //   return <MiniEditModal kidoo={kidoo} onClose={onClose} onSave={onSave} />;
      // case 'pro':
      //   return <ProEditModal kidoo={kidoo} onClose={onClose} onSave={onSave} />;
    }
  };

  return (
    <KidooEditBluetoothProvider kidoo={kidoo} autoConnect={true}>
      {renderModal()}
    </KidooEditBluetoothProvider>
  );
}
