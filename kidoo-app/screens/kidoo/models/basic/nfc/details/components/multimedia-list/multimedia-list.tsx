/**
 * Composant principal pour afficher la liste des fichiers multimédias d'un tag
 */

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useBasicMultimediaByTag, useBasicMultimediaReorder, useBasicMultimediaDelete, useBasicMultimediaUpdateStatus } from '@/services/models/basic/hooks/use-basic-multimedia';
import type { MultimediaFile } from '@/services/models/basic/api/basic-api-multimedia';
import { DeleteConfirmationSheet, type DeleteConfirmationSheetRef } from '@/components/ui/delete-confirmation-sheet';
import { MultimediaListLoading } from './multimedia-list-loading';
import { MultimediaListError } from './multimedia-list-error';
import { MultimediaListEmpty } from './multimedia-list-empty';
import { MultimediaListContent } from './multimedia-list-content';
import { decodeFileName } from './utils';

export interface MultimediaListProps {
  tagId: string;
}

export function MultimediaList({ tagId }: MultimediaListProps) {
  const { t } = useTranslation();
  const { data, isLoading, error, refetch, isRefetching } = useBasicMultimediaByTag(tagId);
  const reorderMutation = useBasicMultimediaReorder(tagId);
  const deleteMutation = useBasicMultimediaDelete(tagId);
  const updateStatusMutation = useBasicMultimediaUpdateStatus(tagId);
  const deleteSheetRef = useRef<DeleteConfirmationSheetRef>(null);
  const [fileToDelete, setFileToDelete] = useState<MultimediaFile | null>(null);

  // Ouvrir le sheet de confirmation quand fileToDelete est défini
  useEffect(() => {
    if (fileToDelete) {
      // Utiliser un petit délai pour s'assurer que le composant est monté
      const timer = setTimeout(() => {
        deleteSheetRef.current?.present();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [fileToDelete]);
  
  // Fonction appelée quand l'ordre change (drag and drop)
  const handleDragEnd = useCallback(
    ({ data: newData }: { data: MultimediaFile[] }) => {
      // Envoyer le nouvel ordre au serveur (mutation optimiste gère la mise à jour UI)
      const fileIds = newData.map((file) => file.id);
      reorderMutation.mutate({ fileIds });
    },
    [reorderMutation]
  );

  // Fonction appelée quand on swipe pour supprimer
  const handleDelete = useCallback((item: MultimediaFile) => {
    setFileToDelete(item);
    // Le sheet sera ouvert automatiquement via useEffect
  }, []);

  // Fonction appelée quand on swipe pour désactiver/activer
  const handleDisable = useCallback((item: MultimediaFile) => {
    const newDisabledStatus = !item.disabled;
    // Mutation optimiste gère la mise à jour UI instantanément
    updateStatusMutation.mutate({
      fileId: item.id,
      disabled: newDisabledStatus,
    });
  }, [updateStatusMutation]);

  // Fonction de confirmation de suppression
  const handleConfirmDelete = useCallback(() => {
    if (!fileToDelete) return;
    
    // Mutation optimiste gère la suppression UI instantanément
    deleteMutation.mutate(
      { fileId: fileToDelete.id },
      {
        onSuccess: () => {
          setFileToDelete(null);
        },
        onError: () => {
          // Le rollback est géré automatiquement par la mutation optimiste
        },
      }
    );
  }, [fileToDelete, deleteMutation]);

  // Fonction d'annulation
  const handleCancelDelete = useCallback(() => {
    setFileToDelete(null);
  }, []);

  const files = useMemo(() => {
    if (!data?.success || !data.data) return [];
    // Trier par ordre pour s'assurer que la liste est dans le bon ordre
    return [...data.data].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [data]);

  // Mémoriser le message pour éviter qu'il devienne "undefined" quand fileToDelete devient null
  const deleteMessage = useMemo(() => {
    if (!fileToDelete) return '';
    return t('kidoos.multimedia.delete.message', 'Êtes-vous sûr de vouloir supprimer "{{fileName}}" ? Cette action est irréversible.', {
      fileName: decodeFileName(fileToDelete.originalName || fileToDelete.fileName),
    });
  }, [fileToDelete, t]);

  if (isLoading) {
    return <MultimediaListLoading />;
  }

  if (error || !data?.success) {
    return <MultimediaListError error={error} data={data} />;
  }

  if (files.length === 0) {
    return <MultimediaListEmpty />;
  }

  return (
    <>
      <MultimediaListContent
        files={files}
        onDragEnd={handleDragEnd}
        onRefresh={refetch}
        isRefetching={isRefetching}
        onDelete={handleDelete}
        onDisable={handleDisable}
      />
      {fileToDelete && (
        <DeleteConfirmationSheet
          ref={deleteSheetRef}
          title={t('kidoos.multimedia.delete.title', 'Supprimer le fichier')}
          message={deleteMessage}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          error={deleteMutation.isError ? (deleteMutation.error instanceof Error ? deleteMutation.error.message : t('kidoos.multimedia.delete.error', 'Erreur lors de la suppression')) : null}
        />
      )}
    </>
  );
}
