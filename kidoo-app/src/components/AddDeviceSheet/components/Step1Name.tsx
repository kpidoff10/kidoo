/**
 * Step 1: Nom du Kidoo
 * Première étape du formulaire d'ajout de device
 */

import React from 'react';
import { View } from 'react-native';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TextInput } from '@/components/ui';
import { useTheme } from '@/theme';
import { useAddDevice } from '../AddDeviceContext';

export function Step1Name() {
  const { t } = useTranslation();
  const { spacing } = useTheme();
  const { control, formState: { errors } } = useAddDevice();

  return (
    <View>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label={t('device.add.form.name', { defaultValue: 'Nom du Kidoo' })}
            placeholder={t('device.add.form.namePlaceholder', {
              defaultValue: 'Ex: Kidoo du salon',
            })}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.name ? t(errors.name.message as string) : undefined}
            required
            containerStyle={{ marginBottom: spacing[4] }}
            autoFocus
          />
        )}
      />
    </View>
  );
}
