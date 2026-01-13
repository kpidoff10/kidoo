/**
 * Composant ScanAlerts
 * Affiche les messages d'alerte pour le scan Bluetooth
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertMessage } from '@/components/ui/alert-message';

interface ScanAlertsProps {
  isAvailable: boolean;
  isBluetoothEnabled: boolean;
  error: string | null;
}

export function ScanAlerts({ isAvailable, isBluetoothEnabled, error }: ScanAlertsProps) {
  const { t } = useTranslation();

  return (
    <>
      <AlertMessage
        message={
          t(
            'kidoos.scan.bluetoothNotAvailable',
            'Le Bluetooth nécessite un build natif. Assurez-vous d\'avoir lancé "npm run android" et non Expo Go.'
          )
        }
        type="error"
        visible={!isAvailable}
      />
      
      <AlertMessage message={error || ''} type="error" visible={!!error && isAvailable} />
      
      <AlertMessage
        message={t('kidoos.scan.bluetoothDisabled', 'Veuillez activer le Bluetooth')}
        type="warning"
        visible={isAvailable && !isBluetoothEnabled}
      />
    </>
  );
}
