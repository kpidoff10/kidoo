/**
 * Composant Header avec icône de profil
 * Affiche un menu en haut de l'application avec une icône de profil
 */

import React, { useMemo, useCallback, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigation } from '@/contexts/NavigationContext';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BottomSheet, useBottomSheet } from '@/components/ui/bottom-sheet';

const DEVELOPER_MODE_TAPS_REQUIRED = 10;
const TAP_RESET_TIMEOUT = 2000; // 2 secondes

export function Header() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const { user, logout, toggleDeveloperMode, isDeveloperMode } = useAuth();
  const { currentTitle } = useNavigation();
  const insets = useSafeAreaInsets();
  const { ref: bottomSheetRef, present, dismiss } = useBottomSheet();
  const tapCountRef = useRef(0);
  const tapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Nettoyer le timeout au démontage
  useEffect(() => {
    return () => {
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }
    };
  }, []);

  // Récupérer la version de l'app
  const appVersion = useMemo(() => {
    const version = Constants.expoConfig?.version || Constants.manifest?.version || '1.0.0';
    return version;
  }, []);

  const handleProfilePress = useCallback(() => {
    present();
  }, [present]);

  const handleLogout = async () => {
    dismiss();
    await logout();
    router.replace('/(auth)/login');
  };

  const handleVersionPress = useCallback(async () => {
    // Incrémenter le compteur
    tapCountRef.current += 1;

    // Réinitialiser le timeout précédent
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }

    // Vibration légère pour le feedback
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Ignorer les erreurs de haptics
    }

    // Si on a atteint le nombre requis de taps
    if (tapCountRef.current >= DEVELOPER_MODE_TAPS_REQUIRED) {
      tapCountRef.current = 0;
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
        tapTimeoutRef.current = null;
      }

      // Capturer l'état avant le toggle pour déterminer le message
      const wasEnabled = isDeveloperMode;

      // Basculer le mode développeur
      await toggleDeveloperMode();

      // Feedback haptique de succès
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        // Ignorer les erreurs de haptics
      }

      // Afficher une alerte selon l'état (après le toggle, donc inverse de l'état précédent)
      const isNowEnabled = !wasEnabled;
      Alert.alert(
        isNowEnabled
          ? t('app.developerMode.enabled.title', 'Mode développeur activé')
          : t('app.developerMode.disabled.title', 'Mode développeur désactivé'),
        isNowEnabled
          ? t('app.developerMode.enabled.message', 'Le mode développeur a été activé avec succès.')
          : t('app.developerMode.disabled.message', 'Le mode développeur a été désactivé avec succès.'),
        [{ text: t('common.close', 'Fermer') }]
      );
    } else {
      // Définir un timeout pour réinitialiser le compteur
      tapTimeoutRef.current = setTimeout(() => {
        tapCountRef.current = 0;
        tapTimeoutRef.current = null;
      }, TAP_RESET_TIMEOUT);
    }
  }, [isDeveloperMode, toggleDeveloperMode, t]);

  return (
    <>
      <View style={[{ ...theme.components.headerContainer, paddingTop: insets.top + theme.spacing.md }]}>
        <View style={theme.components.headerContent}>
          <ThemedText type="defaultSemiBold" style={theme.components.headerTitle}>
            {currentTitle}
          </ThemedText>
          <TouchableOpacity
            onPress={handleProfilePress}
            style={theme.components.profileButton}
            activeOpacity={0.7}
          >
            <IconSymbol
              name="person.fill"
              size={theme.iconSize.md}
              color={theme.colors.tint}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu bottom sheet du profil */}
      <BottomSheet 
        ref={bottomSheetRef} 
      >
        {user && (
          <View style={theme.components.menuHeader}>
            <IconSymbol name="person.fill" size={theme.iconSize.xl} color={theme.colors.tint} />
            <ThemedText type="defaultSemiBold" style={theme.components.menuUserName}>
              {user.name || user.email}
            </ThemedText>
            <ThemedText style={theme.components.menuUserEmail}>{user.email}</ThemedText>
          </View>
        )}

        <View style={theme.components.divider} />

        <TouchableOpacity style={theme.components.menuItem} onPress={handleLogout} activeOpacity={0.7}>
          <ThemedText style={theme.components.menuItemTextDanger}>{t('auth.logout')}</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={theme.components.menuItem} activeOpacity={0.7}>
          <ThemedText style={theme.components.menuItemText}>{t('common.cancel')}</ThemedText>
        </TouchableOpacity>

        {/* Version de l'app en bas */}
        <View style={[{ ...theme.components.versionContainer }]}>
          <TouchableOpacity onPress={handleVersionPress} activeOpacity={0.7}>
            <ThemedText style={theme.components.versionText}>
              {t('app.version', 'Version')} {appVersion}
              {isDeveloperMode && ` ${t('app.developerMode.badge', '(Dev)')}`}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </>
  );
}
