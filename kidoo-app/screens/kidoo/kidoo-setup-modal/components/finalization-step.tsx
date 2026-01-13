/**
 * Finalization Step Component
 * Étape 3 : Connexion Bluetooth et configuration WiFi finale
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { AlertMessage } from '@/components/ui/alert-message';
import { bleManager, type BLEDevice } from '@/services/bleManager';
import type { BluetoothResponse } from '@/types/bluetooth';

interface FinalizationStepProps {
  deviceName: string;
  deviceId: string;
  wifiSSID: string;
  wifiPassword: string;
  onProcessingChange?: (processing: boolean) => void;
  onSuccessChange?: (success: boolean) => void;
  createError?: string | null;
  onFirmwareVersionChange?: (version: string | null) => void;
  onModelChange?: (model: string | null) => void;
}

export function FinalizationStep({
  deviceName,
  deviceId,
  wifiSSID,
  wifiPassword,
  onProcessingChange,
  onSuccessChange,
  createError,
  onFirmwareVersionChange,
  onModelChange,
}: FinalizationStepProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [wifiStatus, setWifiStatus] = useState<'idle' | 'configuring' | 'success' | 'error'>('idle');
  const [wifiError, setWifiError] = useState<string | null>(null);
  
  const isMountedRef = useRef(true);
  const stopMonitoringRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Arrêter le monitoring si actif
      if (stopMonitoringRef.current) {
        stopMonitoringRef.current();
        stopMonitoringRef.current = null;
      }
    };
  }, []);

  // Connexion Bluetooth automatique au montage
  useEffect(() => {
    if (deviceId && connectionStatus === 'idle') {
      connectBluetooth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceId]);

  // Configuration WiFi automatique une fois connecté
  useEffect(() => {
    console.log('[FinalizationStep] 🔵 useEffect WiFi - connectionStatus:', connectionStatus, 'wifiSSID:', wifiSSID, 'wifiStatus:', wifiStatus, 'isConnected:', bleManager.isConnected());
    
    if (connectionStatus === 'connected' && wifiSSID && wifiStatus === 'idle' && bleManager.isConnected()) {
      console.log('[FinalizationStep] 🔵 Conditions remplies, lancement de la configuration WiFi dans 500ms...');
      // Attendre un peu pour être sûr que la connexion est stable
      const timeout = setTimeout(() => {
        if (isMountedRef.current) {
          console.log('[FinalizationStep] 🔵 Appel de configureWifi()');
          configureWifi();
        } else {
          console.log('[FinalizationStep] 🔵 Composant démonté, annulation');
        }
      }, 500);
      return () => {
        console.log('[FinalizationStep] 🔵 Cleanup timeout WiFi');
        clearTimeout(timeout);
      };
    } else {
      console.log('[FinalizationStep] 🔵 Conditions non remplies pour configurer WiFi');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionStatus, wifiSSID, wifiStatus]);

  // Notifier le parent des changements d'état
  useEffect(() => {
    const processing = connectionStatus === 'connecting' || wifiStatus === 'configuring';
    // Le succès nécessite que Bluetooth ET WiFi soient tous les deux OK
    const success = connectionStatus === 'connected' && wifiStatus === 'success';
    onProcessingChange?.(processing);
    onSuccessChange?.(success);
  }, [connectionStatus, wifiStatus, onProcessingChange, onSuccessChange]);

  const connectBluetooth = useCallback(async () => {
    if (!deviceId) return;

    setConnectionStatus('connecting');
    setConnectionError(null);

    try {
      const device: BLEDevice = {
        id: deviceId,
        name: deviceName,
        deviceId: deviceId,
      };

      const result = await bleManager.connect(device);

      if (!isMountedRef.current) return;

      if (result.success) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('error');
        setConnectionError(result.error || t('kidoos.setup.step3.connectionFailed', 'Échec de la connexion'));
      }
    } catch (error: any) {
      if (!isMountedRef.current) return;
      setConnectionStatus('error');
      setConnectionError(error?.message || t('kidoos.setup.step3.connectionFailed', 'Échec de la connexion'));
    }
  }, [deviceId, deviceName, t]);

  const configureWifi = useCallback(async () => {
    console.log('[FinalizationStep] 🚀 configureWifi appelé');
    console.log('[FinalizationStep] 🚀 isMounted:', isMountedRef.current, 'wifiSSID:', wifiSSID, 'isConnected:', bleManager.isConnected());
    
    if (!isMountedRef.current) {
      console.log('[FinalizationStep] 🚀 Composant démonté, annulation');
      return;
    }
    
    if (!wifiSSID) {
      console.log('[FinalizationStep] 🚀 Pas de SSID WiFi, annulation');
      setWifiStatus('error');
      setWifiError(t('kidoos.setup.step3.noWifiSSID', 'SSID WiFi manquant'));
      return;
    }
    
    if (!bleManager.isConnected()) {
      console.log('[FinalizationStep] 🚀 BLE non connecté, annulation');
      setWifiStatus('error');
      setWifiError(t('kidoos.setup.step3.notConnected', 'Bluetooth non connecté'));
      return;
    }

    console.log('[FinalizationStep] 🚀 Démarrage de la configuration WiFi pour:', wifiSSID);
    setWifiStatus('configuring');
    setWifiError(null);

    try {
      console.log('[FinalizationStep] 🚀 Démarrage du monitoring...');
      // Démarrer le monitoring des réponses
      const stopMonitoring = await bleManager.startMonitoring((response: BluetoothResponse) => {
        try {
          console.log('[FinalizationStep] 🚀 Notification reçue:', response);
          if (!isMountedRef.current) {
            console.log('[FinalizationStep] 🚀 Composant démonté, ignore notification');
            return;
          }

          const { status, message, firmwareVersion, model } = response;

          // Récupérer la version du firmware si disponible
          if (firmwareVersion && onFirmwareVersionChange) {
            onFirmwareVersionChange(firmwareVersion);
          }

          // Récupérer le modèle si disponible
          if (model && onModelChange) {
            onModelChange(model);
          }

          if (status === 'success' || message === 'WIFI_OK') {
            console.log('[FinalizationStep] 🚀 WiFi configuré avec succès');
            if (isMountedRef.current) {
              setWifiStatus('success');
              setWifiError(null);
            }
            if (stopMonitoringRef.current) {
              stopMonitoringRef.current();
              stopMonitoringRef.current = null;
            }
          } else if (status === 'error' || message === 'WIFI_ERROR') {
            console.log('[FinalizationStep] 🚀 Erreur WiFi:', response.error);
            if (isMountedRef.current) {
              setWifiStatus('error');
              setWifiError(response.error || t('kidoos.setup.step3.wifiConnectionFailed', 'Échec de la connexion WiFi'));
            }
            if (stopMonitoringRef.current) {
              stopMonitoringRef.current();
              stopMonitoringRef.current = null;
            }
          }
        } catch (error) {
          console.error('[FinalizationStep] 🚀 Erreur dans callback notification:', error);
        }
      });

      stopMonitoringRef.current = stopMonitoring;
      console.log('[FinalizationStep] 🚀 Monitoring démarré');

      // Attendre un peu que le monitoring soit prêt
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Envoyer la commande SETUP
      const commandJson = JSON.stringify({
        command: 'SETUP',
        ssid: wifiSSID,
        password: wifiPassword || '',
      });

      console.log('[FinalizationStep] 🚀 Envoi de la commande:', commandJson);
      const success = await bleManager.sendCommand(commandJson);
      console.log('[FinalizationStep] 🚀 Commande envoyée, success:', success);
      
      if (!success) {
        throw new Error(t('kidoos.setup.step3.sendCommandFailed', 'Erreur lors de l\'envoi de la commande'));
      }
    } catch (error: any) {
      console.error('[FinalizationStep] 🚀 Erreur dans configureWifi:', error);
      if (!isMountedRef.current) return;
      setWifiStatus('error');
      setWifiError(error?.message || t('kidoos.setup.step3.wifiConfigFailed', 'Erreur lors de la configuration WiFi'));
      if (stopMonitoringRef.current) {
        stopMonitoringRef.current();
        stopMonitoringRef.current = null;
      }
    }
  }, [wifiSSID, wifiPassword, t, onFirmwareVersionChange, onModelChange]);

  return (
    <ScrollView
      style={theme.components.setupStepContent}
      contentContainerStyle={theme.components.setupStepContentScroll}
      showsVerticalScrollIndicator={false}
    >
      
      <ThemedText type="defaultSemiBold" style={theme.components.setupStepTitle}>
        {t('kidoos.setup.step3.title', 'Finalisation')}
      </ThemedText>
      <ThemedText style={theme.components.setupStepDescription}>
        {t('kidoos.setup.step3.description', 'Connexion au Kidoo et configuration du réseau WiFi en cours...')}
      </ThemedText>

      {/* État de connexion Bluetooth */}
      <View style={[
        theme.components.setupStepInfoBox,
        { marginTop: theme.spacing.xl }
      ]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.md }}>
          <MaterialIcons
            name="bluetooth"
            size={24}
            color={
              connectionStatus === 'connected'
                ? theme.colors.success
                : connectionStatus === 'error'
                ? theme.colors.error
                : theme.colors.tint
            }
          />
          <ThemedText type="defaultSemiBold" style={{ marginLeft: theme.spacing.sm }}>
            {t('kidoos.setup.step3.bluetoothStatus', 'Connexion Bluetooth')}
          </ThemedText>
        </View>
        
        {connectionStatus === 'connecting' && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
            <ActivityIndicator size="small" color={theme.colors.tint} />
            <ThemedText>
              {t('kidoos.setup.step3.connecting', 'Connexion en cours...')}
            </ThemedText>
          </View>
        )}
        {connectionStatus === 'connected' && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
            <MaterialIcons name="check-circle" size={20} color={theme.colors.success} />
            <ThemedText style={{ color: theme.colors.success }}>
              {t('kidoos.setup.step3.connected', 'Connecté')}
            </ThemedText>
          </View>
        )}
        {connectionStatus === 'error' && connectionError && (
          <AlertMessage
            message={connectionError}
            type="error"
            style={{ marginTop: theme.spacing.sm }}
          />
        )}
      </View>

      {/* État de configuration WiFi */}
      {connectionStatus === 'connected' && (
        <View style={[
          theme.components.setupStepInfoBox,
          { marginTop: theme.spacing.lg }
        ]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.md }}>
            <MaterialIcons
              name="wifi"
              size={24}
              color={
                wifiStatus === 'success'
                  ? theme.colors.success
                  : wifiStatus === 'error'
                  ? theme.colors.error
                  : theme.colors.tint
              }
            />
            <ThemedText type="defaultSemiBold" style={{ marginLeft: theme.spacing.sm }}>
              {t('kidoos.setup.step3.wifiStatus', 'Configuration WiFi')}
            </ThemedText>
          </View>
          
          {wifiStatus === 'configuring' && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
              <ActivityIndicator size="small" color={theme.colors.tint} />
              <ThemedText>
                {t('kidoos.setup.step3.configuring', 'Configuration en cours...')}
              </ThemedText>
            </View>
          )}
          {wifiStatus === 'success' && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
              <MaterialIcons name="check-circle" size={20} color={theme.colors.success} />
              <ThemedText style={{ color: theme.colors.success }}>
                {t('kidoos.setup.step3.wifiSuccess', 'WiFi configuré avec succès')}
              </ThemedText>
            </View>
          )}
          {wifiStatus === 'error' && wifiError && (
            <AlertMessage
              message={wifiError}
              type="error"
              style={{ marginTop: theme.spacing.md }}
            />
          )}
        </View>
      )}

      {/* Erreur de création du Kidoo */}
      {createError && (
          <AlertMessage
          message={createError}
          type="error"
          style={{ marginTop: theme.spacing.sm }}
        />
      )}
    </ScrollView>
  );
}
