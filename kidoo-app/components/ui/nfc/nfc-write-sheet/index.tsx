/**
 * Composant générique pour écrire un identifiant sur un tag NFC
 * Utilise nfcManager pour gérer le workflow complet
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { BottomSheet, type BottomSheetModalRef } from '@/components/ui/bottom-sheet';
import { AlertMessage } from '@/components/ui/alert-message';
import { nfcManager } from '@/services/nfcManager';
import { NFCScanZone, NFCStatusText, NFCActions, type NFCState } from './components';

export interface NFCWriteSheetProps {
  kidooId: string;
  userId: string;
  onTagWritten?: (tagId: string, uid: string) => void;
  onDismiss?: () => void;
}

export const NFCWriteSheet = React.forwardRef<BottomSheetModalRef, NFCWriteSheetProps>(
  ({ kidooId, userId, onTagWritten, onDismiss }, ref) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const [state, setState] = useState<NFCState>('idle');
    const [error, setError] = useState<string | null>(null);
    const [tagUID, setTagUID] = useState<string | null>(null);
    const [tagId, setTagId] = useState<string | null>(null);

    // Nettoyer le monitoring au démontage
    useEffect(() => {
      return () => {
        nfcManager.stopMonitoring();
      };
    }, []);

    const handleStartWrite = useCallback(async () => {
      if (!nfcManager.isAvailable()) {
        setError(t('kidoos.nfc.errorNotConnected', 'Le Kidoo n\'est pas connecté'));
        return;
      }

      // Réinitialiser complètement l'état avant de commencer une nouvelle écriture
      nfcManager.stopMonitoring();
      setState('idle');
      setError(null);
      setTagUID(null);
      setTagId(null);

      // Petit délai pour s'assurer que le monitoring précédent est bien arrêté
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Utiliser nfcManager pour gérer tout le workflow
      const result = await nfcManager.writeTag(
        kidooId,
        userId,
        4, // blockNumber
        (progressState, message) => {
          setState(progressState);
          if (message) {
            console.log('[NFCWriteSheet]', message);
          }
        }
      );

      if (result.success) {
        setState('written');
        setTagId(result.tagId || null);
        setTagUID(result.uid || null);
        
        // Appeler le callback après un court délai
        setTimeout(() => {
          if (result.tagId && result.uid) {
            onTagWritten?.(result.tagId, result.uid);
          }
          // Réinitialiser l'état après le callback pour permettre d'ajouter un autre tag
          setTimeout(() => {
            setState('idle');
            setTagId(null);
            setTagUID(null);
          }, 500);
        }, 1000);
      } else {
        setError(result.error || t('kidoos.nfc.errorWriteFailed', 'Erreur lors de l\'écriture sur le tag'));
        setState('error');
      }
    }, [kidooId, userId, t, onTagWritten]);

    const handleCancel = useCallback(() => {
      nfcManager.stopMonitoring();
      setState('idle');
      setError(null);
      setTagUID(null);
      setTagId(null);
      onDismiss?.();
    }, [onDismiss]);

    return (
      <BottomSheet
        ref={ref}
        onDismiss={handleCancel}
        detents={['auto']}
      >
        <View style={{ gap: theme.spacing.xl }}>
          {/* Zone de scan NFC avec animations */}
          <NFCScanZone state={state} />

          {/* Texte et description */}
          <NFCStatusText state={state} tagId={tagId} tagUID={tagUID} />

          {/* Message d'erreur */}
          {error && (
            <AlertMessage
              message={error}
              type="error"
              visible={true}
            />
          )}

          {/* Boutons */}
          <NFCActions
            state={state}
            onStartWrite={handleStartWrite}
            onCancel={handleCancel}
          />
        </View>
      </BottomSheet>
    );
  }
);

NFCWriteSheet.displayName = 'NFCWriteSheet';
