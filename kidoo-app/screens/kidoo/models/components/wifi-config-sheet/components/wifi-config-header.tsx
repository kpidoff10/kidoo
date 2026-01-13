/**
 * En-tête de la modale de configuration WiFi
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';

interface WifiConfigHeaderProps {
  kidooName: string;
}

export function WifiConfigHeader({ kidooName }: WifiConfigHeaderProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <>
      <ThemedText type="title" style={{ marginBottom: theme.spacing.sm }}>
        {t('kidoos.detail.wifi.title', 'Configurer le WiFi')}
      </ThemedText>
      <ThemedText style={{ marginBottom: theme.spacing.lg, opacity: 0.7 }}>
        {t('kidoos.detail.wifi.description', 'Reconfigurez le réseau WiFi pour {{name}}', { name: kidooName })}
      </ThemedText>
    </>
  );
}
