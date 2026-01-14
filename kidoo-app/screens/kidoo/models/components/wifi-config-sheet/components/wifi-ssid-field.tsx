/**
 * Champ de saisie pour le SSID WiFi
 */

import { View, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';

interface WifiSSIDFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  error?: string | null;
  editable?: boolean;
}

export function WifiSSIDField({
  value,
  onChangeText,
  onFocus,
  onBlur,
  error,
  editable = true,
}: WifiSSIDFieldProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View>
      <ThemedText style={{ marginBottom: theme.spacing.xs, fontSize: theme.typography.fontSize.sm }}>
        {t('kidoos.setup.step2.wifiSSID', 'Nom du réseau WiFi (SSID)')}
      </ThemedText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={t('kidoos.setup.step2.wifiSSIDPlaceholder', 'Mon réseau WiFi')}
        autoCapitalize="none"
        autoComplete="off"
        style={{
          backgroundColor: theme.colors.surfaceSecondary,
          borderRadius: theme.borderRadius.md,
          padding: theme.spacing.md,
          fontSize: theme.typography.fontSize.md,
          color: theme.colors.text,
          borderWidth: 1,
          borderColor: error ? theme.colors.error : theme.colors.border,
        }}
        editable={editable}
      />
      {error && (
        <ThemedText style={{ color: theme.colors.error, fontSize: theme.typography.fontSize.sm, marginTop: theme.spacing.xs }}>
          {error}
        </ThemedText>
      )}
    </View>
  );
}
