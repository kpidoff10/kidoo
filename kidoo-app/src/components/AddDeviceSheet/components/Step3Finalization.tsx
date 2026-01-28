/**
 * Step 3: Finalisation
 * Troisième étape du formulaire d'ajout de device
 * Affiche un stepper vertical pour valider les connexions BLE et WiFi
 */

import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Stepper, StepperStep, Text, Button } from '@/components/ui';
import { Title } from '@/components/ui/Typography/Title';
import { useTheme } from '@/theme';
import { useBluetooth, BLEDevice } from '@/contexts';
import { useAddDevice } from '../AddDeviceContext';
import { FireworksEffect } from './FireworksEffect';

type ValidationStatus = 'pending' | 'loading' | 'success' | 'error';

interface ValidationStep {
  status: ValidationStatus;
  message?: string;
}

interface Step3FinalizationProps {
  device?: BLEDevice | null;
  onSuccess?: (data?: {
    deviceId?: string;
    macAddress?: string; // Adresse MAC WiFi (renvoyée par l'ESP32)
    bluetoothMacAddress?: string; // Adresse MAC Bluetooth (device.id)
    brightness?: number;
    sleepTimeout?: number;
    firmwareVersion?: string;
  }) => void; // Callback appelé quand tout est réussi, avec les données du device
}

export function Step3Finalization({ device, onSuccess }: Step3FinalizationProps) {
  const { t } = useTranslation();
  const { colors, spacing } = useTheme();
  const { isConnected, connectedDevice, connectToDevice, sendCommand, disconnectDevice } = useBluetooth();
  const { getValues, setIsConnecting, setIsSuccess, setHasError } = useAddDevice();

  // États de validation pour chaque étape
  const [bleValidation, setBleValidation] = useState<ValidationStep>({
    status: 'pending',
  });
  const [wifiValidation, setWifiValidation] = useState<ValidationStep>({
    status: 'pending',
  });
  
  // Données du device renvoyées par l'ESP32
  const [deviceId, setDeviceId] = useState<string | undefined>();
  const [macAddress, setMacAddress] = useState<string | undefined>();
  const [brightness, setBrightness] = useState<number | undefined>();
  const [sleepTimeout, setSleepTimeout] = useState<number | undefined>();
  const [firmwareVersion, setFirmwareVersion] = useState<string | undefined>();

  // Écouter les changements de connexion BLE
  useEffect(() => {
    if (!device) return;
    
    // Si on est en train de charger et qu'on devient connecté au bon device
    if (bleValidation.status === 'loading' && isConnected && connectedDevice?.id === device.id) {
      setBleValidation({
        status: 'success',
        message: t('device.add.step3.ble.success', {
          defaultValue: 'Connexion BLE établie',
        }),
      });
    }
  }, [isConnected, connectedDevice, device, bleValidation.status, t]);

  // Mettre à jour l'état de connexion dans le contexte
  useEffect(() => {
    const isConnectingNow = 
      bleValidation.status === 'loading' || 
      wifiValidation.status === 'loading';
    setIsConnecting(isConnectingNow);
    
    // Mettre à jour l'état d'erreur
    const hasErrorNow = 
      bleValidation.status === 'error' || 
      wifiValidation.status === 'error';
    setHasError(hasErrorNow);
    
    // Nettoyer l'état quand on quitte le composant
    return () => {
      setIsConnecting(false);
      setHasError(false);
    };
  }, [bleValidation.status, wifiValidation.status, setIsConnecting, setHasError]);

  // Validation automatique de la connexion BLE au montage
  useEffect(() => {
    if (bleValidation.status === 'pending' && device) {
      // Vérifier si déjà connecté au bon device AVANT de tenter une connexion
      if (isConnected && connectedDevice?.id === device.id) {
        setBleValidation({
          status: 'success',
          message: t('device.add.step3.ble.success', {
            defaultValue: 'Connexion BLE établie',
          }),
        });
        return;
      }
      
      // Si pas connecté, tenter de se connecter
      setBleValidation({ status: 'loading' });
      
      // Tenter de se connecter au device
      const attemptConnection = async () => {
        try {
          // Vérifier à nouveau si connecté avant de tenter (au cas où la connexion aurait changé)
          if (isConnected && connectedDevice?.id === device.id) {
            setBleValidation({
              status: 'success',
              message: t('device.add.step3.ble.success', {
                defaultValue: 'Connexion BLE établie',
              }),
            });
            return;
          }
          
          await connectToDevice(device.id);
          // Le state sera mis à jour et déclenchera l'autre useEffect
        } catch (error) {
          console.error('Erreur lors de la connexion BLE:', error);
          setBleValidation({
            status: 'error',
            message: t('device.add.step3.ble.error', {
              defaultValue: 'Connexion BLE non établie',
            }),
          });
        }
      };
      
      attemptConnection();
    } else if (bleValidation.status === 'pending' && !device) {
      // Pas de device fourni
      setBleValidation({
        status: 'error',
        message: t('device.add.step3.ble.noDevice', {
          defaultValue: 'Aucun appareil BLE disponible',
        }),
      });
    }
  }, [bleValidation.status, device, isConnected, connectedDevice, connectToDevice, t]);
  
  // Réinitialiser l'état de validation quand on quitte le step 3
  useEffect(() => {
    return () => {
      // Cleanup: réinitialiser les états de validation quand le composant est démonté
      // Cela évite les tentatives de reconnexion quand on revient au step 3
      setBleValidation({ status: 'pending' });
      setWifiValidation({ status: 'pending' });
    };
  }, []);

  // Validation WiFi (déclenchée après validation BLE) - Envoi de la commande setup
  useEffect(() => {
    if (bleValidation.status === 'success' && wifiValidation.status === 'pending' && isConnected) {
      setWifiValidation({ status: 'loading' });
      
      // Récupérer les valeurs WiFi du formulaire
      const wifiSSID = getValues('wifiSSID');
      const wifiPassword = getValues('wifiPassword');
      
      // Vérifier que le SSID est présent
      if (!wifiSSID || wifiSSID.trim().length === 0) {
        setWifiValidation({
          status: 'error',
          message: t('device.add.step3.wifi.error', {
            defaultValue: 'SSID WiFi manquant',
          }),
        });
        return;
      }
      
      // Envoyer la commande setup via BLE et attendre la réponse
      const sendSetup = async () => {
        try {
          const result = await sendCommand('setup', {
            ssid: wifiSSID.trim(),
            password: wifiPassword?.trim() || undefined,
          });
          
          // Vérifier si la commande a réussi ET si la connexion WiFi a réussi
          if (result.success && result.wifiConnected === true) {
            // Stocker les données renvoyées par l'ESP32
            if (result.deviceId) {
              setDeviceId(result.deviceId);
            }
            if (result.macAddress) {
              setMacAddress(result.macAddress);
            }
            if (result.brightness !== undefined) {
              setBrightness(result.brightness);
            }
            if (result.sleepTimeout !== undefined) {
              setSleepTimeout(result.sleepTimeout);
            }
            if (result.firmwareVersion) {
              setFirmwareVersion(result.firmwareVersion);
            }
            
            setWifiValidation({
              status: 'success',
              message: t('device.add.step3.wifi.success', {
                defaultValue: 'Connexion WiFi configurée',
              }),
            });
            
            // IMPORTANT: Déconnecter immédiatement après un setup réussi
            // L'ESP32 va désactiver le BLE, donc on déconnecte proprement avant
            // pour éviter que la bibliothèque ne tente de nettoyer automatiquement
            // et cause un crash (NullPointerException)
            try {
              await disconnectDevice();
            } catch (disconnectError) {
              // Ignorer les erreurs de déconnexion (le device peut déjà être déconnecté)
            }
          } else if (result.success && result.wifiConnected === false) {
            // La commande a réussi mais la connexion WiFi a échoué
            setWifiValidation({
              status: 'error',
              message: t('device.add.step3.wifi.connectionFailed', {
                defaultValue: 'Configuration WiFi sauvegardée mais connexion échouée',
              }),
            });
          } else {
            // La commande elle-même a échoué
            setWifiValidation({
              status: 'error',
              message: result.message || t('device.add.step3.wifi.setupError', {
                defaultValue: 'Erreur lors de la configuration WiFi',
              }),
            });
          }
        } catch (error) {
          console.error('Erreur lors de l\'envoi de la commande setup:', error);
          setWifiValidation({
            status: 'error',
            message: t('device.add.step3.wifi.setupError', {
              defaultValue: 'Erreur lors de la configuration WiFi',
            }),
          });
        }
      };
      
      sendSetup();
    }
  }, [bleValidation.status, wifiValidation.status, isConnected, getValues, sendCommand, disconnectDevice, t]);

  // Fonction pour obtenir l'icône selon le statut
  const getStatusIcon = (status: ValidationStatus): keyof typeof Ionicons.glyphMap => {
    switch (status) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'close-circle';
      case 'loading':
        return 'hourglass';
      default:
        return 'ellipse-outline';
    }
  };

  // Fonction pour obtenir le contenu selon le statut
  const getStatusContent = (validation: ValidationStep) => {
    switch (validation.status) {
      case 'loading':
        return (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing[2] }}>
            <ActivityIndicator size="small" color={colors.primary} style={{ marginRight: spacing[2] }} />
            <Text variant="caption" color="tertiary">
              {t('device.add.step3.validating', { defaultValue: 'Validation en cours...' })}
            </Text>
          </View>
        );
      case 'success':
        return validation.message ? (
          <Text variant="caption" color="success" style={{ marginTop: spacing[2] }}>
            {validation.message}
          </Text>
        ) : null;
      case 'error':
        return validation.message ? (
          <Text variant="caption" color="error" style={{ marginTop: spacing[2] }}>
            {validation.message}
          </Text>
        ) : null;
      default:
        return (
          <Text variant="caption" color="tertiary" style={{ marginTop: spacing[2] }}>
            {t('device.add.step3.pending', { defaultValue: 'En attente...' })}
          </Text>
        );
    }
  };

  // Vérifier si tout est réussi
  const allSuccess = bleValidation.status === 'success' && wifiValidation.status === 'success';

  // Mettre à jour l'état de succès dans le contexte
  useEffect(() => {
    setIsSuccess(allSuccess);
    return () => {
      setIsSuccess(false);
    };
  }, [allSuccess, setIsSuccess]);

  // Définir les étapes du stepper vertical
  const validationSteps: StepperStep[] = [
    {
      title: t('device.add.step3.ble.title', { defaultValue: 'Connexion Bluetooth' }),
      description: t('device.add.step3.ble.description', {
        defaultValue: 'Vérification de la connexion BLE avec le Kidoo',
      }),
      icon: getStatusIcon(bleValidation.status),
      active: bleValidation.status === 'loading' || bleValidation.status === 'pending',
      completed: bleValidation.status === 'success',
      content: getStatusContent(bleValidation),
    },
    {
      title: t('device.add.step3.wifi.title', { defaultValue: 'Connexion WiFi' }),
      description: t('device.add.step3.wifi.description', {
        defaultValue: 'Configuration de la connexion WiFi',
      }),
      icon: getStatusIcon(wifiValidation.status),
      active: wifiValidation.status === 'loading' || (wifiValidation.status === 'pending' && bleValidation.status === 'success'),
      completed: wifiValidation.status === 'success',
      content: getStatusContent(wifiValidation),
    },
  ];

  // Si tout est réussi, afficher l'écran de succès
  if (allSuccess) {
    return (
      <View style={styles.successContainer}>
        <FireworksEffect />
        <View style={styles.successContent}>
          <View style={[styles.successIconContainer, { backgroundColor: colors.success + '20' }]}>
            <Ionicons name="checkmark-circle" size={80} color={colors.success} />
          </View>
          <Title level="h2" style={styles.successTitle}>
            {t('device.add.step3.success.title', {
              defaultValue: 'Configuration réussie !',
            })}
          </Title>
          <Text variant="body" style={[styles.successMessage, { color: colors.textSecondary }]}>
            {t('device.add.step3.success.message', {
              defaultValue: 'Votre Kidoo est maintenant configuré et prêt à être utilisé.',
            })}
          </Text>
          <Button
            title={t('device.add.step3.success.validate', {
              defaultValue: 'Valider',
            })}
            variant="primary"
            onPress={() => {
              onSuccess?.({
                deviceId,
                macAddress, // Adresse MAC WiFi (renvoyée par l'ESP32)
                bluetoothMacAddress: device?.id, // Adresse MAC Bluetooth (device.id est l'ID BLE qui correspond à l'adresse MAC)
                brightness,
                sleepTimeout,
                firmwareVersion,
              });
            }}
            style={styles.validateButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={{ paddingVertical: spacing[4] }}>
      <Stepper steps={validationSteps} orientation="vertical" />
    </View>
  );
}

const styles = StyleSheet.create({
  successContainer: {
    flex: 1,
  
    position: 'relative',
  },
  successContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    zIndex: 1,
  },
  successIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  successTitle: {
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '700',
  },
  successMessage: {
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 24,
  },
  validateButton: {
    minWidth: 200,
    paddingVertical: 16,
  },
});
