/**
 * Composant pour le texte de statut et la description NFC
 */

import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import type { NFCState } from './nfc-scan-zone';

export interface NFCStatusTextProps {
  state: NFCState;
  tagId: string | null;
  tagUID: string | null;
}

export function NFCStatusText({ state, tagId, tagUID }: NFCStatusTextProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View style={{ alignItems: 'center', gap: theme.spacing.sm }}>
      <ThemedText type="title" style={{ textAlign: 'center', fontSize: 24 }}>
        {state === 'written'
          ? t('kidoos.nfc.tagWritten', 'Tag enregistré !')
          : state === 'writing'
            ? t('kidoos.nfc.writing', 'Écriture en cours...')
            : state === 'updating'
              ? t('kidoos.nfc.updating', 'Mise à jour...')
              : state === 'creating'
                ? t('kidoos.nfc.creating', 'Création du tag...')
                : t('kidoos.nfc.title', 'Écrire sur un tag NFC')}
      </ThemedText>
      <ThemedText style={{ textAlign: 'center', opacity: 0.7, fontSize: 15 }}>
        {state === 'written' && tagId
          ? tagUID
            ? t('kidoos.nfc.tagWrittenSuccessWithUID', 'Tag enregistré avec succès (UID: {{uid}})', { uid: tagUID })
            : t('kidoos.nfc.tagWrittenSuccess', 'Tag enregistré avec succès')
          : state === 'writing'
            ? t('kidoos.nfc.writingDescription', 'Approchez le tag NFC et attendez l\'écriture...')
            : state === 'updating'
              ? t('kidoos.nfc.updatingDescription', 'Mise à jour du tag avec l\'UID physique...')
              : state === 'creating'
                ? t('kidoos.nfc.creatingDescription', 'Création de l\'identifiant unique...')
                : t('kidoos.nfc.writeDescription', 'Un identifiant unique sera créé et écrit sur le tag NFC')}
      </ThemedText>
    </View>
  );
}
