/**
 * Contexte pour gérer l'ajout de contenu multimédia à un tag
 * Centralise la logique du workflow (sélection, configuration, finalisation)
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useStepIndicator } from '@/components/ui/step-indicator';
import { multimediaFormSchema, type MultimediaFormData } from '@/types/shared';
import { apiUpload, type UploadProgress, type ApiResponse } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { multimediaKeys } from '@/services/models/basic/api/basic-api-multimedia';

interface MultimediaContextValue {
  // État des étapes
  isProcessing: boolean;
  isSuccess: boolean;
  error: string | null;
  uploadProgress: UploadProgress | null;

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
  setBottomSheetRef: (ref: { dismiss: () => void } | null) => void;
}

const MultimediaContext = createContext<MultimediaContextValue | undefined>(undefined);

interface MultimediaProviderProps {
  onDismiss?: () => void;
  tagId?: string; // ID du tag pour lier le fichier multimédia
  kidooId?: string; // ID du Kidoo pour le chemin de sauvegarde
  children: ReactNode;
}

export function MultimediaProvider({ onDismiss, tagId, kidooId, children }: MultimediaProviderProps) {
  const { currentStep, setCurrentStep, resetSteps } = useStepIndicator();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [bottomSheetRef, setBottomSheetRef] = useState<{ dismiss: () => void } | null>(null);

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
    setUploadProgress(null);
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

    if (currentStep < 2) { // Step 3 temporairement désactivé
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

    // Vérifier que l'utilisateur est connecté
    if (!user?.id) {
      setError('Vous devez être connecté pour uploader un fichier');
      return;
    }

    // Vérifier que kidooId et tagId sont présents
    if (!kidooId || !tagId) {
      setError('Kidoo ID et Tag ID sont requis pour l\'upload');
      return;
    }

    // Récupérer le fichier audio
    const audioFile = watch('audioFile');
    if (!audioFile || !audioFile.uri) {
      setError('Aucun fichier audio sélectionné');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setUploadProgress(null);

    try {
      console.log('[Multimedia] Début de l\'upload...', { fileName: audioFile.name, tagId, kidooId, userId: user.id });

      // Upload du fichier avec suivi de progression
      const response = await apiUpload<ApiResponse<{ url: string; path: string; fileName: string; size: number; mimeType: string; tagId: string | null }>>(
        '/api/multimedia/upload',
        audioFile.uri,
        audioFile.name,
        audioFile.mimeType || 'audio/mpeg',
        user.id, // Passer userId pour l'authentification
        { tagId, kidooId }, // Passer tagId et kidooId pour le chemin de sauvegarde
        (progress) => {
          setUploadProgress(progress);
          console.log('[Multimedia] Progression:', progress.percentage + '%');
        },
        audioFile.size // Passer la taille réelle du fichier pour un calcul de pourcentage correct
      );

      if (response.success) {
        console.log('[Multimedia] Upload réussi:', response.data);
        setIsSuccess(true);
        setIsProcessing(false);

        // Invalider le cache des multimédias pour ce tag pour rafraîchir la liste
        if (tagId) {
          queryClient.invalidateQueries({
            queryKey: multimediaKeys.byTag(tagId),
          });
        }

        // Fermer la sheet via la ref
        bottomSheetRef?.dismiss();
        // Réinitialiser après la fermeture pour la prochaine ouverture
        setTimeout(() => {
          reset();
        }, 100);
      } else {
        throw new Error(response.error || 'Erreur lors de l\'upload');
      }
    } catch (err) {
      console.error('[Multimedia] Erreur lors de l\'upload:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'upload');
      setIsProcessing(false);
      setUploadProgress(null);
    }
  }, [trigger, reset, watch, tagId, kidooId, user, bottomSheetRef, queryClient]);

  const value: MultimediaContextValue = {
    isProcessing,
    isSuccess,
    error,
    uploadProgress,
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
    setBottomSheetRef,
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
