/**
 * Composant pour le sheet de confirmation de suppression d'un Kidoo
 */

import { useTranslation } from 'react-i18next';
import { DeleteConfirmationSheet } from '@/components/ui/delete-confirmation-sheet';
import type { Kidoo } from '@/services/kidooService';

interface DeleteSheetProps {
  kidoo: Kidoo;
  onDelete: () => Promise<void>;
  isOpen: boolean;
  onDismiss?: () => void;
}

export function DeleteSheet({ kidoo, onDelete, isOpen, onDismiss }: DeleteSheetProps) {
  const { t } = useTranslation();

  const handleDelete = async () => {
    try {
      await onDelete();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  return (
    <DeleteConfirmationSheet
      title={t('kidoos.detail.delete.title', 'Supprimer le Kidoo')}
      message={t('kidoos.detail.delete.message', 'Êtes-vous sûr de vouloir supprimer "{{name}}" ?')}
      messageVariables={{ name: kidoo.name }}
      onConfirm={handleDelete}
      onCancel={onDismiss || (() => {})}
      onSuccess={() => {
        // Géré par le callback parent
      }}
      isOpen={isOpen}
    />
  );
}
