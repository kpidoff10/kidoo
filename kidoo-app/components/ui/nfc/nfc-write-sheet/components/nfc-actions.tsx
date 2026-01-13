/**
 * Composant pour les boutons d'action NFC
 */

import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import type { NFCState } from './nfc-scan-zone';

export interface NFCActionsProps {
  state: NFCState;
  onStartWrite: () => void;
  onCancel: () => void;
}

export function NFCActions({ state, onStartWrite, onCancel }: NFCActionsProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View style={{ gap: theme.spacing.md }}>
      {state === 'idle' && (
        <Button
          label={t('kidoos.nfc.startWrite', 'Commencer l\'écriture')}
          onPress={onStartWrite}
        />
      )}
      {(state === 'creating' || state === 'writing' || state === 'updating') && (
        <Button
          label={t('kidoos.nfc.cancel', 'Annuler')}
          onPress={onCancel}
        />
      )}
      {(state === 'written' || state === 'error') && (
        <Button
          label={t('common.close', 'Fermer')}
          onPress={onCancel}
        />
      )}
    </View>
  );
}
