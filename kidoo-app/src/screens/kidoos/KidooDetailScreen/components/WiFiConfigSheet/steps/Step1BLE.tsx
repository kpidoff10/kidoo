/**
 * Step 1: Connexion BLE
 * Première étape : connexion BLE au Kidoo
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Text, Button } from '@/components/ui';
import { Title } from '@/components/ui/Typography/Title';
import { useTheme } from '@/theme';
import { useBluetooth } from '@/contexts';
import { Kidoo } from '@/api';
import { FireworksEffect } from '@/components/AddDeviceSheet/components/FireworksEffect';
import { BreathingAnimation } from './BreathingAnimation';

type ValidationStatus = 'pending' | 'loading' | 'success' | 'error';

interface Step1BLEProps {
  kidoo: Kidoo;
  onSuccess?: () => void;
}

export function Step1BLE({ kidoo, onSuccess }: Step1BLEProps) {
  const { t } = useTranslation();
  const { colors, spacing } = useTheme();
  const { isConnected, connectedDevice, connectToDevice, startScan, scannedDevices } = useBluetooth();
  const [status, setStatus] = useState<ValidationStatus>('pending');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [foundDevice, setFoundDevice] = useState<any>(null);
  const isConnectingRef = useRef(false); // Empêcher les tentatives multiples de connexion
  const attemptedDeviceIdRef = useRef<string | null>(null); // Garder trace du device pour lequel on a déjà tenté une connexion

  // Chercher le device BLE correspondant au Kidoo
  useEffect(() => {
    if (status === 'pending') {
      setStatus('loading');
      
      // Démarrer le scan
      startScan();
      
      // Chercher le device dans les devices scannés (par nom Kidoo ou deviceId)
      const device = scannedDevices.find((d) => {
        const nameMatch = d.name?.includes('Kidoo') || d.name?.includes('KIDOO');
        const idMatch = d.id === kidoo.deviceId;
        return nameMatch || idMatch;
      });
      
      if (device) {
        setFoundDevice(device);
      } else {
        // Si pas trouvé immédiatement, attendre un peu pour que le scan trouve le device
        const timeout = setTimeout(() => {
          const deviceAfterDelay = scannedDevices.find((d) => {
            const nameMatch = d.name?.includes('Kidoo') || d.name?.includes('KIDOO');
            const idMatch = d.id === kidoo.deviceId;
            return nameMatch || idMatch;
          });
          if (deviceAfterDelay) {
            setFoundDevice(deviceAfterDelay);
          } else {
            setStatus('error');
            setErrorMessage(t('kidoos.wifiConfig.step1.error.notFound', {
              defaultValue: 'Kidoo non trouvé en BLE'
            }));
          }
        }, 5000); // Attendre 5 secondes pour le scan
        
        return () => clearTimeout(timeout);
      }
    }
  }, [status, scannedDevices, kidoo.deviceId, startScan, t]);

  // Réécouter les devices scannés pour trouver le device
  useEffect(() => {
    if (status === 'loading' && !foundDevice) {
      const device = scannedDevices.find((d) => {
        const nameMatch = d.name?.includes('Kidoo') || d.name?.includes('KIDOO');
        const idMatch = d.id === kidoo.deviceId;
        return nameMatch || idMatch;
      });
      
      if (device) {
        setFoundDevice(device);
      }
    }
  }, [scannedDevices, status, foundDevice, kidoo.deviceId]);

  // Tenter la connexion quand un device est trouvé
  useEffect(() => {
    // Empêcher les tentatives multiples de connexion pour le même device
    if (
      foundDevice && 
      status === 'loading' && 
      !isConnectingRef.current && 
      attemptedDeviceIdRef.current !== foundDevice.id
    ) {
      isConnectingRef.current = true;
      attemptedDeviceIdRef.current = foundDevice.id;
      
      const attemptConnection = async () => {
        try {
          await connectToDevice(foundDevice.id);
          // Le state sera mis à jour et déclenchera l'autre useEffect
        } catch (error: any) {
          console.error('Erreur lors de la connexion BLE:', error);
          isConnectingRef.current = false; // Réinitialiser le flag en cas d'erreur
          attemptedDeviceIdRef.current = null; // Permettre de réessayer pour ce device
          setStatus('error');
          
          // Extraire un message d'erreur plus descriptif si possible
          const errorMsg = error?.message || error?.reason || 
            t('kidoos.wifiConfig.step1.error.connectionFailed', {
              defaultValue: 'Échec de la connexion BLE'
            });
          
          setErrorMessage(errorMsg);
        }
      };
      
      attemptConnection();
    }
    
    // Nettoyer le flag si le status change
    if (status !== 'loading') {
      isConnectingRef.current = false;
    }
  }, [foundDevice, status, connectToDevice, t]);

  // Vérifier si connecté au bon device
  useEffect(() => {
    if (status === 'loading' && isConnected && connectedDevice) {
      // Vérifier si c'est le bon device (par nom ou ID)
      const isCorrectDevice = 
        connectedDevice.name?.includes('Kidoo') || 
        connectedDevice.id === foundDevice?.id;
      
      if (isCorrectDevice) {
        setStatus('success');
        setErrorMessage(null);
        onSuccess?.();
      }
    }
  }, [status, isConnected, connectedDevice, foundDevice, onSuccess]);

  const handleRetry = () => {
    isConnectingRef.current = false; // Réinitialiser le flag
    attemptedDeviceIdRef.current = null; // Réinitialiser le device tenté
    setStatus('pending');
    setErrorMessage(null);
    setFoundDevice(null);
    startScan();
  };

  return (
    <View style={styles.container}>
      {status === 'loading' && (
        <View style={styles.content}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.message, { marginTop: spacing[4], textAlign: 'center' }]}>
            {t('kidoos.wifiConfig.step1.loading', {
              defaultValue: 'Pour modifier le WiFi, mettez le Kidoo en mode appairage en appuyant 3 secondes sur le bouton reset. Il doit s\'allumer en mode respiration bleu.'
            })}
          </Text>
        </View>
      )}

      {status === 'success' && (
        <View style={styles.content}>
          <FireworksEffect />
          <Ionicons name="checkmark-circle" size={64} color={colors.success} style={styles.icon} />
          <Title style={styles.title}>
            {t('kidoos.wifiConfig.step1.success', {
              defaultValue: 'Connexion BLE établie'
            })}
          </Title>
        </View>
      )}

      {status === 'error' && (
        <View style={styles.content}>
          <Ionicons name="close-circle" size={64} color={colors.error} style={styles.icon} />
          <Title style={styles.title}>
            {t('kidoos.wifiConfig.step1.error.title', {
              defaultValue: 'Kidoo non disponible en BLE'
            })}
          </Title>
          <Text style={[styles.message, { marginTop: spacing[4], textAlign: 'center' }]}>
            {errorMessage || t('kidoos.wifiConfig.step1.error.message', {
              defaultValue: 'Pour modifier la configuration WiFi, le Kidoo doit être en mode appairage. Appuyez 3 secondes sur le bouton reset. Le Kidoo doit respirer en bleu.'
            })}
          </Text>
          <BreathingAnimation />
          <Button
            title={t('common.retry', { defaultValue: 'Réessayer' })}
            onPress={handleRetry}
            style={{ marginTop: spacing[6] }}
          />
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
