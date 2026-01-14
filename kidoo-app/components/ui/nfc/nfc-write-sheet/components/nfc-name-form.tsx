/**
 * Étape 2 : Nommage du tag NFC
 */

import { View } from 'react-native';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { FormField } from '@/screens/auth';
import { ThemedText } from '@/components/themed-text';

export interface NameStepProps {
  control: Control<{ name: string }>;
  errors: FieldErrors<{ name: string }>;
  tagUID: string | null;
}

export function NameStep({ control, errors, tagUID }: NameStepProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View style={{ gap: theme.spacing.lg, width: '100%' }}>
      <View style={{ alignItems: 'center', gap: theme.spacing.sm }}>
        <ThemedText type="title" style={{ textAlign: 'center', fontSize: 24 }}>
          {t('kidoos.nfc.nameTag', 'Nommer le tag')}
        </ThemedText>
        <ThemedText style={{ textAlign: 'center', opacity: 0.7, fontSize: 15 }}>
          {t('kidoos.nfc.nameTagDescription', 'Donnez un nom à ce tag pour le retrouver facilement')}
        </ThemedText>
        {tagUID && (
          <ThemedText style={{ textAlign: 'center', opacity: 0.5, fontSize: 12, marginTop: theme.spacing.xs }}>
            UID: {tagUID}
          </ThemedText>
        )}
      </View>

      <View>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <FormField
              label={t('kidoos.nfc.tagName', 'Nom du tag')}
              value={value}
              onChangeText={onChange}
              error={errors.name?.message}
              autoFocus
            />
          )}
        />
      </View>
    </View>
  );
}
