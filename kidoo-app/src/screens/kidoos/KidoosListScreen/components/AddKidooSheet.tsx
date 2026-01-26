/**
 * Add Kidoo Sheet Component
 * Bottom sheet pour ajouter un nouveau Kidoo détecté via Bluetooth
 */

import React, { useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, BottomSheet, Text } from '@/components/ui';
import { useTheme } from '@/theme';
import { BLEDevice, useBluetooth } from '@/contexts';
import { useAuth } from '@/contexts';
import { UseBottomSheetReturn } from '@/hooks/useBottomSheet';
import { useKidoos } from '@/hooks/useKidoos';
import { KIDOO_MODELS } from '@/config';

interface AddKidooSheetProps {
  bottomSheet: UseBottomSheetReturn;
  device: BLEDevice | null;
  onClose?: () => void;
  onAdd?: (device: BLEDevice) => void;
}

export function AddKidooSheet({ bottomSheet, device, onClose, onAdd }: AddKidooSheetProps) {
  const { t } = useTranslation();
  const { spacing } = useTheme();
  const { isDeveloper } = useAuth();
  const { data: kidoos } = useKidoos();
  const { openAddDeviceSheet } = useBluetooth(); // Méthode pour ouvrir AddDeviceSheet depuis le provider
  const shouldOpenAddDeviceSheetRef = useRef(false); // Flag pour savoir si on doit ouvrir AddDeviceSheet

  // Détecter le modèle du Kidoo depuis le nom
  const detectedModel = useMemo(() => {
    if (!device?.name) {
      return null;
    }
    
    // Normaliser le nom en minuscules pour la comparaison (insensible à la casse)
    const normalizedName = device.name.toLowerCase();
    
    // Chercher le modèle dans le nom (insensible à la casse)
    // Le firmware diffuse "KIDOO-Basic" ou "KIDOO-Dream"
    for (const model of KIDOO_MODELS) {
      const normalizedModel = model.toLowerCase();
      if (normalizedName.includes(normalizedModel) || normalizedName === normalizedModel) {
        return model; // Retourner le modèle avec la casse correcte
      }
    }
    
    return null;
  }, [device?.name]);

  // Vérifier si le Kidoo est déjà lié à l'utilisateur
  const isAlreadyLinked = useMemo(() => {
    if (!device || !kidoos) {
      return false;
    }
    
    // Vérifier par deviceId ou macAddress
    return kidoos.some(
      (kidoo) => kidoo.deviceId === device.id || kidoo.macAddress === device.id
    );
  }, [device, kidoos]);

  // Ouvrir AddDeviceSheet après la fermeture complète de AddKidooSheet (seulement si on a cliqué sur "Ajouter")
  const handleAddKidooDismiss = useCallback(() => {
    bottomSheet.handleDidDismiss({} as any);
    
    // Vérifier si on doit ouvrir AddDeviceSheet
    if (shouldOpenAddDeviceSheetRef.current) {
      shouldOpenAddDeviceSheetRef.current = false; // Réinitialiser le flag
      
      // Ouvrir AddDeviceSheet via le provider
      if (device && detectedModel) {
        setTimeout(() => {
          openAddDeviceSheet();
        }, 300);
      }
    } else {
      // Si on n'a pas cliqué sur "Ajouter", appeler onClose
      onClose?.();
    }
  }, [bottomSheet, openAddDeviceSheet, device, detectedModel, onClose]);

  const handleCancel = useCallback(async () => {
    await bottomSheet.close();
    onClose?.();
  }, [bottomSheet, onClose]);

  if (!device || !detectedModel || isAlreadyLinked) {
    return null;
  }

  return (
    <>
      <BottomSheet
        ref={bottomSheet.ref}
        name={bottomSheet.id}
        detents={['auto']}
        onDismiss={handleAddKidooDismiss}
        headerTitle={device.name || t('kidoos.unknownDevice', { defaultValue: 'Appareil inconnu' })}
        headerIcon="cube-outline"
      >
  
          <View style={styles.deviceInfo}>
            {isDeveloper && device.rssi !== null && (
              <Text variant="caption" color="tertiary" style={{ marginTop: spacing[1], textAlign: 'center' }}>
                {t('bluetooth.signalStrength', { defaultValue: 'Signal' })}: {device.rssi} dBm
              </Text>
            )}
          </View>

          <View style={styles.message}>
            <Text color="secondary" center>
              {t('kidoos.addKidooMessage', {
                defaultValue: 'Voulez-vous ajouter ce Kidoo à votre liste ?',
              })}
            </Text>
          </View>

          <View style={styles.actions}>
            <Button
              title={t('common.cancel')}
              variant="outline"
              onPress={handleCancel}
              style={styles.cancelButton}
            />
            <Button
              title={t('kidoos.add', { defaultValue: 'Ajouter' })}
              variant="primary"
              onPress={() => {
                if (device) {
                  onAdd?.(device);
                }
              }}
              style={styles.addButton}
            />
          </View>

      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  deviceInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  addButton: {
    flex: 1,
  },
});
