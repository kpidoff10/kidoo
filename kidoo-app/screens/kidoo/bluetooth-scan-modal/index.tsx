/**
 * Composant BluetoothScanModal
 * Modale pour scanner et sélectionner un appareil Kidoo via Bluetooth
 */

import React, { useCallback, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedTrueSheet, ThemedTrueSheetRef } from '@/components/ui/themed-true-sheet';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/contexts/AuthContext';
import { useBluetoothScan } from '@/hooks/use-bluetooth-scan';
import {
  ScannedDeviceItem,
  ScanHeader,
  ScanStatus,
  ScanEmptyState,
  ScanAlerts,
} from './components';

interface BluetoothScanModalProps {
  onDeviceSelect?: (device: { id: string; name: string; deviceId: string }) => void;
  onClose?: () => void;
}

export const BluetoothScanModal = React.forwardRef<
  ThemedTrueSheetRef,
  BluetoothScanModalProps
>(({ onDeviceSelect, onClose }, ref) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { isDeveloperMode } = useAuth();

  const {
    isScanning,
    scannedDevices,
    isBluetoothEnabled,
    error,
    startScan,
    stopScan,
    resetDevices,
    isAvailable,
  } = useBluetoothScan();

  const detents = useMemo(() => [0.75], []);

  // Démarrer le scan quand la modale s'ouvre
  const handlePresent = useCallback(() => {
    if (!isAvailable) {
      return; // Ne pas essayer de scanner si le module n'est pas disponible
    }
    resetDevices();
    startScan(10000); // Scanner pendant 10 secondes
  }, [startScan, resetDevices, isAvailable]);

  // Arrêter le scan quand la modale se ferme
  const handleDismiss = useCallback(() => {
    stopScan();
    resetDevices();
    if (onClose) {
      onClose();
    }
  }, [stopScan, resetDevices, onClose]);

  const handleDevicePress = useCallback(
    (device: {
      id: string;
      name: string | null;
      rssi: number | null;
      isConnectable: boolean | null;
    }) => {
      stopScan();
      const deviceData = {
        id: device.id,
        name: device.name || 'Kidoo',
        deviceId: device.id, // Pour l'instant, utiliser l'id comme deviceId
      };
      // Appeler onDeviceSelect avant de fermer pour stocker le device
      if (onDeviceSelect) {
        onDeviceSelect(deviceData);
      }
      // Fermer la modale de scan
      if (ref && 'current' in ref && ref.current) {
        ref.current.dismiss();
      }
    },
    [stopScan, ref, onDeviceSelect]
  );

  return (
    <ThemedTrueSheet
      ref={ref}
      detents={detents}
      onDidDismiss={handleDismiss}
      onDidPresent={handlePresent}
      dismissible={true}
      draggable={true}
      grabberOptions={theme.components.bluetoothScanHandleIndicator}
    >
        <ScanHeader />

        <ScanAlerts
          isAvailable={isAvailable}
          isBluetoothEnabled={isBluetoothEnabled}
          error={error}
        />

        <ScanStatus isScanning={isScanning} />

        {scannedDevices.length === 0 ? (
          <ScanEmptyState isScanning={isScanning} />
        ) : (
          scannedDevices.map((device) => (
            <ScannedDeviceItem
              key={device.id}
              device={device}
              onPress={() => handleDevicePress(device)}
              isDeveloperMode={isDeveloperMode}
            />
          ))
        )}

    </ThemedTrueSheet>
  );
});

BluetoothScanModal.displayName = 'BluetoothScanModal';
