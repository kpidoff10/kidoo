/**
 * Edit Kidoo Name Sheet Component
 * Bottom sheet pour modifier le nom d'un Kidoo
 */

import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { TextInput, Button, BottomSheet } from '@/components/ui';
import { useTheme } from '@/theme';
import { UseBottomSheetReturn } from '@/hooks/useBottomSheet';
import { useUpdateKidooName } from '@/hooks/useKidoos';
import { Kidoo } from '@/api';
import { updateKidooNameSchema, UpdateKidooNameInput } from '@shared';

type EditKidooNameFormData = UpdateKidooNameInput;

interface EditKidooNameSheetProps {
  bottomSheet: UseBottomSheetReturn;
  kidoo: Kidoo;
  onClose?: () => void;
}

export function EditKidooNameSheet({ bottomSheet, kidoo, onClose }: EditKidooNameSheetProps) {
  const { t } = useTranslation();
  const { spacing } = useTheme();
  const updateKidooName = useUpdateKidooName();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditKidooNameFormData>({
    resolver: zodResolver(updateKidooNameSchema),
    defaultValues: {
      name: kidoo.name || '',
    },
  });

  // Réinitialiser le formulaire quand le kidoo change
  useEffect(() => {
    reset({ name: kidoo.name || '' });
  }, [kidoo.name, reset]);

  const onSubmit = useCallback(
    async (data: EditKidooNameFormData) => {
      updateKidooName.mutate(
        { id: kidoo.id, name: data.name },
        {
          onError: async () => {
            // En cas d'erreur, on rouvre le sheet pour que l'utilisateur puisse réessayer
            // L'erreur est déjà gérée par useUpdateKidooName (toast + rollback)
            await bottomSheet.open();
          },
        }
      );
      
      // Fermer le sheet immédiatement après la mutation optimiste
      // L'UI est déjà mise à jour grâce à l'optimistic update
      await bottomSheet.close();
      onClose?.();
    },
    [updateKidooName, kidoo.id, bottomSheet, onClose]
  );

  const handleCancel = useCallback(async () => {
    reset({ name: kidoo.name || '' });
    await bottomSheet.close();
  }, [reset, kidoo.name, bottomSheet]);

  const handleDismiss = useCallback(() => {
    // Mettre à jour l'état du hook
    bottomSheet.handleDidDismiss({} as any);
    // Réinitialiser le formulaire quand le sheet est fermé
    reset({ name: kidoo.name || '' });
    onClose?.();
  }, [reset, kidoo.name, onClose, bottomSheet]);

  return (
    <BottomSheet
      ref={bottomSheet.ref}
      name={bottomSheet.id}
      detents={['auto']}
      onDismiss={handleDismiss}
      headerTitle={t('kidoos.editName', { defaultValue: 'Modifier le nom' })}
      headerIcon="create-outline"
    >
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label={t('kidoos.name', { defaultValue: 'Nom de l\'appareil' })}
            placeholder={t('device.add.form.namePlaceholder', {
              defaultValue: 'Ex: Kidoo du salon',
            })}
            autoFocus
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.name ? t(errors.name.message as string) : undefined}
            autoCapitalize="words"
            autoCorrect={false}
            containerStyle={{ marginBottom: spacing[6] }}
            required
          />
        )}
      />

      <View style={styles.actions}>
        <Button
          title={t('common.cancel')}
          variant="outline"
          onPress={handleCancel}
          style={styles.cancelButton}
        />
        <Button
          title={t('common.save')}
          variant="primary"
          onPress={handleSubmit(onSubmit)}
          style={styles.saveButton}
        />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
});
