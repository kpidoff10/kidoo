/**
 * NightlightSwitch Component
 * Switch pour activer la veilleuse toute la nuit
 */

import React from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@/components/ui';
import { useTheme } from '@/theme';
import { Controller, Control } from 'react-hook-form';

interface NightlightSwitchProps {
  control: Control<{
    color: string;
    effect: string | null;
    brightness: number;
    nightlightAllNight: boolean;
  }>;
}

export function NightlightSwitch({ control }: NightlightSwitchProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="nightlightAllNight"
        render={({ field: { value, onChange } }) => (
          <View style={styles.switchRow}>
            <Text style={[styles.switchLabel, { color: colors.text }]}>
              {t('kidoos.dream.bedtime.nightlightAllNight', { 
                defaultValue: 'Veilleuse allumée toute la nuit' 
              })}
            </Text>
            <Switch
              value={value}
              onValueChange={onChange}
              trackColor={{ false: colors.border, true: colors.primary + '80' }}
              thumbColor={value ? colors.primary : colors.textTertiary}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    width: '100%',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 0,
  },
  switchLabel: {
    fontSize: 16,
    flex: 1,
  },
});
