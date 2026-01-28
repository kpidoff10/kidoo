/**
 * Scan Kidoos Sheet Component
 * Bottom sheet pour scanner manuellement les Kidoos disponibles
 */

import React, { useCallback, useEffect, useMemo } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BottomSheet } from '@/components/ui';
import { BLEDevice, useBluetooth } from '@/contexts';
import { UseBottomSheetReturn } from '@/hooks/useBottomSheet';
import { useKidoos } from '@/hooks/useKidoos';
import { DeviceItem, EmptyState, ScanIndicator, ScanActions } from './components';

interface ScanKidoosSheetProps {
  bottomSheet: UseBottomSheetReturn;
  onClose?: () => void;
  onSelectDevice?: (device: BLEDevice) => void;
}

export function ScanKidoosSheet({ bottomSheet, onClose, onSelectDevice }: ScanKidoosSheetProps) {
  const { t } = useTranslation();
  const { 
    kidooDevices, 
    isScanning, 
    startScan, 
    stopScan, 
    clearScannedDevices,
    clearPendingKidoo,
  } = useBluetooth();
  const { data: kidoos } = useKidoos();

  // Filtrer les Kidoos pour ne montrer que ceux qui ne sont pas déjà ajoutés
  const availableKidoos = useMemo(() => {
    if (!kidooDevices || !kidoos) {
      return kidooDevices || [];
    }

    return kidooDevices.filter((device) => {
      // Vérifier si le device est déjà lié
      // Comparer avec deviceId, macAddress (WiFi) ou bluetoothMacAddress
      const isAlreadyLinked = kidoos.some(
        (kidoo) => kidoo.deviceId === device.id || kidoo.macAddress === device.id || kidoo.bluetoothMacAddress === device.id
      );
      return !isAlreadyLinked;
    });
  }, [kidooDevices, kidoos]);

  // Démarrer le scan quand le composant est monté (le sheet est ouvert)
  useEffect(() => {
    // Nettoyer les devices précédents et le pending pour éviter l'ouverture automatique
    clearScannedDevices();
    clearPendingKidoo();
    // Démarrer le scan
    startScan();

    // Arrêter le scan quand le composant est démonté (le sheet est fermé)
    return () => {
      stopScan();
    };
  }, [startScan, stopScan, clearScannedDevices, clearPendingKidoo]);

  const handleDismiss = useCallback(() => {
    // Appeler handleDidDismiss du hook pour résoudre la promesse de fermeture
    bottomSheet.handleDidDismiss({} as any);
    stopScan();
    onClose?.();
  }, [bottomSheet, stopScan, onClose]);

  const handleSelectDevice = useCallback((device: BLEDevice) => {
    // Arrêter le scan et nettoyer le pending pour éviter l'ouverture automatique
    stopScan();
    clearPendingKidoo();
    // Appeler onSelectDevice qui va fermer le sheet et ouvrir AddDeviceSheet
    onSelectDevice?.(device);
  }, [stopScan, clearPendingKidoo, onSelectDevice]);

  const handleRefresh = useCallback(() => {
    clearScannedDevices();
    startScan();
  }, [clearScannedDevices, startScan]);

  const renderDeviceItem = useCallback(({ item }: { item: BLEDevice }) => {
    return <DeviceItem device={item} onPress={handleSelectDevice} />;
  }, [handleSelectDevice]);

  return (
    <BottomSheet
      ref={bottomSheet.ref}
      name={bottomSheet.id}
      detents={['auto']}
      onDismiss={handleDismiss}
      headerTitle={t('bluetooth.scanKidoos', { defaultValue: 'Rechercher un Kidoo' })}
      headerIcon="search-outline"
    >
      <ScanIndicator isScanning={isScanning} />

      <FlatList
        data={availableKidoos}
        renderItem={renderDeviceItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => (
          <EmptyState isScanning={isScanning} onRefresh={handleRefresh} />
        )}
        contentContainerStyle={[
          availableKidoos.length === 0 && styles.emptyList,
        ]}
      />

      <ScanActions
        isScanning={isScanning}
        onStartScan={handleRefresh}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
