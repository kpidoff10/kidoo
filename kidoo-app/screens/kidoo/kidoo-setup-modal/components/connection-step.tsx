/**
 * Connection Step Component
 * Étape 1 : Connexion et nom du Kidoo
 * Utilise react-hook-form pour la gestion du formulaire
 */

import React from 'react';
import { View, ScrollView } from 'react-native';
import { Controller, Control } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { FormField } from '@/screens/auth';
import type { KidooSetupInput } from '@/types/shared';

interface ConnectionStepProps {
  control: Control<KidooSetupInput>;
  error?: string;
}

export function ConnectionStep({ control, error }: ConnectionStepProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <ScrollView
      style={theme.components.setupStepContent}
      contentContainerStyle={theme.components.setupStepContentScroll}
      showsVerticalScrollIndicator={false}
    >
      <ThemedText type="defaultSemiBold" style={theme.components.setupStepTitle}>
        {t('kidoos.setup.step1.title', 'Donnez un nom à votre Kidoo')}
      </ThemedText>
      <ThemedText style={theme.components.setupStepDescription}>
        {t('kidoos.setup.step1.presentation', 'Choisissez un nom unique pour identifier facilement votre Kidoo dans l\'application.')}
      </ThemedText>

      <View style={theme.components.setupStepForm}>
        <Controller
          control={control}
          name="deviceName"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label={t('kidoos.setup.step1.deviceName', 'Nom du Kidoo')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('kidoos.setup.step1.deviceNamePlaceholder', 'Mon Kidoo')}
              autoCapitalize="words"
              autoComplete="off"
              error={error}
            />
          )}
        />
      </View>
    </ScrollView>
  );
}
