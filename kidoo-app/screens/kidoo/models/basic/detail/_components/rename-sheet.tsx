/**
 * Composant pour le sheet de renommage d'un Kidoo
 */

import { useState, useEffect, forwardRef } from 'react';
import { View, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { BottomSheet, type BottomSheetModalRef } from '@/components/ui/bottom-sheet';
import { AlertMessage } from '@/components/ui/alert-message';
import { useKidoo } from '@/contexts/KidooContext';

export const RenameSheet = forwardRef<BottomSheetModalRef>(
  (_props, ref) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const { updateKidoo, kidoo } = useKidoo();
    const [newName, setNewName] = useState(kidoo.name);
    const [isRenaming, setIsRenaming] = useState(false);
    const [renameError, setRenameError] = useState<string | null>(null);

    // Réinitialiser le nom quand le Kidoo change
    useEffect(() => {
      setNewName(kidoo.name);
      setRenameError(null);
    }, [kidoo.name]);

    const handleRename = () => {
      if (!newName.trim()) {
        setRenameError(t('kidoos.detail.rename.errorEmpty', 'Le nom ne peut pas être vide'));
        return;
      }

      setIsRenaming(true);
      setRenameError(null);

      updateKidoo({ name: newName.trim() })
        .then((result) => {
          if (result.success && result.data) {
            // Fermer la modale
            if (ref && 'current' in ref && ref.current) {
              (ref.current as any).dismiss();
            }
          } else {
            setRenameError((result as { success: false; error: string }).error || t('kidoos.detail.rename.error', 'Erreur lors du renommage'));
          }
        })
        .catch(() => {
        setRenameError(t('kidoos.detail.rename.error', 'Erreur lors du renommage'));
        })
        .finally(() => {
        setIsRenaming(false);
        });
    };

    const handleCancel = () => {
      // Fermer la modale seulement si on n'est pas en train de renommer
      if (!isRenaming) {
        if (ref && 'current' in ref && ref.current) {
          (ref.current as any).dismiss();
        }
      }
    };

    const handleDismiss = () => {
      setNewName(kidoo.name);
      setRenameError(null);
    };

   
    return (
      <BottomSheet
        ref={ref}
        detents={['auto']}
        enablePanDownToClose={!isRenaming}
        enableHandlePanningGesture={!isRenaming}
        onDismiss={handleDismiss}
      >
        <View style={{ padding: theme.spacing.lg }}>
          <ThemedText type="title" style={{ marginBottom: theme.spacing.md }}>
            {t('kidoos.detail.rename.title', 'Renommer le Kidoo')}
          </ThemedText>

          <ThemedText style={{ marginBottom: theme.spacing.sm }}>
            {t('kidoos.detail.rename.nameLabel', 'Nom du Kidoo')}
          </ThemedText>

          <TextInput
            value={newName}
            onChangeText={(text) => {
              setNewName(text);
              setRenameError(null);
            }}
            placeholder={t('kidoos.detail.rename.namePlaceholder', 'Mon Kidoo')}
            style={{
              backgroundColor: theme.colors.surfaceSecondary,
              borderRadius: theme.borderRadius.md,
              padding: theme.spacing.md,
              fontSize: theme.typography.fontSize.md,
              color: theme.colors.text,
              marginBottom: theme.spacing.md,
            }}
            autoFocus
          />

          {renameError && (
            <AlertMessage
              type="error"
              message={renameError}
              style={{ marginBottom: theme.spacing.md }}
            />
          )}

          <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
            <Button
              label={t('common.cancel', 'Annuler')}
              variant="outline"
              onPress={handleCancel}
              style={{ flex: 1 }}
              disabled={isRenaming}
            />
            <Button
              label={t('common.save', 'Enregistrer')}
              variant="primary"
              onPress={handleRename}
              style={{ flex: 1 }}
              loading={isRenaming}
              disabled={isRenaming || !newName.trim()}
            />
          </View>
        </View>
      </BottomSheet>
    );
  }
);

RenameSheet.displayName = 'RenameSheet';
