/**
 * Composant pour le texte de statut et la description NFC
 */

import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/contexts/AuthContext';
import { ThemedText } from '@/components/themed-text';
import type { NFCState } from './nfc-scan-zone';

export interface NFCStatusTextProps {
  state: NFCState;
  tagId: string | null;
  tagUID: string | null;
  macAddress?: string | null;
}

export function NFCStatusText({ state, tagId, tagUID, macAddress }: NFCStatusTextProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { isDeveloperMode } = useAuth();

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
                : state === 'naming'
                  ? t('kidoos.nfc.nameTag', 'Nommer le tag')
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
                : state === 'naming'
                  ? t('kidoos.nfc.nameTagDescription', 'Donnez un nom à ce tag pour le retrouver facilement')
                  : t('kidoos.nfc.writeDescription', 'Un identifiant unique sera créé et écrit sur le tag NFC')}
      </ThemedText>
      {isDeveloperMode && macAddress && (
        <ThemedText style={{ textAlign: 'center', opacity: 0.5, fontSize: 12, marginTop: theme.spacing.xs }}>
          MAC: {macAddress}
        </ThemedText>
      )}
    </View>
  );
}
