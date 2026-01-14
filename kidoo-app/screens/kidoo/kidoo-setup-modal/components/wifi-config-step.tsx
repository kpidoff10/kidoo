/**
 * WiFi Config Step Component
 * Étape 2 : Configuration WiFi
 * Utilise react-hook-form pour la gestion du formulaire
 */

import { useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { Controller, Control, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { FormField, PasswordField } from '@/screens/auth';
import { wifiService } from '@/services/wifiService';
import type { KidooSetupInput } from '@/types/shared';

interface WifiConfigStepProps {
  control: Control<KidooSetupInput>;
  errors: FieldErrors<KidooSetupInput>;
  setValue: UseFormSetValue<KidooSetupInput>;
}

export function WifiConfigStep({
  control,
  errors,
  setValue,
}: WifiConfigStepProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  // Récupérer automatiquement le SSID WiFi actuel au montage
  useEffect(() => {
    const fetchCurrentSSID = async () => {
      try {
        const currentSSID = await wifiService.getCurrentSSID();
        if (currentSSID) {
          console.log('[WifiConfigStep] SSID WiFi actuel détecté:', currentSSID);
          setValue('wifiSSID', currentSSID, { shouldValidate: false });
        }
      } catch (error) {
        console.error('[WifiConfigStep] Erreur lors de la récupération du SSID:', error);
      }
    };

    fetchCurrentSSID();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Exécuter une seule fois au montage

  return (
    <ScrollView
      style={theme.components.setupStepContent}
      contentContainerStyle={theme.components.setupStepContentScroll}
      showsVerticalScrollIndicator={false}
    >
      <ThemedText type="defaultSemiBold" style={theme.components.setupStepTitle}>
        {t('kidoos.setup.step2.title', 'Configurez le WiFi')}
      </ThemedText>
      <ThemedText style={theme.components.setupStepDescription}>
        {t('kidoos.setup.step2.description', 'Entrez les informations de votre réseau WiFi pour que votre Kidoo puisse se connecter à Internet.')}
      </ThemedText>

      <View style={theme.components.setupStepForm}>
        <Controller
          control={control}
          name="wifiSSID"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label={t('kidoos.setup.step2.wifiSSID', 'Nom du réseau WiFi (SSID)')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('kidoos.setup.step2.wifiSSIDPlaceholder', 'Mon réseau WiFi')}
              autoCapitalize="none"
              autoComplete="off"
              error={errors.wifiSSID?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="wifiPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <PasswordField
              label={t('kidoos.setup.step2.wifiPassword', 'Mot de passe WiFi')}
              value={value || ''}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('kidoos.setup.step2.wifiPasswordPlaceholder', 'Mot de passe')}
              autoCapitalize="none"
              autoComplete="off"
              error={errors.wifiPassword?.message}
            />
          )}
        />
      </View>
    </ScrollView>
  );
}
