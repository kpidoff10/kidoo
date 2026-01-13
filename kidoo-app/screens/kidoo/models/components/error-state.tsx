/**
 * Composant pour afficher un état d'erreur
 */

import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    }}>
      <IconSymbol
        name="exclamationmark.triangle.fill"
        size={48}
        color={theme.colors.error}
      />
      <ThemedText
        type="title"
        style={{
          marginTop: theme.spacing.lg,
          marginBottom: theme.spacing.sm,
          color: theme.colors.error,
          textAlign: 'center',
        }}
      >
        {t('common.error', 'Erreur')}
      </ThemedText>
      <ThemedText
        style={{
          marginBottom: theme.spacing.xl,
          textAlign: 'center',
          opacity: 0.8,
        }}
      >
        {error}
      </ThemedText>
      {onRetry && (
        <Button
          label={t('common.retry', 'Réessayer')}
          onPress={onRetry}
          variant="primary"
        />
      )}
    </View>
  );
}
