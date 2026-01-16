/**
 * Composant pour le sheet de renommage d'un Kidoo
 * Utilise react-hook-form pour la gestion du formulaire avec validation Zod
 */

import { useEffect, useRef } from 'react';
import { View, TextInput } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { BottomSheet, type BottomSheetModalRef } from '@/components/ui/bottom-sheet';
import { AlertMessage } from '@/components/ui/alert-message';
import { useKidoo } from '@/services/models/common/contexts/KidooContext';
import { RenameActions } from './rename-actions';
import { renameKidooSchema, type RenameKidooInput } from '@/types/shared';

interface RenameSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModalRef | null>;
}

export const RenameSheet = ({ bottomSheetRef }: RenameSheetProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { updateKidoo, kidoo } = useKidoo();
  const textInputRef = useRef<TextInput>(null);

  // Initialiser react-hook-form avec validation Zod
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<RenameKidooInput>({
    resolver: zodResolver(renameKidooSchema),
    defaultValues: {
      name: kidoo.name,
    },
    mode: 'onBlur',
  });

  // Réinitialiser le nom quand le Kidoo change
  useEffect(() => {
    reset({ name: kidoo.name });
    clearErrors();
  }, [kidoo.name, reset, clearErrors]);

  const onSubmit = async (data: RenameKidooInput) => {
    clearErrors();

    try {
      const result = await updateKidoo({ name: data.name.trim() });
      
      if (result.success && result.data) {
        // Fermer la modale
        bottomSheetRef.current?.dismiss();
      } else {
        const errorMessage = (result as { success: false; error: string }).error || t('kidoos.detail.rename.error', 'Erreur lors du renommage');
        setError('root', {
          message: errorMessage,
        });
      }
    } catch {
      setError('root', {
        message: t('kidoos.detail.rename.error', 'Erreur lors du renommage'),
      });
    }
  };

  const handleCancel = () => {
    // Fermer la modale seulement si on n'est pas en train de renommer
    if (!isSubmitting) {
      bottomSheetRef.current?.dismiss();
    }
  };

  const handleDismiss = () => {
    reset({ name: kidoo.name });
    clearErrors();
  };

   
    return (
      <BottomSheet
        ref={bottomSheetRef}
        enablePanDownToClose={!isSubmitting}
        enableHandlePanningGesture={!isSubmitting}
        onDismiss={handleDismiss}

      >
        <View style={{ padding: theme.spacing.lg }}>
          <ThemedText type="title" style={{ marginBottom: theme.spacing.md }}>
            {t('kidoos.detail.rename.title', 'Renommer le Kidoo')}
          </ThemedText>

          <ThemedText style={{ marginBottom: theme.spacing.sm }}>
            {t('kidoos.detail.rename.nameLabel', 'Nom du Kidoo')}
          </ThemedText>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value, onBlur } }) => (
              <View>
                <TextInput
                  ref={textInputRef}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder={t('kidoos.detail.rename.namePlaceholder', 'Mon Kidoo')}
                  style={{
                    backgroundColor: theme.colors.surfaceSecondary,
                    borderRadius: theme.borderRadius.md,
                    padding: theme.spacing.md,
                    fontSize: theme.typography.fontSize.md,
                    color: theme.colors.text,
                    marginBottom: theme.spacing.xs,
                    borderWidth: 1,
                    borderColor: errors.name ? theme.colors.error : theme.colors.border,
                  }}
                />
                {errors.name && (
                  <ThemedText style={{ color: theme.colors.error, fontSize: theme.typography.fontSize.sm, marginBottom: theme.spacing.md }}>
                    {errors.name.message}
                  </ThemedText>
                )}
              </View>
            )}
          />

          {errors.root?.message && (
            <AlertMessage
              type="error"
              message={errors.root.message}
              style={{ marginBottom: theme.spacing.md }}
            />
          )}

          <RenameActions
            isSubmitting={isSubmitting}
            onCancel={handleCancel}
            onSave={handleSubmit(onSubmit)}
          />
        </View>
      </BottomSheet>
    );
};
