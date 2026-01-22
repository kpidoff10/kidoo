/**
 * Edit Name Sheet Component
 * Bottom sheet pour modifier le nom de l'utilisateur
 */

import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { TextInput, Button, Text, BottomSheet } from '@/components/ui';
import { useTheme } from '@/theme';
import { UseBottomSheetReturn } from '@/hooks/useBottomSheet';
import { useUpdateProfile, useProfile } from '@/hooks/useProfile';

const editNameSchema = z.object({
  name: z.string().min(1, 'auth.errors.nameRequired'),
});

type EditNameFormData = z.infer<typeof editNameSchema>;

interface EditNameSheetProps {
  bottomSheet: UseBottomSheetReturn;
  onClose?: () => void;
}

export function EditNameSheet({ bottomSheet, onClose }: EditNameSheetProps) {
  const { t } = useTranslation();
  const { colors, spacing } = useTheme();
  const { data: user } = useProfile();
  const updateProfile = useUpdateProfile();

    const {
      control,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm<EditNameFormData>({
      resolver: zodResolver(editNameSchema),
      defaultValues: {
        name: user?.name || '',
      },
    });

    // Réinitialiser le formulaire quand le user change
    useEffect(() => {
      reset({ name: user?.name || '' });
    }, [user?.name, reset]);

    const onSubmit = useCallback(
      async (data: EditNameFormData) => {
        // Avec l'optimistic update, on peut fermer immédiatement
        // La mise à jour est déjà visible dans l'UI
        updateProfile.mutate(
          { name: data.name },
          {
            onError: async () => {
              // En cas d'erreur, on rouvre le sheet pour que l'utilisateur puisse réessayer
              // L'erreur est déjà gérée par useUpdateProfile (toast + rollback)
              await bottomSheet.open();
            },
          }
        );
        
        // Fermer le sheet immédiatement après la mutation optimiste
        // L'UI est déjà mise à jour grâce à l'optimistic update
        await bottomSheet.close();
        onClose?.();
      },
      [updateProfile, bottomSheet, onClose]
    );

    const handleCancel = useCallback(async () => {
      reset({ name: user?.name || '' });
      await bottomSheet.close();
    }, [reset, user?.name, bottomSheet]);

    const handleDismiss = useCallback(() => {
      // Mettre à jour l'état du hook
      bottomSheet.handleDidDismiss({} as any);
      // Réinitialiser le formulaire quand le sheet est fermé
      reset({ name: user?.name || '' });
      onClose?.();
    }, [reset, user?.name, onClose, bottomSheet]);

    return (
      <BottomSheet
        ref={bottomSheet.ref}
        name={bottomSheet.id}
        detents={['auto']}
        onDismiss={handleDismiss}
        headerTitle={t('profile.editName', { defaultValue: 'Modifier le nom' })}
        headerIcon="create-outline"
      >
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label={t('profile.name', { defaultValue: 'Nom' })}
                placeholder={t('auth.register.namePlaceholder', {
                  defaultValue: 'Votre nom',
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