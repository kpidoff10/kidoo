/**
 * Composant KidooSetupModal
 * Modal de configuration d'un nouveau Kidoo avec stepper à 3 étapes
 * Utilise le BLE Manager centralisé pour toutes les opérations Bluetooth
 * Utilise react-hook-form pour la gestion des formulaires avec validation Zod
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ThemedTrueSheet, ThemedTrueSheetRef } from '@/components/ui/themed-true-sheet';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import { bleManager } from '@/services/bte';
import { createKidoo } from '@/services/kidooService';
import { useAuth } from '@/contexts/AuthContext';
import { kidooSetupSchema, type KidooSetupInput } from '@/types/shared';
import { StepIndicatorProvider, StepIndicator, useStepIndicator } from '@/components/ui/step-indicator';
import { ConnectionStep } from './components/connection-step';
import { WifiConfigStep } from './components/wifi-config-step';
import { FinalizationStep } from './components/finalization-step';

interface KidooSetupModalProps {
  device: {
    id: string;
    name: string;
    deviceId: string;
  } | null;
  onComplete?: (device: { id: string; name: string; deviceId: string }) => void;
  onClose?: () => void;
}

const TOTAL_STEPS = 3;

// Composant interne qui utilise le contexte
const KidooSetupModalContent = React.forwardRef<ThemedTrueSheetRef, KidooSetupModalProps>(
  ({ device, onComplete, onClose }, ref) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const { currentStep, setCurrentStep, markStepCompleted } = useStepIndicator();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isCreatingKidoo, setIsCreatingKidoo] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);
    const [firmwareVersion, setFirmwareVersion] = useState<string | null>(null);
    const [kidooModel, setKidooModel] = useState<string | null>(null);
    
    // Refs simplifiés : seulement ceux vraiment nécessaires
    const hasCreatedKidooRef = useRef(false); // Pour éviter les créations multiples
    const createdKidooDataRef = useRef<{ id: string; name: string; deviceId: string } | null>(null); // Stocker les données du Kidoo créé
    const { user } = useAuth();

    // Initialiser react-hook-form avec validation Zod
    // Utiliser le schéma complet mais valider seulement les champs pertinents à chaque étape
    const {
      control,
      formState: { errors },
      trigger,
      reset,
      watch,
      setValue,
      clearErrors,
    } = useForm<KidooSetupInput>({
      resolver: zodResolver(kidooSetupSchema),
      defaultValues: {
        deviceName: '',
        wifiSSID: '',
        wifiPassword: '',
      },
      mode: 'onBlur',
    });

    // Nettoyer les erreurs quand on change d'étape
    useEffect(() => {
      clearErrors();
    }, [currentStep, clearErrors]);

    const deviceName = watch('deviceName');
    const wifiSSID = watch('wifiSSID');
    const wifiPassword = watch('wifiPassword');

    // Fonction pour nettoyer le BLE (séparée de la fermeture)
    const cleanupBLE = useCallback(async () => {
      try {
        bleManager.setCallbacks({});
        // Ne plus appeler stopMonitoring() car le monitoring reste actif pendant la connexion
        // Il sera arrêté automatiquement à la déconnexion
        
        if (bleManager.isConnected()) {
          await bleManager.disconnect();
        }
      } catch (error) {
        console.error('[KidooSetupModal] Erreur dans cleanupBLE():', error);
      }
    }, []);

    // handleClose est appelé par onDismiss
    const handleClose = useCallback(() => {
      if (createdKidooDataRef.current && onComplete) {
        try {
          onComplete(createdKidooDataRef.current);
          createdKidooDataRef.current = null;
        } catch (error) {
          console.error('[KidooSetupModal] Erreur dans onComplete():', error);
        }
      }

      cleanupBLE().catch((error) => {
        console.error('[KidooSetupModal] Erreur nettoyage BLE:', error);
      });
      
      try {
        onClose?.();
      } catch (error) {
        console.error('[KidooSetupModal] Erreur dans onClose():', error);
      }
    }, [onClose, cleanupBLE, onComplete]);

    // Créer le Kidoo sur le serveur une fois que tous les tests sont OK
    useEffect(() => {
      const createKidooOnServer = async () => {
        if (
          !isSuccess ||
          !user?.id ||
          !device ||
          hasCreatedKidooRef.current ||
          isCreatingKidoo
        ) {
          return;
        }

        setIsCreatingKidoo(true);
        hasCreatedKidooRef.current = true;

        try {
                 const result = await createKidoo(
                   {
                     name: deviceName || device.name,
                     model: kidooModel || 'classic', // Utiliser le modèle récupéré ou 'classic' par défaut
                     deviceId: device.deviceId,
                     macAddress: device.deviceId,
                     firmwareVersion: firmwareVersion || undefined,
                   },
                   user.id
                 );

          if (!result.success) {
            setCreateError(result.error || 'Erreur lors de la création du Kidoo');
            hasCreatedKidooRef.current = false;
            setIsCreatingKidoo(false);
            return;
          }

          setCreateError(null);
          setIsCreatingKidoo(false);
          markStepCompleted(3); // Marquer l'étape 3 comme complétée

          createdKidooDataRef.current = {
            id: result.data.id,
            name: result.data.name,
            deviceId: result.data.deviceId,
          };
        } catch (error) {
          setCreateError(error instanceof Error ? error.message : 'Erreur lors de la création du Kidoo');
          hasCreatedKidooRef.current = false;
          setIsCreatingKidoo(false);
        }
      };

             createKidooOnServer();
           }, [isSuccess, user?.id, device, deviceName, firmwareVersion, kidooModel, isCreatingKidoo, markStepCompleted]);

    // Réinitialiser quand un nouveau device est sélectionné
    useEffect(() => {
      if (device) {
        setCurrentStep(1);
        reset({
          deviceName: device.name,
          wifiSSID: '',
          wifiPassword: '',
        });
        setIsSuccess(false);
        setIsProcessing(false);
        setIsCreatingKidoo(false);
        setCreateError(null);
        hasCreatedKidooRef.current = false;
        createdKidooDataRef.current = null;
      }
      
      return () => {
        // Le monitoring sera arrêté automatiquement à la déconnexion
        // Pas besoin de l'arrêter manuellement ici
      };
    }, [device, reset]);

    // Configurer les callbacks du BLE Manager
    useEffect(() => {
      bleManager.setCallbacks({
        onError: (error) => {
          console.error('[KidooSetupModal] Erreur BLE:', error);
        },
      });

      return () => {
        try {
          bleManager.setCallbacks({});
          } catch (error) {
            console.error('[KidooSetupModal] Erreur lors du nettoyage des callbacks:', error);
          }
      };
    }, []);

    // Valider l'étape actuelle avant de passer à la suivante
    const handleNext = useCallback(async () => {
      try {
        if (currentStep === 1) {
          const isValid = await trigger('deviceName');
          if (isValid) {
            markStepCompleted(1);
            setCurrentStep(2);
          }
        } else if (currentStep === 2) {
          const isValid = await trigger(['wifiSSID', 'wifiPassword']);
          if (isValid) {
            markStepCompleted(2);
            setCurrentStep(3);
          }
        } else if (currentStep === TOTAL_STEPS) {
          if (isSuccess && !isCreatingKidoo && hasCreatedKidooRef.current) {
            const currentRef = ref && 'current' in ref ? ref.current : null;
            if (currentRef) {
              try {
                currentRef.dismiss();
              } catch (error) {
                console.error('[KidooSetupModal] Erreur lors de dismiss():', error);
        }
            }
          }
        }
      } catch (error) {
        console.error('[KidooSetupModal] Erreur dans handleNext():', error);
      }
    }, [currentStep, trigger, isSuccess, isCreatingKidoo, ref, markStepCompleted, setCurrentStep]);

    const handlePrevious = useCallback(() => {
      try {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
        }
      } catch (error) {
        console.error('[KidooSetupModal] Erreur dans handlePrevious():', error);
      }
    }, [currentStep, setCurrentStep]);

    const renderStepContent = () => {
      switch (currentStep) {
        case 1:
          return (
            <ConnectionStep
              control={control}
              error={errors.deviceName?.message}
            />
          );
        case 2:
          return (
            <WifiConfigStep
              control={control}
              errors={errors}
              setValue={setValue}
            />
          );
        case 3:
          return (
                 <FinalizationStep
                   deviceName={deviceName || device?.name || ''}
                   deviceId={device?.deviceId || ''}
                   wifiSSID={wifiSSID || ''}
                   wifiPassword={wifiPassword || ''}
                   onProcessingChange={setIsProcessing}
                   onSuccessChange={setIsSuccess}
                   createError={createError}
                   onFirmwareVersionChange={setFirmwareVersion}
                   onModelChange={setKidooModel}
                 />
          );
        default:
          return null;
      }
    };

    return (
      <ThemedTrueSheet
        ref={ref}
    
        onDidDismiss={handleClose}
        dismissible={!isProcessing}
        draggable={!isProcessing}
  
        
        grabberOptions={{ color: theme.colors.border }}
      >
        {/* Step Indicator */}
        <StepIndicator
          icons={{
            1: 'edit',
            2: 'wifi',
            3: 'check-circle',
          }}
          specificCompletedStep={isSuccess ? 3 : undefined}
        />

        {/* Step Content */}
        <ScrollView
          style={theme.components.setupStepContent}
          contentContainerStyle={theme.components.setupStepContentScroll}
          showsVerticalScrollIndicator={false}
        >
          {renderStepContent()}
        </ScrollView>

        {/* Buttons */}
        <View style={theme.components.setupStepButtons}>
          {currentStep > 1 && !isSuccess && (
            <Button
              label={t('kidoos.setup.buttons.previous', 'Précédent')}
              onPress={handlePrevious}
              variant="outline"
              style={theme.components.setupStepButton}
              disabled={isProcessing}
            />
          )}
          <Button
            label={
              currentStep === TOTAL_STEPS
                ? isCreatingKidoo
                  ? t('kidoos.setup.buttons.creating', 'Création...')
                  : t('kidoos.setup.buttons.finish', 'Terminer')
                : t('kidoos.setup.buttons.next', 'Suivant')
            }
            onPress={handleNext}
            style={theme.components.setupStepButton}
            disabled={isProcessing || (currentStep === TOTAL_STEPS && (!isSuccess || isCreatingKidoo))}
            loading={(isProcessing || isCreatingKidoo) && currentStep === TOTAL_STEPS}
          />
        </View>
      </ThemedTrueSheet>
    );
  }
);

KidooSetupModalContent.displayName = 'KidooSetupModalContent';

// Composant wrapper avec le provider
export const KidooSetupModal = React.forwardRef<ThemedTrueSheetRef, KidooSetupModalProps>(
  (props, ref) => {
    return (
      <StepIndicatorProvider totalSteps={TOTAL_STEPS} initialStep={1}>
        <KidooSetupModalContent {...props} ref={ref} />
      </StepIndicatorProvider>
    );
  }
);

KidooSetupModal.displayName = 'KidooSetupModal';
