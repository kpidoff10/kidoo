/**
 * Modale de détails pour le modèle Basic
 */

import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { updateKidoo, deleteKidoo } from '@/services/kidooService';
import { KidooEditBluetoothProvider, useKidooEditBluetooth } from '../../kidoo-edit-bluetooth-context';
import { useBottomSheet } from '@/components/ui/bottom-sheet';
import { ActionsMenu, RenameSheet, DeleteSheet } from './components';
import { StorageInfo, WifiConfigSheet } from '../../components';
import type { Kidoo } from '@/services/kidooService';

interface BasicDetailModalProps {
  kidoo: Kidoo;
  onEdit?: () => void;
  onViewInfo?: () => void;
  onKidooUpdated?: (updatedKidoo: Kidoo | null) => void;
}

function BasicDetailContent({
  kidoo,
  onEdit,
  onViewInfo,
  onKidooUpdated,
}: BasicDetailModalProps) {
  const router = useRouter();
  const { user } = useAuth();
  const renameSheet = useBottomSheet();
  const wifiSheet = useBottomSheet();
  const [isDeleteSheetOpen, setIsDeleteSheetOpen] = useState(false);
  
  // Utiliser le contexte Bluetooth pour la connexion automatique
  useKidooEditBluetooth();

  const handleRename = async (newName: string) => {
    if (!user?.id) {
      throw new Error('Utilisateur non connecté');
    }

    const result = await updateKidoo(kidoo.id, { name: newName }, user.id);
    if (result.success && result.data) {
      renameSheet.dismiss();
      onKidooUpdated?.(result.data);
    } else {
      throw new Error((result as { success: false; error: string }).error || 'Erreur lors du renommage');
    }
  };

  const handleDelete = async () => {
    if (!user?.id) return;

    const result = await deleteKidoo(kidoo.id, user.id);
    if (result.success) {
      setIsDeleteSheetOpen(false);
      onKidooUpdated?.(null);
    }
  };

  return (
    <>
      <StorageInfo kidoo={kidoo} />
      <ActionsMenu
        kidoo={kidoo}
        onRename={() => renameSheet.present()}
        onEdit={onEdit}
        onViewInfo={onViewInfo}
        onWifiConfig={() => wifiSheet.present()}
        onTags={() => {
          // Rediriger vers la page des tags
          router.push(`/kidoo/${kidoo.id}/tags`);
        }}
        onDelete={() => setIsDeleteSheetOpen(true)}
      />

      <RenameSheet
        ref={renameSheet.ref}
        kidoo={kidoo}
        onRename={handleRename}
      />

      <WifiConfigSheet
        ref={wifiSheet.ref}
        kidoo={kidoo}
      />

      <DeleteSheet
        kidoo={kidoo}
        onDelete={handleDelete}
        isOpen={isDeleteSheetOpen}
        onDismiss={() => setIsDeleteSheetOpen(false)}
      />
    </>
  );
}

export function BasicDetailModal(props: BasicDetailModalProps) {
  // Pas de badge pour le modèle Basic
  // Envelopper le composant dans le provider Bluetooth pour activer la connexion automatique
  return (
    <KidooEditBluetoothProvider kidoo={props.kidoo} autoConnect={true}>
      <BasicDetailContent {...props} />
    </KidooEditBluetoothProvider>
  );
}
