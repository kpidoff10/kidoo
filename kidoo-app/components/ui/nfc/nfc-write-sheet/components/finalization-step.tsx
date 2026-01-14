/**
 * Étape 3 : Finalisation - Création du tag
 */

import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { NFCScanZone } from './nfc-scan-zone';
import { AlertMessage } from '@/components/ui/alert-message';

export interface FinalizationStepProps {
  isProcessing: boolean;
  isSuccess: boolean;
  error: string | null;
  tagName: string;
  tagUID: string | null;
}

export function FinalizationStep({
  isProcessing,
  isSuccess,
  error,
  tagName,
  tagUID,
}: FinalizationStepProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View style={{ gap: theme.spacing.xl }}>
      {/* Zone de scan NFC */}
      <NFCScanZone state={isSuccess ? 'written' : isProcessing ? 'creating' : 'idle'} />

      {/* Texte et description */}
      <View style={{ alignItems: 'center', gap: theme.spacing.sm }}>
        <ThemedText type="title" style={{ textAlign: 'center', fontSize: 24 }}>
          {isSuccess
            ? t('kidoos.nfc.tagWritten', 'Tag enregistré !')
            : isProcessing
              ? t('kidoos.nfc.creating', 'Création du tag...')
              : t('kidoos.nfc.finalizationTitle', 'Création du tag')}
        </ThemedText>
        <ThemedText style={{ textAlign: 'center', opacity: 0.7, fontSize: 15 }}>
          {isSuccess
            ? t('kidoos.nfc.tagWrittenSuccess', 'Tag enregistré avec succès')
            : isProcessing
              ? t('kidoos.nfc.creatingDescription', 'Création de l\'identifiant unique...')
              : t('kidoos.nfc.finalizationDescription', 'Le tag "{{name}}" va être créé', { name: tagName })}
        </ThemedText>
        {tagUID && (
          <ThemedText style={{ textAlign: 'center', opacity: 0.5, fontSize: 12, marginTop: theme.spacing.xs }}>
            UID: {tagUID}
          </ThemedText>
        )}
      </View>

      {/* Message d'erreur */}
      {error && (
        <AlertMessage
          message={error}
          type="error"
          visible={true}
        />
      )}
    </View>
  );
}
