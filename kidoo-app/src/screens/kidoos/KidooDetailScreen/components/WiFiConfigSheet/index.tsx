/**
 * WiFi Config Sheet Component
 * Bottom sheet pour configurer le WiFi d'un Kidoo avec stepper
 */

import React, { useCallback, useMemo, useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, BottomSheet, Stepper, StepperStep } from '@/components/ui';
import { useTheme } from '@/theme';
import { UseBottomSheetReturn } from '@/hooks/useBottomSheet';
import { useBluetooth } from '@/contexts';
import { Kidoo } from '@/api';
import { Step1BLE, Step2WiFi, Step3Setup } from './steps/index';

export interface WiFiConfigSheetProps {
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
  
  /**
   * Callback appelé lors de la complétion
   */
  onComplete?: () => void;
}

export function WiFiConfigSheet({ bottomSheet, kidoo, onClose, onComplete }: WiFiConfigSheetProps) {
  const { t } = useTranslation();
  const { spacing } = useTheme();
  const { stopScan } = useBluetooth();
  const [currentStep, setCurrentStep] = useState(0);
  const [wifiSSID, setWifiSSID] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const currentStepRef = useRef(0);
  
  // Synchroniser le ref avec le state
  React.useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  const handleDismiss = useCallback(async () => {
    // Arrêter le scan BLE si actif
    stopScan();
    
    setCurrentStep(0);
    setWifiSSID('');
    setWifiPassword('');
    await bottomSheet.close();
    bottomSheet.handleDidDismiss({} as any);
    onClose?.();
  }, [bottomSheet, onClose, stopScan]);

  const handleNext = useCallback(() => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleComplete = useCallback(() => {
    handleDismiss();
    onComplete?.();
  }, [handleDismiss, onComplete]);

  // Définir les étapes du stepper (pour l'affichage visuel uniquement)
  const steps: StepperStep[] = useMemo(() => [
    {
      title: t('kidoos.wifiConfig.step1.title', { defaultValue: 'Connexion BLE' }),
      icon: 'bluetooth-outline',
    },
    {
      title: t('kidoos.wifiConfig.step2.title', { defaultValue: 'Identifiants WiFi' }),
      icon: 'wifi-outline',
    },
    {
      title: t('kidoos.wifiConfig.step3.title', { defaultValue: 'Configuration' }),
      icon: 'checkmark-circle-outline',
    },
  ], [t]);

  const canGoNext = useMemo(() => {
    if (currentStep === 0) {
      // Étape 1 : BLE doit être connecté (géré dans Step1BLE)
      return false; // Le passage se fait automatiquement
    }
    if (currentStep === 1) {
      // Étape 2 : SSID requis
      return wifiSSID.trim().length > 0;
    }
    return false; // Étape 3 : pas de bouton suivant
  }, [currentStep, wifiSSID]);

  const handleCancel = useCallback(() => {
    handleDismiss();
  }, [handleDismiss]);

  return (
    <BottomSheet
      ref={bottomSheet.ref}
      name={bottomSheet.id}
      onDismiss={handleDismiss}
      headerTitle={t('kidoos.wifiConfig.title', { defaultValue: 'Configuration WiFi' })}
    >
      <View>
        {/* Stepper horizontal - masqué au step 3 */}
        {currentStep < 2 && (
          <View style={styles.stepperContainer}>
            <Stepper steps={steps} activeStep={currentStep} orientation="horizontal" />
          </View>
        )}

        {/* Contenu de l'étape active */}
        <View style={styles.stepContent}>
          {currentStep === 0 && (
            <Step1BLE
              kidoo={kidoo}
              onSuccess={() => {
                // Passer automatiquement à l'étape suivante quand BLE est connecté
                setTimeout(() => {
                  if (currentStepRef.current === 0) {
                    setCurrentStep(1);
                  }
                }, 500);
              }}
            />
          )}
          {currentStep === 1 && (
            <Step2WiFi
              wifiSSID={wifiSSID}
              wifiPassword={wifiPassword}
              onSSIDChange={setWifiSSID}
              onPasswordChange={setWifiPassword}
            />
          )}
          {currentStep === 2 && (
            <Step3Setup
              kidoo={kidoo}
              wifiSSID={wifiSSID}
              wifiPassword={wifiPassword}
              onSuccess={handleComplete}
            />
          )}
        </View>

        {/* Actions globales */}
        <View style={styles.actionsContainer}>
          {currentStep === 0 ? (
            // Step 1 : Bouton Annuler et Suivant côte à côte
            <View style={styles.actionsRow}>
              <Button
                title={t('common.cancel')}
                variant="outline"
                onPress={handleCancel}
                style={{ flex: 1, marginRight: spacing[2] }}
              />
              <Button
                title={t('common.next', { defaultValue: 'Suivant' })}
                variant="primary"
                onPress={handleNext}
                style={{ flex: 1 }}
                disabled={!canGoNext}
              />
            </View>
          ) : currentStep === 1 ? (
            // Step 2 : Bouton Retour et Suivant côte à côte
            <View style={styles.actionsRow}>
              <Button
                title={t('common.back', { defaultValue: 'Retour' })}
                variant="outline"
                onPress={handlePrevious}
                style={{ flex: 1, marginRight: spacing[2] }}
              />
              <Button
                title={t('common.next', { defaultValue: 'Suivant' })}
                variant="primary"
                onPress={handleNext}
                style={{ flex: 1 }}
                disabled={!canGoNext}
              />
            </View>
          ) : null}
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  stepperContainer: {
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  stepContent: {
    paddingHorizontal: 16,
  },
  actionsContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
});
