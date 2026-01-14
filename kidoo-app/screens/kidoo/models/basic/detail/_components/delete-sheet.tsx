/**
 * Composant pour le sheet de confirmation de suppression d'un Kidoo
 */

import { useState, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { type BottomSheetModalRef } from '@/components/ui/bottom-sheet';
import { useKidoo } from '@/contexts/KidooContext';
import { DeleteConfirmationSheet } from '@/components/ui/delete-confirmation-sheet';

export const DeleteSheet = forwardRef<BottomSheetModalRef>(
  (_props, ref) => {
    const { t } = useTranslation();
    const { deleteKidoo, kidoo } = useKidoo();
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const handleDelete = async () => {
      setDeleteError(null);

      try {
        const result = await deleteKidoo();
        if (!result.success) {
          const errorMessage = (result as { success: false; error: string }).error || t('kidoos.detail.delete.error', 'Erreur lors de la suppression');
          setDeleteError(errorMessage);
          throw new Error(errorMessage);
        }
        // Le sheet sera fermé par DeleteConfirmationSheet après onSuccess
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : t('kidoos.detail.delete.error', 'Erreur lors de la suppression');
        setDeleteError(errorMessage);
        throw error; // Re-throw pour que DeleteConfirmationSheet gère l'erreur
      }
    };

    const handleCancel = () => {
      setDeleteError(null);
    };

    return (
      <DeleteConfirmationSheet
        ref={ref}
        title={t('kidoos.detail.delete.title', 'Supprimer le Kidoo')}
        message={t('kidoos.detail.delete.message', 'Êtes-vous sûr de vouloir supprimer "{{name}}" ?', {
          name: kidoo.name,
        })}
        messageVariables={{ name: kidoo.name }}
        onConfirm={handleDelete}
        onCancel={handleCancel}
        error={deleteError}
      />
    );
  }
);

DeleteSheet.displayName = 'DeleteSheet';
