/**
 * Composant pour la configuration WiFi d'un Kidoo
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { BottomSheet, type BottomSheetModalRef } from '@/components/ui/bottom-sheet';
import { useKidooEditBluetooth } from '../../kidoo-edit-bluetooth-context';
import { bleManager } from '@/services/bleManager';
import { wifiService } from '@/services/wifiService';
import type { BluetoothResponse } from '@/types/bluetooth';
import {
  WifiConfigHeader,
  WifiConfigAlerts,
  WifiSSIDField,
  WifiPasswordField,
  WifiConfigActions,
} from './components';

interface WifiConfigSheetProps {
  ref: React.RefObject<BottomSheetModalRef>;
  kidoo: { id: string; name: string; wifiSSID?: string | null };
  onSuccess?: () => void;
  onDismiss?: () => void;
}

export const WifiConfigSheet = React.forwardRef<BottomSheetModalRef, Omit<WifiConfigSheetProps, 'ref'>>(
  ({ kidoo, onSuccess, onDismiss }, ref) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const { isConnected } = useKidooEditBluetooth();
    const [wifiSSID, setWifiSSID] = useState('');
    const [wifiPassword, setWifiPassword] = useState('');
    const [isConfiguring, setIsConfiguring] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const shouldLoadSSIDRef = useRef(true);

    // Charger le SSID quand la modale s'ouvre ou quand le kidoo change
    const loadCurrentSSID = useCallback(async () => {
      try {
        // Priorité au SSID du Kidoo s'il existe
        if (kidoo.wifiSSID) {
          console.log('[WifiConfigSheet] SSID du Kidoo détecté:', kidoo.wifiSSID);
          setWifiSSID(kidoo.wifiSSID);
        } else {
          // Sinon, récupérer le SSID du réseau WiFi actuel de l'appareil
          const currentSSID = await wifiService.getCurrentSSID();
          if (currentSSID) {
            console.log('[WifiConfigSheet] SSID WiFi actuel détecté:', currentSSID);
            setWifiSSID(currentSSID);
          }
        }
        shouldLoadSSIDRef.current = false;
      } catch (error) {
        console.error('[WifiConfigSheet] Erreur lors de la récupération du SSID:', error);
      }
    }, [kidoo.wifiSSID]);

    // Recharger le SSID quand le flag indique qu'on doit le faire
    useEffect(() => {
      if (shouldLoadSSIDRef.current) {
        loadCurrentSSID();
      }
    }, [kidoo.wifiSSID, kidoo.id, loadCurrentSSID]);

    // Recharger le SSID au montage du composant
    useEffect(() => {
      loadCurrentSSID();
    }, [loadCurrentSSID]);

    const handleConfigure = async () => {
      if (!wifiSSID.trim()) {
        setError(t('kidoos.detail.wifi.errorSSIDRequired', 'Le nom du réseau WiFi est requis'));
        return;
      }

      if (!isConnected) {
        setError(t('kidoos.detail.wifi.errorNotConnected', 'Le Kidoo n\'est pas connecté'));
        return;
      }

      setIsConfiguring(true);
      setError(null);
      setSuccess(false);

      try {
        // Démarrer le monitoring des réponses
        const stopMonitoring = await bleManager.startMonitoring((response: BluetoothResponse) => {
          const { status, message } = response;

          if (status === 'success' || message === 'WIFI_OK') {
            console.log('[WifiConfigSheet] WiFi configuré avec succès');
            setSuccess(true);
            setIsConfiguring(false);
            if (stopMonitoring) {
              stopMonitoring();
            }
            setTimeout(() => {
              if (ref && 'current' in ref && ref.current) {
                (ref.current as any).dismiss();
              }
              onSuccess?.();
            }, 1500);
          } else if (status === 'error' || message === 'WIFI_ERROR') {
            console.log('[WifiConfigSheet] Erreur WiFi:', response.error);
            setError(response.error || t('kidoos.detail.wifi.errorConfigFailed', 'Erreur lors de la configuration WiFi'));
            setIsConfiguring(false);
            if (stopMonitoring) {
              stopMonitoring();
            }
          }
        });

        // Attendre un peu que le monitoring soit prêt
        await new Promise((resolve) => setTimeout(resolve, 200));

        // Envoyer la commande SETUP
        const commandJson = JSON.stringify({
          command: 'SETUP',
          ssid: wifiSSID.trim(),
          password: wifiPassword || '',
        });

        console.log('[WifiConfigSheet] Envoi de la commande SETUP:', commandJson);
        const success = await bleManager.sendCommand(commandJson);
        
        if (!success) {
          if (stopMonitoring) {
            stopMonitoring();
          }
          throw new Error(t('kidoos.detail.wifi.errorSendFailed', 'Erreur lors de l\'envoi de la commande'));
        }
      } catch (err) {
        console.error('[WifiConfigSheet] Erreur:', err);
        setError(err instanceof Error ? err.message : t('kidoos.detail.wifi.errorConfigFailed', 'Erreur lors de la configuration WiFi'));
        setIsConfiguring(false);
      }
    };

    const handleCancel = () => {
      // Fermer la modale
      if (ref && 'current' in ref && ref.current) {
        (ref.current as any).dismiss();
      }
    };

    const handleDismiss = () => {
      // Réinitialiser les états quand la modale se ferme
      setWifiPassword('');
      setError(null);
      setSuccess(false);
      // Réinitialiser le flag pour permettre le rechargement à la prochaine ouverture
      shouldLoadSSIDRef.current = true;
      // Recharger le SSID immédiatement pour qu'il soit prêt à la prochaine ouverture
      loadCurrentSSID();
      onDismiss?.();
    };

    const handleSSIDChange = (text: string) => {
      setWifiSSID(text);
      setError(null);
    };

    const handlePasswordChange = (text: string) => {
      setWifiPassword(text);
      setError(null);
    };

    return (
      <BottomSheet
        ref={ref}
        enablePanDownToClose={!isConfiguring && !success}
        enableHandlePanningGesture={!isConfiguring && !success}
        onDismiss={handleDismiss}
      >
        <ScrollView
          contentContainerStyle={{ padding: theme.spacing.lg }}
          showsVerticalScrollIndicator={false}
        >
          <WifiConfigHeader kidooName={kidoo.name} />

          <WifiConfigAlerts
            isConnected={isConnected}
            success={success}
            error={error}
          />

          <View style={{ gap: theme.spacing.md }}>
            <WifiSSIDField
              value={wifiSSID}
              onChangeText={handleSSIDChange}
              error={error}
              editable={!isConfiguring && !success}
            />

            <WifiPasswordField
              value={wifiPassword}
              onChangeText={handlePasswordChange}
              error={error}
              editable={!isConfiguring && !success}
            />
          </View>

          <WifiConfigActions
            isConfiguring={isConfiguring}
            success={success}
            isConnected={isConnected}
            hasSSID={!!wifiSSID.trim()}
            onCancel={handleCancel}
            onConfigure={handleConfigure}
          />
        </ScrollView>
      </BottomSheet>
    );
  }
);

WifiConfigSheet.displayName = 'WifiConfigSheet';
