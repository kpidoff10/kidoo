/**
 * Device Item Component
 * Composant pour afficher un device Kidoo dans la liste
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui';
import { useTheme } from '@/theme';
import { BLEDevice } from '@/contexts';

interface DeviceItemProps {
  device: BLEDevice;
  onPress: (device: BLEDevice) => void;
}

export function DeviceItem({ device, onPress }: DeviceItemProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.deviceItem, { 
        backgroundColor: colors.surface,
        borderColor: colors.border,
      }]}
      onPress={() => onPress(device)}
      activeOpacity={0.7}
    >
      <View style={styles.deviceInfo}>
        <View style={styles.deviceHeader}>
          <Ionicons name="cube" size={24} color={colors.primary} />
          <View style={styles.deviceNameContainer}>
            <Text variant="body" style={styles.deviceName}>
              {device.name || t('kidoos.unknownDevice', { defaultValue: 'Appareil inconnu' })}
            </Text>
            {device.rssi !== null && (
              <Text variant="caption" color="tertiary" style={styles.rssi}>
                {device.rssi} dBm
              </Text>
            )}
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceNameContainer: {
    marginLeft: 12,
    flex: 1,
  },
  deviceName: {
    fontWeight: '600',
  },
  rssi: {
    marginTop: 4,
  },
});
