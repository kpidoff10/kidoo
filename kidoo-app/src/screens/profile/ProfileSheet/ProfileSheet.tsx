/**
 * Profile Sheet Component
 * Bottom sheet pour afficher/modifier le profil
 */

import React, { forwardRef, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { Avatar, Text, Title, Button } from '@/components/ui';
import { useTheme } from '@/theme';
import { useAuth } from '@/contexts';

interface ProfileSheetProps {
  onClose: () => void;
}

export const ProfileSheet = forwardRef<BottomSheet, ProfileSheetProps>(
  ({ onClose }, ref) => {
    const { t } = useTranslation();
    const { colors, spacing, borderRadius } = useTheme();
    const { user, logout } = useAuth();

    const snapPoints = ['50%'];

    const handleLogout = useCallback(() => {
      Alert.alert(
        t('profile.logout'),
        t('profile.logoutConfirm'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: t('profile.logout'),
            style: 'destructive',
            onPress: async () => {
              await logout();
              onClose();
            },
          },
        ]
      );
    }, [logout, onClose, t]);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      ),
      []
    );

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: colors.border }}
        backgroundStyle={{
          backgroundColor: colors.surface,
          borderRadius: borderRadius['2xl'],
        }}
      >
        <BottomSheetView style={[styles.content, { padding: spacing[6] }]}>
          {/* Header */}
          <View style={styles.header}>
            <Avatar name={user?.name || ''} size="xl" />
            <Title level="h3" style={{ marginTop: spacing[4] }}>
              {user?.name}
            </Title>
            <Text color="secondary">{user?.email}</Text>
          </View>

          {/* Actions */}
          <View style={[styles.actions, { marginTop: spacing[8] }]}>
            <TouchableOpacity
              style={[styles.actionItem, { borderBottomColor: colors.border }]}
              onPress={() => {}}
            >
              <Ionicons name="person-outline" size={22} color={colors.text} />
              <Text style={{ marginLeft: spacing[3], flex: 1 }}>
                {t('profile.editProfile')}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionItem, { borderBottomColor: colors.border }]}
              onPress={() => {}}
            >
              <Ionicons name="settings-outline" size={22} color={colors.text} />
              <Text style={{ marginLeft: spacing[3], flex: 1 }}>
                {t('profile.settings')}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>

          {/* Logout */}
          <View style={{ marginTop: spacing[6] }}>
            <Button
              title={t('profile.logout')}
              variant="outline"
              onPress={handleLogout}
              fullWidth
              style={{ borderColor: colors.error }}
              textStyle={{ color: colors.error }}
            />
          </View>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

ProfileSheet.displayName = 'ProfileSheet';

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
  },
  actions: {},
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
});
