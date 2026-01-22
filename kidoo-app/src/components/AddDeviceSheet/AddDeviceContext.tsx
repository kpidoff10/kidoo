/**
 * Add Device Context
 * Gestion du stepper et du formulaire pour ajouter un nouveau device
 * Context spécifique au composant AddDeviceSheet
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { kidooNameSchema, kidooWiFiSchema } from '@shared';

// Schéma combiné pour tout le formulaire (toutes les étapes)
const addDeviceFormSchema = kidooNameSchema.merge(kidooWiFiSchema);

export type AddDeviceFormData = z.infer<typeof addDeviceFormSchema>;

interface AddDeviceState {
  currentStep: number;
  formData: {
    name?: string;
    wifiSSID?: string;
    wifiPassword?: string;
  };
}

interface AddDeviceContextType extends AddDeviceState {
  // Formulaire
  control: ReturnType<typeof useForm<AddDeviceFormData>>['control'];
  handleSubmit: ReturnType<typeof useForm<AddDeviceFormData>>['handleSubmit'];
  formState: ReturnType<typeof useForm<AddDeviceFormData>>['formState'];
  getValues: ReturnType<typeof useForm<AddDeviceFormData>>['getValues'];
  reset: ReturnType<typeof useForm<AddDeviceFormData>>['reset'];
  trigger: ReturnType<typeof useForm<AddDeviceFormData>>['trigger'];
  
  // Navigation
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  
  // Réinitialisation
  resetAll: () => void;
  
  // Validation
  canGoNext: () => boolean;
}

const AddDeviceContext = createContext<AddDeviceContextType | undefined>(undefined);

interface AddDeviceProviderProps {
  children: React.ReactNode;
  defaultName?: string; // Nom par défaut (ex: nom du device BLE)
}

export function AddDeviceProvider({ children, defaultName = '' }: AddDeviceProviderProps) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<AddDeviceState['formData']>({});

  const {
    control,
    handleSubmit,
    formState,
    getValues,
    reset,
    trigger,
  } = useForm<AddDeviceFormData>({
    resolver: zodResolver(addDeviceFormSchema),
    defaultValues: {
      name: defaultName,
      wifiSSID: '',
      wifiPassword: '',
    },
    mode: 'onBlur',
  });

  const nextStep = useCallback(async () => {
    // Valider le formulaire de l'étape actuelle avant de passer à la suivante
    if (currentStep === 0) {
      // Phase 1 : Valider le nom
      const isValid = await trigger('name');
      if (isValid) {
        const values = getValues();
        setFormData((prev) => ({ ...prev, name: values.name }));
        setCurrentStep((prev) => prev + 1);
      }
    } else if (currentStep === 1) {
      // Phase 2 : Valider le WiFi (SSID obligatoire)
      const isValid = await trigger('wifiSSID');
      if (isValid) {
        const values = getValues();
        setFormData((prev) => ({ 
          ...prev, 
          wifiSSID: values.wifiSSID,
          wifiPassword: values.wifiPassword,
        }));
        setCurrentStep((prev) => prev + 1);
      }
    } else {
      // Dernière étape
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, trigger, getValues]);

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step <= 2) {
      setCurrentStep(step);
    }
  }, []);

  // Mettre à jour le nom quand defaultName change
  useEffect(() => {
    if (defaultName && !getValues('name')) {
      reset({
        name: defaultName,
        wifiSSID: getValues('wifiSSID') || '',
        wifiPassword: getValues('wifiPassword') || '',
      });
    }
  }, [defaultName, reset, getValues]);

  const resetAll = useCallback(() => {
    setCurrentStep(0);
    setFormData({});
    reset({
      name: defaultName || '',
      wifiSSID: '',
      wifiPassword: '',
    });
  }, [reset, defaultName]);

  const canGoNext = useCallback(() => {
    if (currentStep === 0) {
      // Vérifier uniquement si le nom est valide et non vide (pas le reste du formulaire)
      const name = getValues('name');
      return !!name && name.trim().length > 0;
    } else if (currentStep === 1) {
      // Vérifier si le SSID WiFi est valide (obligatoire)
      const wifiSSID = getValues('wifiSSID');
      return !!wifiSSID && wifiSSID.trim().length > 0;
    }
    return true;
  }, [currentStep, getValues]);

  const value: AddDeviceContextType = {
    currentStep,
    formData,
    control,
    handleSubmit,
    formState,
    getValues,
    reset,
    trigger,
    nextStep,
    previousStep,
    goToStep,
    resetAll,
    canGoNext,
  };

  return (
    <AddDeviceContext.Provider value={value}>
      {children}
    </AddDeviceContext.Provider>
  );
}

export function useAddDevice() {
  const context = useContext(AddDeviceContext);
  if (context === undefined) {
    throw new Error('useAddDevice must be used within an AddDeviceProvider');
  }
  return context;
}
