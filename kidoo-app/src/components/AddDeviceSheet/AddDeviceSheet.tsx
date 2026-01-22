/**
 * Add Device Sheet Component
 * Bottom sheet pour ajouter un nouveau device avec stepper
 */

import React, { useCallback, useMemo, useEffect } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, BottomSheet, Stepper, StepperStep } from '@/components/ui';
import { useTheme } from '@/theme';
import { UseBottomSheetReturn } from '@/hooks/useBottomSheet';
import { BLEDevice } from '@/contexts/BluetoothContext';
import { AddDeviceProvider, useAddDevice } from './AddDeviceContext';
import {
  StepperContainer,
  StepContent,
  ActionsContainer,
  ActionsRow,
  Step1Name,
  Step2WiFi,
} from './components';

export interface AddDeviceSheetProps {
  /**
   * Référence du bottom sheet
   */
  bottomSheet: UseBottomSheetReturn;
  
  /**
   * Device BLE détecté (optionnel)
   */
  device?: BLEDevice | null;
  
  /**
   * Modèle détecté (optionnel)
   */
  detectedModel?: string | null;
  
  /**
   * Callback appelé lors de la fermeture
   */
  onClose?: () => void;
  
  /**
   * Callback appelé lors de la complétion
   */
  onComplete?: () => void;
}

/**
 * Composant interne qui utilise le provider
 */
function AddDeviceSheetContent({
  bottomSheet,
  device,
  detectedModel,
  onClose,
  onComplete,
}: AddDeviceSheetProps) {
  const { t } = useTranslation();
  const { spacing } = useTheme();
  const {
    currentStep,
    nextStep,
    previousStep,
    resetAll,
    canGoNext,
  } = useAddDevice();

  const handleDismiss = useCallback(() => {
    bottomSheet.handleDidDismiss({} as any);
    resetAll();
    onClose?.();
  }, [bottomSheet, onClose, resetAll]);

  const handleNext = useCallback(() => {
    if (currentStep < 2) {
      nextStep();
    } else {
      // Dernière étape, compléter
      onComplete?.();
      bottomSheet.close();
    }
  }, [bottomSheet, currentStep, nextStep, onComplete]);

  const handlePrevious = useCallback(() => {
    previousStep();
  }, [previousStep]);

  const handleCancel = useCallback(async () => {
    await bottomSheet.close();
    resetAll();
    onClose?.();
  }, [bottomSheet, onClose, resetAll]);

  // Réinitialiser le formulaire quand le sheet se ferme
  useEffect(() => {
    return () => {
      resetAll();
    };
  }, [resetAll]);

  // Définir les étapes du stepper
  const steps: StepperStep[] = useMemo(() => [
    {
      title: t('device.add.step1.title', { defaultValue: 'Nom du Kidoo' }),
      icon: 'cube-outline',
      content: <Step1Name />,
    },
    {
      title: t('device.add.step2.title', { defaultValue: 'Identifiants WiFi' }),
      icon: 'wifi-outline',
      content: <Step2WiFi />,
    },
    {
      title: t('device.add.step3.title', { defaultValue: 'Finalisation' }),
      icon: 'checkmark-circle-outline',
      content: (
        <View>
          {/* TODO: Ajouter la finalisation */}
        </View>
      ),
    },
  ], [t]);

  return (
    <BottomSheet
      ref={bottomSheet.ref}
      name={bottomSheet.id}
      detents={['auto']}
      onDismiss={handleDismiss}
      headerTitle={t('device.add.title', { defaultValue: 'Ajouter un device' })}
    >
      <View>
        {/* Stepper horizontal */}
        <StepperContainer>
          <Stepper steps={steps} activeStep={currentStep} orientation="horizontal" />
        </StepperContainer>

        {/* Contenu de l'étape active */}
        <StepContent>
          {steps[currentStep]?.content}
        </StepContent>

        {/* Actions globales */}
        <ActionsContainer>
          {currentStep === 0 ? (
            // Step 1 : Bouton Annuler et Suivant côte à côte
            <ActionsRow>
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
                disabled={!canGoNext()}
              />
            </ActionsRow>
          ) : (
            // Steps 2 et 3 : Bouton Retour et Suivant/Terminer côte à côte
            <ActionsRow>
              <Button
                title={t('common.back', { defaultValue: 'Retour' })}
                variant="outline"
                onPress={handlePrevious}
                style={{ flex: 1, marginRight: spacing[2] }}
              />
              <Button
                title={currentStep === 2 
                  ? t('device.add.complete', { defaultValue: 'Terminer' })
                  : t('common.next', { defaultValue: 'Suivant' })}
                variant="primary"
                onPress={handleNext}
                style={{ flex: 1 }}
                disabled={currentStep === 1 && !canGoNext()}
              />
            </ActionsRow>
          )}
        </ActionsContainer>
      </View>
    </BottomSheet>
  );
}

/**
 * Bottom sheet pour ajouter un nouveau device avec stepper
 * 
 * @example
 * ```tsx
 * const addDeviceSheet = useBottomSheet();
 * 
 * <AddDeviceSheet
 *   bottomSheet={addDeviceSheet}
 *   onClose={() => console.log('Fermé')}
 *   onComplete={() => console.log('Complété')}
 * />
 * ```
 */
export function AddDeviceSheet(props: AddDeviceSheetProps) {
  // Utiliser le nom du device BLE comme nom par défaut
  const defaultName = props.device?.name || '';
  
  return (
    <AddDeviceProvider defaultName={defaultName}>
      <AddDeviceSheetContent {...props} />
    </AddDeviceProvider>
  );
}
