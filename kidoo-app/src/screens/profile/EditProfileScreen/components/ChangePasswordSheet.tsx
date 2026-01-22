/**
 * Change Password Sheet Component
 * Bottom sheet pour modifier le mot de passe
 */

import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { PasswordInput, Button, BottomSheet } from '@/components/ui';
import { useTheme } from '@/theme';
import { UseBottomSheetReturn } from '@/hooks/useBottomSheet';
import { useChangePassword } from '@/hooks/useProfile';
import { z } from 'zod';

// Schéma local avec clés i18n pour l'app mobile
const changePasswordFormSchema = z.object({
  currentPassword: z.string().min(1, 'auth.errors.passwordRequired'),
  newPassword: z.string().min(8, 'auth.errors.passwordTooShort'),
});

type ChangePasswordFormData = z.infer<typeof changePasswordFormSchema>;

interface ChangePasswordSheetProps {
  bottomSheet: UseBottomSheetReturn;
  onClose?: () => void;
}

export function ChangePasswordSheet({ bottomSheet, onClose }: ChangePasswordSheetProps) {
  const { t } = useTranslation();
  const { colors, spacing } = useTheme();
  const { mutate: changePasswordMutate, isPending } = useChangePassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
    },
  });

  const onSubmit = useCallback(
    async (data: ChangePasswordFormData) => {
      changePasswordMutate(
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
        {
          onSuccess: async () => {
            // Réinitialiser le formulaire
            reset({
              currentPassword: '',
              newPassword: '',
            });
            // Fermer le sheet
            await bottomSheet.close();
            onClose?.();
          },
          onError: async (error: any) => {
            // Afficher l'erreur dans le champ approprié si le serveur indique un field
            const errorField = error?.response?.data?.field;
            const errorMessage = error?.response?.data?.error;
            
            if (errorField && errorMessage) {
              setError(errorField as keyof ChangePasswordFormData, {
                type: 'server',
                message: errorMessage,
              });
            }
            
            // En cas d'erreur, on rouvre le sheet pour que l'utilisateur puisse réessayer
            // L'erreur est déjà gérée par useChangePassword (toast)
            await bottomSheet.open();
          },
        }
      );
    },
    [changePasswordMutate, bottomSheet, onClose, reset, setError]
  );

  const handleCancel = useCallback(async () => {
    reset({
      currentPassword: '',
      newPassword: '',
    });
    await bottomSheet.close();
  }, [reset, bottomSheet]);

  const handleDismiss = useCallback(() => {
    // Mettre à jour l'état du hook
    bottomSheet.handleDidDismiss({} as any);
    // Réinitialiser le formulaire quand le sheet est fermé
    reset({
      currentPassword: '',
      newPassword: '',
    });
    onClose?.();
  }, [reset, onClose, bottomSheet]);

  return (
    <BottomSheet
      ref={bottomSheet.ref}
      name={bottomSheet.id}
      detents={['auto']}
      onDismiss={handleDismiss}
      headerTitle={t('profile.changePassword', { defaultValue: 'Modifier le mot de passe' })}
      headerIcon="lock-closed-outline"
    >
      <Controller
        control={control}
        name="currentPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <PasswordInput
            label={t('profile.currentPassword', { defaultValue: 'Mot de passe actuel' })}
            placeholder={t('profile.currentPasswordPlaceholder', {
              defaultValue: 'Entrez votre mot de passe actuel',
            })}
            autoFocus
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={
              errors.currentPassword
                ? t(errors.currentPassword.message as string, {
                    defaultValue: errors.currentPassword.message,
                  })
                : undefined
            }
            containerStyle={{ marginBottom: spacing[4] }}
            required
          />
        )}
      />

      <Controller
        control={control}
        name="newPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <PasswordInput
            label={t('profile.newPassword', { defaultValue: 'Nouveau mot de passe' })}
            placeholder={t('profile.newPasswordPlaceholder', {
              defaultValue: 'Entrez votre nouveau mot de passe',
            })}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={
              errors.newPassword
                ? t(errors.newPassword.message as string, {
                    defaultValue: errors.newPassword.message,
                  })
                : undefined
            }
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
          disabled={isPending}
        />
        <Button
          title={t('common.save')}
          variant="primary"
          onPress={handleSubmit(onSubmit)}
          style={styles.saveButton}
          loading={isPending}
          disabled={isPending}
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
