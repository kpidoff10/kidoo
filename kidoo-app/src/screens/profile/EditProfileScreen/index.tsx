/**
 * Edit Profile Screen
 * Écran pour modifier le profil utilisateur
 */

import React, { useRef, useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { TrueSheet } from '@lodev09/react-native-true-sheet';
import { Button, BottomSheetActions, MenuList, ContentScrollView } from '@/components/ui';
import { useTheme } from '@/theme';
import { EditNameSheet } from './components/EditNameSheet';
import { useBottomSheet } from '@/hooks/useBottomSheet';
import { useProfile } from '@/hooks/useProfile';

export function EditProfileScreen() {
  const { t } = useTranslation();
  const { colors, spacing } = useTheme();
  const { data: user } = useProfile();
  const deleteAccountSheetRef = useRef<TrueSheet>(null);
  const editNameSheet = useBottomSheet();

  const handleNamePress = useCallback(() => {
    editNameSheet.open();
  }, [editNameSheet]);

  // Configuration des items du menu
  const menuItems = useMemo(
    () => [
      {
        label: t('profile.name', { defaultValue: 'Nom' }),
        value: user?.name || '-',
        icon: 'person-outline' as const,
        onPress: handleNamePress,
      },
      {
        label: t('profile.email', { defaultValue: 'Email' }),
        value: user?.email || '-',
        icon: 'mail-outline' as const,
        disabled: true, // Email non modifiable
      },
    ],
    [user?.name, user?.email, handleNamePress, t]
  );

  const handleDeleteAccountPress = useCallback(() => {
    deleteAccountSheetRef.current?.present();
  }, []);

  const handleDeleteAccount = useCallback(async () => {
    // TODO: Implémenter la suppression du compte
    console.log('Supprimer le compte');
    deleteAccountSheetRef.current?.dismiss();
  }, []);

  const handleCancelDelete = useCallback(() => {
    deleteAccountSheetRef.current?.dismiss();
  }, []);

  return (

      <ContentScrollView>
        {/* Liste des informations */}
        <MenuList items={menuItems} />

      {/* Bouton Supprimer le compte */}
      <View style={{ marginTop: spacing[8] }}>
        <Button
          title={t('profile.deleteAccount')}
          variant="outline"
          onPress={handleDeleteAccountPress}
          fullWidth
          style={{ borderColor: colors.error }}
          textStyle={{ color: colors.error }}
        />
      </View>

      {/* Bottom Sheet de confirmation de suppression */}
      <BottomSheetActions
        ref={deleteAccountSheetRef}
        type="error"
        title={t('profile.deleteAccount')}
        message={t('profile.deleteAccountConfirm')}
        actions={[
          {
            label: t('common.cancel'),
            onPress: handleCancelDelete,
            variant: 'outline',
          },
          {
            label: t('profile.deleteAccount'),
            onPress: handleDeleteAccount,
            variant: 'primary',
          },
        ]}
      />

      {/* Bottom Sheet pour modifier le nom */}
      <EditNameSheet bottomSheet={editNameSheet} />
      </ContentScrollView>
 
  );
}
