/**
 * Composant principal pour afficher la liste des fichiers multimédias d'un tag
 */

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useMultimediaByTag, useReorderMultimedia, useDeleteMultimedia, useUpdateMultimediaStatus } from '@/hooks/useMultimedia';
import type { MultimediaFile } from '@/services/multimediaService';
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
  const { data, isLoading, error, refetch, isRefetching } = useMultimediaByTag(tagId);
  const reorderMutation = useReorderMultimedia(tagId);
  const deleteMutation = useDeleteMultimedia(tagId);
  const updateStatusMutation = useUpdateMultimediaStatus(tagId);
  const deleteSheetRef = useRef<DeleteConfirmationSheetRef>(null);
  const [fileToDelete, setFileToDelete] = useState<MultimediaFile | null>(null);
  const [fileIdBeingUpdated, setFileIdBeingUpdated] = useState<string | null>(null);
  
  // État local pour la liste (pour le drag and drop)
  const [localFiles, setLocalFiles] = useState<MultimediaFile[]>([]);
  
  // Mettre à jour la liste locale quand les données changent
  useEffect(() => {
    if (data?.success && data.data) {
      // Trier par ordre pour s'assurer que la liste est dans le bon ordre
      const sortedFiles = [...data.data].sort((a, b) => (a.order || 0) - (b.order || 0));
      setLocalFiles(sortedFiles);
    }
  }, [data]);

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
      // Mettre à jour l'état local immédiatement pour un feedback visuel
      setLocalFiles(newData);
      
      // Envoyer le nouvel ordre au serveur
      const fileIds = newData.map((file) => file.id);
      reorderMutation.mutate(
        { fileIds },
        {
          onError: () => {
            // En cas d'erreur, restaurer l'ordre précédent
            if (data?.success && data.data) {
              const sortedFiles = [...data.data].sort((a, b) => (a.order || 0) - (b.order || 0));
              setLocalFiles(sortedFiles);
            }
          },
        }
      );
    },
    [reorderMutation, data]
  );

  // Fonction appelée quand on swipe pour supprimer
  const handleDelete = useCallback((item: MultimediaFile) => {
    setFileToDelete(item);
    // Le sheet sera ouvert automatiquement via useEffect
  }, []);

  // Fonction appelée quand on swipe pour désactiver/activer
  const handleDisable = useCallback(async (item: MultimediaFile) => {
    const newDisabledStatus = !item.disabled;
    setFileIdBeingUpdated(item.id);
    try {
      await updateStatusMutation.mutateAsync({
        fileId: item.id,
        disabled: newDisabledStatus,
      });
    } finally {
      setFileIdBeingUpdated(null);
    }
  }, [updateStatusMutation]);

  // Fonction de confirmation de suppression
  const handleConfirmDelete = useCallback(async () => {
    if (!fileToDelete) return;
    
    await deleteMutation.mutateAsync({ fileId: fileToDelete.id });
    setFileToDelete(null);
  }, [fileToDelete, deleteMutation]);

  // Fonction d'annulation
  const handleCancelDelete = useCallback(() => {
    setFileToDelete(null);
  }, []);

  const files = useMemo(
    () => localFiles.length > 0 ? localFiles : (data?.success ? data.data : []),
    [localFiles, data]
  );

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
        isUpdatingStatus={updateStatusMutation.isPending}
        fileIdBeingUpdated={fileIdBeingUpdated || undefined}
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
