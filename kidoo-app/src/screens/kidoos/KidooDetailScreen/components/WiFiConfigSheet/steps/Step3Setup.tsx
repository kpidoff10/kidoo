/**
 * Step 3: Configuration WiFi
 * Troisième étape : envoi de la commande setup à l'ESP32
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Stepper, StepperStep, Text } from '@/components/ui';
import { Title } from '@/components/ui/Typography/Title';
import { useTheme } from '@/theme';
import { useBluetooth } from '@/contexts';
import { Kidoo } from '@/api';
import { FireworksEffect } from '@/components/AddDeviceSheet/components/FireworksEffect';

type ValidationStatus = 'pending' | 'loading' | 'success' | 'error';

interface Step3SetupProps {
  kidoo: Kidoo;
  wifiSSID: string;
  wifiPassword: string;
  onSuccess?: () => void;
}

export function Step3Setup({ kidoo, wifiSSID, wifiPassword, onSuccess }: Step3SetupProps) {
  const { t } = useTranslation();
  const { colors, spacing } = useTheme();
  const { isConnected, connectedDevice, sendCommand, disconnectDevice } = useBluetooth();
  const [wifiStatus, setWifiStatus] = useState<ValidationStatus>('pending');

  // Envoyer la commande setup automatiquement quand on arrive à cette étape
  useEffect(() => {
    if (wifiStatus === 'pending' && isConnected && connectedDevice) {
      setWifiStatus('loading');
      
      const sendSetup = async () => {
        try {
          // Vérifier que le SSID est présent
          if (!wifiSSID || wifiSSID.trim().length === 0) {
            setWifiStatus('error');
            return;
          }

          const result = await sendCommand('setup', {
            ssid: wifiSSID.trim(),
            password: wifiPassword?.trim() || undefined,
          });
          
          // Vérifier si la commande a réussi ET si la connexion WiFi a réussi
          if (result.success && result.wifiConnected === true) {
            setWifiStatus('success');
            
            // Déconnecter immédiatement après un setup réussi
            try {
              await disconnectDevice();
            } catch (disconnectError) {
              // Ignorer les erreurs de déconnexion
            }
            
            // Attendre un peu avant d'appeler onSuccess pour laisser voir le succès
            setTimeout(() => {
              onSuccess?.();
            }, 2000);
          } else if (result.success && result.wifiConnected === false) {
            setWifiStatus('error');
          } else {
            setWifiStatus('error');
          }
        } catch (error) {
          console.error('Erreur lors de l\'envoi de la commande setup:', error);
          setWifiStatus('error');
        }
      };
      
      sendSetup();
    }
  }, [wifiStatus, isConnected, connectedDevice, wifiSSID, wifiPassword, sendCommand, disconnectDevice, onSuccess]);

  return (
    <View style={styles.container}>
      {wifiStatus === 'loading' && (
        <View style={styles.content}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.message, { marginTop: spacing[4] }]}>
            {t('kidoos.wifiConfig.step3.loading', {
              defaultValue: 'Configuration WiFi en cours...'
            })}
          </Text>
        </View>
      )}

      {wifiStatus === 'success' && (
        <View style={styles.content}>
          <FireworksEffect />
          <Ionicons name="checkmark-circle" size={64} color={colors.success} style={styles.icon} />
          <Title style={styles.title}>
            {t('kidoos.wifiConfig.step3.success', {
              defaultValue: 'Configuration WiFi réussie'
            })}
          </Title>
          <Text style={[styles.message, { marginTop: spacing[4] }]}>
            {t('kidoos.wifiConfig.step3.successMessage', {
              defaultValue: 'Le Kidoo est maintenant connecté au réseau WiFi'
            })}
          </Text>
        </View>
      )}

      {wifiStatus === 'error' && (
        <View style={styles.content}>
          <Ionicons name="close-circle" size={64} color={colors.error} style={styles.icon} />
          <Title style={styles.title}>
            {t('kidoos.wifiConfig.step3.error', {
              defaultValue: 'Erreur de configuration'
            })}
          </Title>
          <Text style={[styles.message, { marginTop: spacing[4], textAlign: 'center' }]}>
            {t('kidoos.wifiConfig.step3.errorMessage', {
              defaultValue: 'Impossible de configurer le WiFi. Vérifiez les identifiants et réessayez.'
            })}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 200,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginTop: 16,
  },
  message: {
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});
