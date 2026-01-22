/**
 * Add Device Sheet Component
 * Bottom sheet pour ajouter un nouveau device avec stepper
 */

import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, BottomSheet, Stepper, StepperStep } from '@/components/ui';
import { useTheme } from '@/theme';
import { UseBottomSheetReturn } from '@/hooks/useBottomSheet';
import { BLEDevice } from '@/contexts/BluetoothContext';

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
export function AddDeviceSheet({
  bottomSheet,
  device,
  detectedModel,
  onClose,
  onComplete,
}: AddDeviceSheetProps) {
  const { t } = useTranslation();
  const { colors, spacing } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);

  const handleDismiss = useCallback(() => {
    bottomSheet.handleDidDismiss({} as any);
    setCurrentStep(0); // Réinitialiser à l'étape 0
    onClose?.();
  }, [bottomSheet, onClose]);

  const handleNext = useCallback(() => {
    setCurrentStep((prev) => {
      // On suppose 3 étapes (0, 1, 2)
      if (prev < 2) {
        return prev + 1;
      } else {
        // Dernière étape, compléter
        onComplete?.();
        bottomSheet.close();
        return prev;
      }
    });
  }, [bottomSheet, onComplete]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleCancel = useCallback(async () => {
    await bottomSheet.close();
    setCurrentStep(0);
    onClose?.();
  }, [bottomSheet, onClose]);

  // Définir les étapes du stepper
  const steps: StepperStep[] = useMemo(() => [
    {
      title: t('device.add.step1.title', { defaultValue: 'Sélection' }),
      icon: 'cube-outline',
      content: (
        <View>
          {/* TODO: Ajouter la sélection du modèle */}
          <Button
            title={t('common.next', { defaultValue: 'Suivant' })}
            variant="primary"
            onPress={handleNext}
            fullWidth
            style={{ marginTop: spacing[4] }}
          />
        </View>
      ),
    },
    {
      title: t('device.add.step2.title', { defaultValue: 'Configuration' }),
      icon: 'settings-outline',
      content: (
        <View>
          {/* TODO: Ajouter la configuration */}
          <View style={styles.stepActions}>
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
            />
          </View>
        </View>
      ),
    },
    {
      title: t('device.add.step3.title', { defaultValue: 'Finalisation' }),
      icon: 'checkmark-circle-outline',
      content: (
        <View>
          {/* TODO: Ajouter la finalisation */}
          <View style={styles.stepActions}>
            <Button
              title={t('common.back', { defaultValue: 'Retour' })}
              variant="outline"
              onPress={handlePrevious}
              style={{ flex: 1, marginRight: spacing[2] }}
            />
            <Button
              title={t('device.add.complete', { defaultValue: 'Terminer' })}
              variant="primary"
              onPress={handleNext}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      ),
    },
  ], [t, spacing, handleNext, handlePrevious]);

  return (
    <BottomSheet
      ref={bottomSheet.ref}
      name={bottomSheet.id}
      detents={['auto']}
      onDismiss={handleDismiss}
      headerTitle={t('device.add.title', { defaultValue: 'Ajouter un device' })}
      headerIcon="add-circle-outline"
    >
      <View style={styles.content}>
        {/* Stepper horizontal */}
        <View style={styles.stepperContainer}>
          <Stepper steps={steps} activeStep={currentStep} orientation="horizontal" />
        </View>

        {/* Contenu de l'étape active */}
        <View style={styles.stepContent}>
          {steps[currentStep]?.content}
        </View>

        {/* Actions globales */}
        <View style={styles.actions}>
          <Button
            title={t('common.cancel')}
            variant="outline"
            onPress={handleCancel}
            fullWidth
          />
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 0,
  },
  stepperContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  stepContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  stepActions: {
    flexDirection: 'row',
    marginTop: 24,
  },
  actions: {
    marginTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
