/**
 * Étape 1 : Scan du tag NFC
 * Lit l'UID du tag et vérifie s'il existe déjà
 */

import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/contexts/AuthContext';
import { ThemedText } from '@/components/themed-text';
import { NFCScanZone } from './nfc-scan-zone';
import { AlertMessage } from '@/components/ui/alert-message';

export interface ScanStepProps {
  isScanning: boolean;
  isWriting: boolean;
  error: string | null;
  tagUID: string | null;
}

export function ScanStep({ isScanning, isWriting, error, tagUID }: ScanStepProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { isDeveloperMode } = useAuth();

  // Un seul message pendant toute la phase : scan et écriture
  // Le message ne change pas, même quand on passe du scan à l'écriture
  const isProcessing = isScanning || isWriting;

  // Déterminer l'état du scan zone en fonction de l'erreur
  const getScanZoneState = (): 'idle' | 'creating' | 'writing' | 'written' | 'error' => {
    if (error) return 'error';
    if (isWriting) return 'writing';
    if (isScanning) return 'creating';
    if (tagUID) return 'written';
    return 'idle';
  };

  return (
    <View style={{ gap: theme.spacing.xl }}>
      {/* Zone de scan NFC */}
      <NFCScanZone state={getScanZoneState()} />

      {/* Texte et description - Même message pendant toute la phase */}
      <View style={{ alignItems: 'center', gap: theme.spacing.sm }}>
        <ThemedText type="title" style={{ textAlign: 'center', fontSize: 24 }}>
          {error
            ? t('kidoos.nfc.errorTitle', 'Erreur')
            : isProcessing || !tagUID
              ? t('kidoos.nfc.processing', 'Traitement en cours...')
              : t('kidoos.nfc.tagDetected', 'Tag détecté')}
        </ThemedText>
        <ThemedText style={{ textAlign: 'center', opacity: 0.7, fontSize: 15 }}>
          {error
            ? t('kidoos.nfc.description', 'Approchez un tag NFC du lecteur NFC de votre Kidoo')
            : isProcessing || !tagUID
              ? t('kidoos.nfc.description', 'Approchez un tag NFC du lecteur NFC de votre Kidoo')
              : t('kidoos.nfc.tagDetectedSuccess', 'Tag détecté avec succès. Vous pouvez continuer.')}
        </ThemedText>
        {tagUID && !error && isDeveloperMode && (
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
