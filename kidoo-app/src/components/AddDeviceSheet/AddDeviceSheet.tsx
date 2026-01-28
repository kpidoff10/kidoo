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
import { BLEDevice } from '@/contexts';
import { AddDeviceProvider, useAddDevice } from './AddDeviceContext';
import {
  StepperContainer,
  StepContent,
  ActionsContainer,
  ActionsRow,
  Step1Name,
  Step2WiFi,
  Step3Finalization,
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
   * Callback appelé lors de la complétion avec les données du formulaire
   */
  onComplete?: (data: { 
    name: string; 
    wifiSSID: string; 
    wifiPassword?: string; 
    deviceId?: string;
    macAddress?: string; // Adresse MAC WiFi (renvoyée par l'ESP32)
    bluetoothMacAddress?: string; // Adresse MAC Bluetooth (device.id)
    brightness?: number;
    sleepTimeout?: number;
    firmwareVersion?: string;
  }) => void;
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
    isConnecting,
    hasError,
    getValues,
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
      // Si on est en train de se connecter, ne pas permettre de terminer
      if (isConnecting) {
        return;
      }
      const formValues = getValues();
      onComplete?.({
        name: formValues.name || '',
        wifiSSID: formValues.wifiSSID || '',
        wifiPassword: formValues.wifiPassword,
      });
      bottomSheet.close();
    }
  }, [bottomSheet, currentStep, nextStep, onComplete, isConnecting, getValues]);

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
        <Step3Finalization 
          device={device} 
          onSuccess={(data) => {
            // Quand tout est réussi, récupérer les valeurs du formulaire et terminer
            const formValues = getValues();
            onComplete?.({
              name: formValues.name || '',
              wifiSSID: formValues.wifiSSID || '',
              wifiPassword: formValues.wifiPassword,
              deviceId: data?.deviceId, // UUID renvoyé par l'ESP32
              macAddress: data?.macAddress, // Adresse MAC WiFi renvoyée par l'ESP32
              bluetoothMacAddress: data?.bluetoothMacAddress, // Adresse MAC Bluetooth (device.id)
              brightness: data?.brightness, // Brightness en pourcentage (0-100)
              sleepTimeout: data?.sleepTimeout, // Sleep timeout en millisecondes
              firmwareVersion: data?.firmwareVersion, // Version du firmware ESP32
            });
            bottomSheet.close();
          }}
        />
      ),
    },
  ], [t, device, bottomSheet, onComplete]);

  return (
    <BottomSheet
      ref={bottomSheet.ref}
      name={bottomSheet.id}
      detents={['auto']}
      onDismiss={handleDismiss}
      headerTitle={t('device.add.title', { defaultValue: 'Ajouter un nouveau Kidoo' })}
    >
      <View>
        {/* Stepper horizontal - masqué au step 3 (finalisation) */}
        {currentStep < 2 && (
          <StepperContainer>
            <Stepper steps={steps} activeStep={currentStep} orientation="horizontal" />
          </StepperContainer>
        )}

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
          ) : currentStep === 1 ? (
            // Step 2 : Bouton Retour et Suivant côte à côte
            // La connexion BLE ne se fait qu'au step 3, donc isConnecting ne devrait jamais être true ici
            <ActionsRow>
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
                disabled={!canGoNext()}
              />
            </ActionsRow>
          ) : (
            // Step 3 (Finalisation) : Afficher le bouton retour seulement s'il y a une erreur
            // Sinon, les boutons sont gérés par Step3Finalization (écran de succès)
            hasError ? (
              <Button
                title={t('common.back', { defaultValue: 'Retour' })}
                variant="outline"
                onPress={handlePrevious}
                style={{ width: '100%' }}
              />
            ) : null
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
