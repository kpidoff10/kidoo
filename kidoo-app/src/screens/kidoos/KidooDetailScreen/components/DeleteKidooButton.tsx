/**
 * Delete Kidoo Button Component
 * Bouton pour supprimer un Kidoo avec confirmation via InfoBottomSheet
 */

import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Button, InfoBottomSheet } from '@/components/ui';
import { useTheme } from '@/theme';
import { useBottomSheet } from '@/hooks/useBottomSheet';
import { Kidoo } from '@/api';
import { UseMutationResult } from '@tanstack/react-query';

interface DeleteKidooButtonProps {
  kidoo: Kidoo;
  deleteKidoo: UseMutationResult<void, Error, string, unknown>;
}

export function DeleteKidooButton({ kidoo, deleteKidoo }: DeleteKidooButtonProps) {
  const { t } = useTranslation();
  const { colors, spacing } = useTheme();
  const navigation = useNavigation();
  const deleteSheet = useBottomSheet();

  const handleDeletePress = useCallback(() => {
    deleteSheet.open();
  }, [deleteSheet]);

  const handleConfirmDelete = useCallback(async () => {
    try {
      await deleteKidoo.mutateAsync(kidoo.id);
      deleteSheet.close();
      navigation.goBack();
    } catch (error) {
      // L'erreur est déjà gérée par le hook
      deleteSheet.close();
    }
  }, [kidoo.id, deleteKidoo, deleteSheet, navigation]);

  const handleCancelDelete = useCallback(() => {
    deleteSheet.close();
  }, [deleteSheet]);

  return (
    <>
      <View style={[styles.container, { marginTop: spacing[8] }]}>
        <Button
          title={t('kidoos.actions.delete', { defaultValue: 'Supprimer le Kidoo' })}
          variant="outline"
          onPress={handleDeletePress}
          fullWidth
          style={{ borderColor: colors.error }}
          textStyle={{ color: colors.error }}
        />
      </View>

      <InfoBottomSheet
        bottomSheet={deleteSheet}
        type="error"
        title={t('kidoos.actions.delete', { defaultValue: 'Supprimer le Kidoo' })}
        message={t('kidoos.deleteConfirm', { 
          defaultValue: 'Êtes-vous sûr de vouloir supprimer ce Kidoo ?',
          name: kidoo.name 
        })}
        actions={[
          {
            label: t('common.cancel', { defaultValue: 'Annuler' }),
            onPress: handleCancelDelete,
            variant: 'outline',
          },
          {
            label: t('kidoos.actions.delete', { defaultValue: 'Supprimer' }),
            onPress: handleConfirmDelete,
            variant: 'primary',
          },
        ]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {},
});
