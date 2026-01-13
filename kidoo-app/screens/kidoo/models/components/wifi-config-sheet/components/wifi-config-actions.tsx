/**
 * Boutons d'action pour la configuration WiFi
 */

import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';

interface WifiConfigActionsProps {
  isConfiguring: boolean;
  success: boolean;
  isConnected: boolean;
  hasSSID: boolean;
  onCancel: () => void;
  onConfigure: () => void;
}

export function WifiConfigActions({
  isConfiguring,
  success,
  isConnected,
  hasSSID,
  onCancel,
  onConfigure,
}: WifiConfigActionsProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View style={{ flexDirection: 'row', gap: theme.spacing.md, marginTop: theme.spacing.xl }}>
      <Button
        label={t('common.cancel', 'Annuler')}
        variant="outline"
        onPress={onCancel}
        style={{ flex: 1 }}
        disabled={isConfiguring || success}
      />
      <Button
        label={success ? t('common.done', 'Terminé') : t('kidoos.detail.wifi.configure', 'Configurer')}
        variant="primary"
        onPress={onConfigure}
        style={{ flex: 1 }}
        loading={isConfiguring}
        disabled={isConfiguring || success || !isConnected || !hasSSID}
      />
    </View>
  );
}
