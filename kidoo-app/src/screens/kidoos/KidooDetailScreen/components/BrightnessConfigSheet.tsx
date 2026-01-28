/**
 * Brightness Config Sheet Component
 * Bottom sheet pour régler la luminosité générale de l'appareil
 */

import React, { useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Slider, Button, BottomSheet } from '@/components/ui';
import { useTheme } from '@/theme';
import { UseBottomSheetReturn } from '@/hooks/useBottomSheet';
import { useUpdateBrightness } from '@/hooks/useKidoos';
import { Kidoo } from '@/api';

export interface BrightnessConfigSheetProps {
  /**
   * Référence du bottom sheet
   */
  bottomSheet: UseBottomSheetReturn;
  
  /**
   * Kidoo à configurer
   */
  kidoo: Kidoo;
  
  /**
   * Callback appelé lors de la fermeture
   */
  onClose?: () => void;
}

export function BrightnessConfigSheet({ bottomSheet, kidoo, onClose }: BrightnessConfigSheetProps) {
  const { t } = useTranslation();
  const { spacing } = useTheme();
  const updateBrightness = useUpdateBrightness();
  
  // Valeur de luminosité actuelle (par défaut 50% si non définie)
  const [brightness, setBrightness] = React.useState(kidoo.brightness ?? 50);
  const lastSentValueRef = useRef<number | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialiser avec la valeur actuelle du Kidoo si disponible
  useEffect(() => {
    if (kidoo.brightness !== undefined && kidoo.brightness !== null) {
      setBrightness(kidoo.brightness);
      lastSentValueRef.current = kidoo.brightness;
    }
  }, [kidoo.brightness]);

  // Fonction pour envoyer la luminosité avec debounce
  const sendBrightness = useCallback(
    (value: number) => {
      // Annuler le timer précédent s'il existe
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Débouncer l'envoi pour éviter trop de requêtes
      debounceTimerRef.current = setTimeout(() => {
        // Ne pas envoyer si c'est la même valeur que la dernière envoyée
        if (lastSentValueRef.current === value) {
          return;
        }

        lastSentValueRef.current = value;
        updateBrightness.mutate(
          { id: kidoo.id, brightness: value },
          {
            onError: () => {
              // En cas d'erreur, réinitialiser lastSentValueRef pour permettre un nouvel envoi
              lastSentValueRef.current = null;
            },
          }
        );
      }, 300); // 300ms de debounce
    },
    [updateBrightness, kidoo.id]
  );

  // Nettoyer le timer au démontage
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleValueChange = useCallback(
    (newValue: number) => {
      // Vérifier que la valeur est valide
      if (newValue < 0 || newValue > 100 || isNaN(newValue)) {
        return;
      }

      // Mettre à jour l'état local immédiatement pour un feedback visuel instantané
      setBrightness(newValue);
      
      // Envoyer la valeur avec debounce
      sendBrightness(newValue);
    },
    [sendBrightness]
  );

  const handleDismiss = useCallback(() => {
    // Nettoyer le timer si le sheet est fermé
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    // Mettre à jour l'état du hook
    bottomSheet.handleDidDismiss({} as any);
    onClose?.();
  }, [onClose, bottomSheet]);

  return (
    <BottomSheet
      ref={bottomSheet.ref}
      name={bottomSheet.id}
      detents={['auto']}
      onDismiss={handleDismiss}
      headerTitle={t('kidoos.brightness.title', { defaultValue: 'Luminosité' })}
      headerIcon="sunny-outline"
    >
      <View style={styles.container}>
        <Slider
          value={brightness}
          minimumValue={0}
          maximumValue={100}
          step={1}
          onValueChange={handleValueChange}
          label={t('kidoos.brightness.label', { 
            defaultValue: 'Luminosité générale' 
          })}
          formatValue={(val) => `${Math.round(val)}%`}
        />

        <View style={styles.info}>
          <Button
            title={t('common.close', { defaultValue: 'Fermer' })}
            variant="outline"
            onPress={handleDismiss}
            style={styles.closeButton}
          />
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  info: {
    marginTop: 32,
  },
  closeButton: {
    width: '100%',
  },
});
