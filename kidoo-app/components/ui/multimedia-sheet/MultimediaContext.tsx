/**
 * Contexte pour gérer l'ajout de contenu multimédia à un tag
 * Centralise la logique du workflow (sélection, configuration, finalisation)
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useStepIndicator } from '@/components/ui/step-indicator';
import { multimediaFormSchema, type MultimediaFormData } from '@/types/shared';

interface MultimediaContextValue {
  // État des étapes
  isProcessing: boolean;
  isSuccess: boolean;
  error: string | null;

  // Formulaire
  form: {
    control: any;
    errors: any;
    trigger: () => Promise<boolean>;
    reset: () => void;
    watch: (name?: string) => any;
    setValue: any; // UseFormSetValue avec types stricts
  };

  // Valeurs du formulaire
  acceptTerms: boolean;

  // Actions
  handleNext: () => Promise<void>;
  handlePrevious: () => void;
  handleCancel: () => void;
  handleOpen: () => void;
  handleFinish: () => Promise<void>;
  setError: (error: string | null) => void;
}

const MultimediaContext = createContext<MultimediaContextValue | undefined>(undefined);

interface MultimediaProviderProps {
  onDismiss?: () => void;
  children: ReactNode;
}

export function MultimediaProvider({ onDismiss, children }: MultimediaProviderProps) {
  const { currentStep, setCurrentStep, resetSteps } = useStepIndicator();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialiser react-hook-form
  const {
    control,
    trigger,
    watch,
    setValue,
    formState: { errors },
    reset: resetForm,
  } = useForm<MultimediaFormData>({
    resolver: zodResolver(multimediaFormSchema),
    defaultValues: {
      acceptTerms: false,
      audioFile: undefined,
      trimStart: undefined,
      trimEnd: undefined,
      title: '',
    },
  });

  // Surveiller la valeur de acceptTerms pour désactiver le bouton "Suivant"
  const acceptTerms = watch('acceptTerms');

  // Réinitialiser quand la modale s'ouvre
  React.useEffect(() => {
    resetSteps();
    setIsProcessing(false);
    setIsSuccess(false);
    setError(null);
    resetForm({ acceptTerms: false, audioFile: undefined, trimStart: undefined, trimEnd: undefined, title: '' });
  }, [resetSteps, resetForm]);

  // Réinitialiser l'état
  const reset = useCallback(() => {
    resetSteps();
    setIsProcessing(false);
    setIsSuccess(false);
    setError(null);
    resetForm({ acceptTerms: false, audioFile: undefined, trimStart: undefined, trimEnd: undefined, title: '' });
  }, [resetSteps, resetForm]);

  // Réinitialiser quand le BottomSheet s'ouvre
  const handleOpen = useCallback(() => {
    reset();
  }, [reset]);

  // Passer à l'étape suivante
  const handleNext = useCallback(async () => {
    let isValid = false;

    // Valider seulement les champs de l'étape actuelle
    if (currentStep === 1) {
      // Step 1 : Valider seulement acceptTerms
      isValid = await trigger('acceptTerms');
    } else if (currentStep === 2) {
      // Step 2 : Valider seulement audioFile
      isValid = await trigger('audioFile');
    } else {
      // Step 3 : Pas de validation nécessaire (optionnel)
      isValid = true;
    }

    if (!isValid) {
      return;
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, setCurrentStep, trigger]);

  // Revenir à l'étape précédente
  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep, setCurrentStep]);

  // Annuler et fermer
  const handleCancel = useCallback(() => {
    reset();
    onDismiss?.();
  }, [reset, onDismiss]);

  // Finaliser l'ajout de contenu multimédia
  const handleFinish = useCallback(async () => {
    // Valider le formulaire
    const isValid = await trigger();
    if (!isValid) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // TODO: Implémenter la logique de sauvegarde du contenu multimédia
      console.log('[Multimedia] Finalisation...');

      // Simuler un traitement
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSuccess(true);
      setIsProcessing(false);

      // Fermer après un court délai
      setTimeout(() => {
        reset();
        onDismiss?.();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setIsProcessing(false);
    }
  }, [trigger, reset, onDismiss]);

  const value: MultimediaContextValue = {
    isProcessing,
    isSuccess,
    error,
    form: {
      control,
      errors,
      trigger,
      reset: resetForm,
      watch,
      setValue,
    },
    acceptTerms,
    handleNext,
    handlePrevious,
    handleCancel,
    handleOpen,
    handleFinish,
    setError,
  };

  return <MultimediaContext.Provider value={value}>{children}</MultimediaContext.Provider>;
}

export function useMultimedia() {
  const context = useContext(MultimediaContext);
  if (context === undefined) {
    throw new Error('useMultimedia must be used within a MultimediaProvider');
  }
  return context;
}
