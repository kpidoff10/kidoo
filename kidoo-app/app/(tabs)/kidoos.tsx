/**
 * Écran "Mes kidoos"
 * Affiche la liste des appareils Kidoo de l'utilisateur
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import ParallaxScrollView from '@/components/ui/parallax-scroll-view';
import { TabScreen } from '@/components/ui/screen';
import { KidooList, BluetoothScanModal, KidooSetupModal } from '@/screens/kidoo';
import { FloatingActionButton } from '@/components/ui/floating-action-button';
import { BottomSheetModalRef } from '@/components/ui/bottom-sheet';
import { AlertMessage } from '@/components/ui/alert-message';
import { Button } from '@/components/ui/button';
import { getKidoos } from '@/services/kidooService';
import type { Kidoo } from '@/types/shared';

export default function KidoosScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [kidoos, setKidoos] = useState<Kidoo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scanModalRef = useRef<BottomSheetModalRef>(null);
  const setupModalRef = useRef<BottomSheetModalRef>(null);
  const [selectedDevice, setSelectedDevice] = useState<{
    id: string;
    name: string;
    deviceId: string;
  } | null>(null);

  const handleAddKidoo = useCallback(() => {
    // Ouvrir la modale de scan Bluetooth
    scanModalRef.current?.present();
  }, []);


  const handleDeviceSelect = useCallback(
    (device: { id: string; name: string; deviceId: string }) => {
      setSelectedDevice(device);
    },
    []
  );

  // Charger les Kidoos depuis l'API
  const loadKidoos = useCallback(async (isRefresh = false) => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const result = await getKidoos(user.id);
      if (result.success) {
        setKidoos(result.data);
      } else {
        setError(result.error || 'Erreur lors du chargement des Kidoos');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des Kidoos');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user?.id]);

  // Handler pour le pull-to-refresh
  const handleRefresh = useCallback(async () => {
    if (!user?.id) {
      return;
    }

    setIsRefreshing(true);
    setError(null);

    try {
      const result = await getKidoos(user.id);
      if (result.success) {
        setKidoos(result.data);
      } else {
        setError(result.error || 'Erreur lors du chargement des Kidoos');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des Kidoos');
    } finally {
      setIsRefreshing(false);
    }
  }, [user?.id]);

  // Charger les Kidoos au montage et quand l'utilisateur change
  useEffect(() => {
    loadKidoos();
  }, [loadKidoos]);

  // Note: La déconnexion Bluetooth automatique a été désactivée car elle causait des plantages
  // La connexion reste active, ce qui est acceptable car :
  // 1. Bluetooth Low Energy consomme très peu en mode connecté
  // 2. Le système gère automatiquement les connexions
  // 3. La connexion sera réutilisée si on revient aux détails/édition
  // Si nécessaire, la déconnexion peut être gérée manuellement ou après inactivité

  const handleSetupComplete = useCallback(() => {
    // Recharger la liste des Kidoos après la création
    loadKidoos();
    setSelectedDevice(null);
  }, [loadKidoos]);

  const handleSetupClose = useCallback(() => {
    setSelectedDevice(null);
  }, []);

  const handleScanClose = useCallback(() => {
    // Ouvrir le setup modal après la fermeture complète du scan modal
    if (selectedDevice) {
      setTimeout(() => {
        setupModalRef.current?.present();
      }, 100);
    }
  }, [selectedDevice]);

  const handleKidooPress = useCallback(
    (kidoo: Kidoo) => {
      router.push(`/kidoo/${kidoo.id}`);
    },
    [router]
  );

  return (
    <TabScreen>
      <View style={theme.components.screenContainer}>
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={theme.colors.tint} />
          </View>
        ) : error ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.lg }}>
            <AlertMessage
              message={error}
              type="error"
              visible={true}
            />
            <Button
              label={t('common.retry', 'Réessayer')}
              onPress={() => loadKidoos()}
              style={{ marginTop: theme.spacing.md }}
            />
          </View>
        ) : (
          <ParallaxScrollView refreshing={isRefreshing} onRefresh={handleRefresh}>
            <KidooList
              kidoos={kidoos}
              onKidooPress={handleKidooPress}
              emptyTitle={t('kidoos.empty.title')}
              emptyDescription={t('kidoos.empty.description')}
            />
          </ParallaxScrollView>
        )}
        <FloatingActionButton onPress={handleAddKidoo} icon="plus" />
      </View>
      
      
      {/* Modale de scan Bluetooth */}
      <BluetoothScanModal
        ref={scanModalRef}
        onDeviceSelect={handleDeviceSelect}
        onClose={handleScanClose}
      />
      
      {/* Modale de setup Kidoo */}
      <KidooSetupModal
        ref={setupModalRef}
        device={selectedDevice}
        onComplete={handleSetupComplete}
        onClose={handleSetupClose}
      />
    </TabScreen>
  );
}
