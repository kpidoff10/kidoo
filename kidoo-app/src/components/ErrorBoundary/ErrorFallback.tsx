/**
 * Error Fallback Component
 * Affiché quand une erreur React est capturée
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Title, Text, Button } from '@/components/ui';
import { useTheme } from '@/theme';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const { t } = useTranslation();
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Ionicons name="warning-outline" size={64} color={colors.error} />
      
      <Title level="h2" center style={{ marginTop: spacing[6] }}>
        {t('errors.generic')}
      </Title>
      
      <Text color="secondary" center style={{ marginTop: spacing[2] }}>
        {t('errors.tryAgain')}
      </Text>

      {__DEV__ && (
        <Text
          variant="caption"
          color="tertiary"
          style={{ marginTop: spacing[4], textAlign: 'center' }}
        >
          {error.message}
        </Text>
      )}

      <Button
        title={t('common.retry')}
        onPress={resetError}
        style={{ marginTop: spacing[8] }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
});
