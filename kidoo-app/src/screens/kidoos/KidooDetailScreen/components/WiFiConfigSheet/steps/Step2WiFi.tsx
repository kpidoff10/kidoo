/**
 * Step 2: Identifiants WiFi
 * Deuxième étape : saisie du SSID et mot de passe WiFi
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { TextInput, PasswordInput } from '@/components/ui';
import { useTheme } from '@/theme';
import { useCurrentWiFiSSID } from '@/hooks';

interface Step2WiFiProps {
  wifiSSID: string;
  wifiPassword: string;
  onSSIDChange: (ssid: string) => void;
  onPasswordChange: (password: string) => void;
}

export function Step2WiFi({ wifiSSID, wifiPassword, onSSIDChange, onPasswordChange }: Step2WiFiProps) {
  const { t } = useTranslation();
  const { spacing } = useTheme();
  const { ssid: currentSSID } = useCurrentWiFiSSID();
  const hasInitializedSSID = useRef(false); // Flag pour savoir si on a déjà initialisé le SSID une fois

  // Préremplir le SSID avec le réseau WiFi actuel si disponible et si le champ est vide
  // Ne le faire qu'une seule fois au montage du composant
  useEffect(() => {
    if (currentSSID && !hasInitializedSSID.current && (!wifiSSID || wifiSSID.trim().length === 0)) {
      hasInitializedSSID.current = true;
      onSSIDChange(currentSSID);
    }
  }, [currentSSID, wifiSSID, onSSIDChange]);

  return (
    <View style={styles.container}>
      <TextInput
        label={t('device.add.form.wifiSSID', { defaultValue: 'Nom du réseau WiFi (SSID)' })}
        placeholder={t('device.add.form.wifiSSIDPlaceholder', {
          defaultValue: 'Ex: MonWiFi',
        })}
        value={wifiSSID}
        onChangeText={onSSIDChange}
        required
        containerStyle={{ marginBottom: spacing[4] }}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <PasswordInput
        label={t('device.add.form.wifiPassword', { defaultValue: 'Mot de passe WiFi' })}
        placeholder={t('device.add.form.wifiPasswordPlaceholder', {
          defaultValue: 'Mot de passe du réseau',
        })}
        value={wifiPassword}
        onChangeText={onPasswordChange}
        containerStyle={{ marginBottom: spacing[4] }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
});
