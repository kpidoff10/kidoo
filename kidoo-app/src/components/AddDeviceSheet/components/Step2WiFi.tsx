/**
 * Step 2: Identifiants WiFi
 * Deuxième étape du formulaire d'ajout de device
 */

import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TextInput, PasswordInput } from '@/components/ui';
import { useTheme } from '@/theme';
import { useCurrentWiFiSSID } from '@/hooks';
import { useAddDevice } from '../AddDeviceContext';

export function Step2WiFi() {
  const { t } = useTranslation();
  const { spacing } = useTheme();
  const { control, formState: { errors }, getValues, setValue } = useAddDevice();
  const { ssid: currentSSID } = useCurrentWiFiSSID();

  // Préremplir le SSID avec le réseau WiFi actuel si disponible et si le champ est vide
  useEffect(() => {
    if (currentSSID) {
      const currentValue = getValues('wifiSSID');
      // Ne remplir que si le champ est vide
      if (!currentValue || currentValue.trim().length === 0) {
        setValue('wifiSSID', currentSSID, { shouldValidate: false });
      }
    }
  }, [currentSSID, getValues, setValue]);

  return (
    <View>
      <Controller
        control={control}
        name="wifiSSID"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label={t('device.add.form.wifiSSID', { defaultValue: 'Nom du réseau WiFi (SSID)' })}
            placeholder={t('device.add.form.wifiSSIDPlaceholder', {
              defaultValue: 'Ex: MonWiFi',
            })}
            value={value || ''}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.wifiSSID ? t(errors.wifiSSID.message as string) : undefined}
            required
            containerStyle={{ marginBottom: spacing[4] }}
            autoCapitalize="none"
            autoCorrect={false}
          />
        )}
      />

      <Controller
        control={control}
        name="wifiPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <PasswordInput
            label={t('device.add.form.wifiPassword', { defaultValue: 'Mot de passe WiFi' })}
            placeholder={t('device.add.form.wifiPasswordPlaceholder', {
              defaultValue: 'Mot de passe du réseau',
            })}
            value={value || ''}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.wifiPassword ? t(errors.wifiPassword.message as string) : undefined}
            containerStyle={{ marginBottom: spacing[4] }}
          />
        )}
      />
    </View>
  );
}
