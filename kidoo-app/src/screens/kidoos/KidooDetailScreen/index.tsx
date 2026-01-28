/**
 * Kidoo Detail Screen
 * Écran pour afficher et gérer les détails d'un Kidoo
 */

import React, { useLayoutEffect, useCallback, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MenuList, ContentScrollView } from '@/components/ui';
import { showToast } from '@/components/ui/Toast';
import { useTheme } from '@/theme';
import { useKidooContext } from '@/contexts';
import { useBottomSheet } from '@/hooks/useBottomSheet';
import { RootStackParamList } from '@/navigation/types';
import { KidooNotFound, DeleteKidooButton, EditKidooNameSheet, WiFiConfigSheet, BrightnessConfigSheet, useKidooMenuItems } from './components';

type RouteParams = {
  kidooId: string;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function KidooDetailScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const route = useRoute();
  const navigation = useNavigation<NavigationProp>();
  const { kidooId } = (route.params as RouteParams) || {};
  const { getKidooById, deleteKidoo, getKidooModelHandler, checkOnline } = useKidooContext();
  const editNameSheet = useBottomSheet();
  const wifiConfigSheet = useBottomSheet();
  const brightnessConfigSheet = useBottomSheet();

  const kidoo = getKidooById(kidooId);
  const modelHandler = kidoo ? getKidooModelHandler(kidooId) : undefined;

  // Ref pour éviter d'appeler checkOnline plusieurs fois pour le même kidooId dans une session
  const hasCheckedOnlineRef = useRef<string | null>(null);

  // Vérifier si le Kidoo est en ligne quand on arrive sur l'écran ou quand on revient dessus
  useFocusEffect(
    useCallback(() => {
      // Réinitialiser le ref si on change de Kidoo
      if (hasCheckedOnlineRef.current !== kidooId) {
        hasCheckedOnlineRef.current = kidooId;
        
        // Vérifier que le Kidoo existe et a une adresse MAC avant de vérifier
        if (kidoo && kidoo.macAddress) {
          // Appeler checkOnline pour mettre à jour le statut
          checkOnline.mutateAsync(kidooId)
            .then((result) => {
              // Si le Kidoo n'est pas en ligne, afficher un toast warning
              if (!result.isOnline) {
                showToast.warning({
                  title: t('kidoos.detail.offline.title', { 
                    defaultValue: 'Kidoo hors ligne' 
                  }),
                  message: t('kidoos.detail.offline.message', {
                    defaultValue: 'Les modifications seront envoyées à la reconnexion WiFi'
                  }),
                });
              }
            })
            .catch(() => {
              // Erreur déjà gérée dans le hook useKidooCheckOnline
            });
        }
      }
    }, [kidooId, kidoo?.macAddress, checkOnline, t])
  );

  const handleEditName = useCallback(() => {
    editNameSheet.open();
  }, [editNameSheet]);

  const handleConfigureWiFi = useCallback(() => {
    wifiConfigSheet.open();
  }, [wifiConfigSheet]);

  const handleConfigureBrightness = useCallback(() => {
    brightnessConfigSheet.open();
  }, [brightnessConfigSheet]);

  const handleConfigureBedtime = useCallback(() => {
    navigation.navigate('BedtimeConfig', { kidooId });
  }, [navigation, kidooId]);

  const handleConfigureWakeup = useCallback(() => {
    navigation.navigate('WakeupConfig', { kidooId });
  }, [navigation, kidooId]);

  const menuItems = useKidooMenuItems({ 
    kidoo, 
    modelHandler, 
    onEditName: handleEditName,
    onConfigureWiFi: handleConfigureWiFi,
    onConfigureBrightness: handleConfigureBrightness,
    onConfigureBedtime: handleConfigureBedtime,
    onConfigureWakeup: handleConfigureWakeup,
  });

  // Mettre à jour le titre de la page avec le nom du Kidoo
  useLayoutEffect(() => {
    navigation.setOptions({
      title: kidoo?.name || t('kidoos.title', { defaultValue: 'Détails du Kidoo' }),
    });
  }, [navigation, kidoo?.name, t]);

  if (!kidoo) {
    return <KidooNotFound />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ContentScrollView>
        {/* Liste des informations */}
        <MenuList items={menuItems} />

        {/* Bouton Supprimer */}
        <DeleteKidooButton kidoo={kidoo} deleteKidoo={deleteKidoo} />
      </ContentScrollView>

      {/* Bottom Sheet pour modifier le nom */}
      {kidoo && (
        <EditKidooNameSheet
          bottomSheet={editNameSheet}
          kidoo={kidoo}
        />
      )}

      {/* Bottom Sheet pour configurer le WiFi */}
      {kidoo && (
        <WiFiConfigSheet
          bottomSheet={wifiConfigSheet}
          kidoo={kidoo}
          onComplete={() => {
            // Rafraîchir les données du Kidoo après configuration
            checkOnline.mutate(kidooId);
          }}
        />
      )}

      {/* Bottom Sheet pour configurer la luminosité */}
      {kidoo && (
        <BrightnessConfigSheet
          bottomSheet={brightnessConfigSheet}
          kidoo={kidoo}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
