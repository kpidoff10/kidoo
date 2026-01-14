/**
 * Contexte pour gérer l'ajout d'un tag NFC
 * Centralise la logique du workflow (scan, nommage, création)
 */

import React, { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useKidoo } from '@/contexts/KidooContext';
import { useAuth } from '@/contexts/AuthContext';
import { checkTagExists } from '@/services/tagService';
import { useStepIndicator } from '@/components/ui/step-indicator';

// Schéma de validation pour le nom du tag
const tagNameSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100, 'Le nom est trop long'),
});

export type TagNameFormData = z.infer<typeof tagNameSchema>;

interface NFCWriteContextValue {
  // État des étapes
  isScanning: boolean;
  isProcessing: boolean;
  isSuccess: boolean;
  error: string | null;
  
  // Données du tag
  tagUID: string | null;
  scannedUID: string | null;
  writtenTagId: string | null;
  
  // Formulaire
  form: {
    control: any;
    errors: any;
    trigger: () => Promise<boolean>;
    reset: () => void;
  };
  
  // Actions
  handleScanTag: () => Promise<void>;
  handleNextFromName: () => Promise<void>;
  handleCreateTag: () => Promise<void>;
  handlePrevious: () => void;
  handleCancel: () => void;
  handleNext: () => Promise<void>;
  setError: (error: string | null) => void;
  setBottomSheetRef: (ref: any) => void;
}

const NFCWriteContext = createContext<NFCWriteContextValue | undefined>(undefined);

interface NFCWriteProviderProps {
  onTagWritten?: (tagId: string, uid: string) => void;
  onDismiss?: () => void;
  children: ReactNode;
}

export function NFCWriteProvider({ onTagWritten, onDismiss, children }: NFCWriteProviderProps) {
  const { t } = useTranslation();
  const { kidoo, tagAddSuccess, readNFCTag, writeNFCTagId } = useKidoo();
  const { user } = useAuth();
  const { currentStep, setCurrentStep, markStepCompleted, resetSteps } = useStepIndicator();
  
  // Nettoyer le monitoring au démontage
  React.useEffect(() => {
    return () => {
      import('@/services/nfcManager').then(({ nfcManager }) => {
        nfcManager.stopMonitoring();
      });
    };
  }, []);
  
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagUID, setTagUID] = useState<string | null>(null);
  const [scannedUID, setScannedUID] = useState<string | null>(null);
  const [writtenTagId, setWrittenTagId] = useState<string | null>(null);
  const hasCreatedTagRef = useRef(false);
  const bottomSheetRef = useRef<any>(null); // Pour la fermeture automatique
  
  // Fonction pour définir la ref du BottomSheet depuis le composant parent
  const setBottomSheetRef = useCallback((ref: any) => {
    bottomSheetRef.current = ref;
  }, []);

  // Initialiser react-hook-form
  const {
    control,
    trigger,
    formState: { errors },
    reset: resetForm,
  } = useForm<TagNameFormData>({
    resolver: zodResolver(tagNameSchema),
    defaultValues: {
      name: '',
    },
  });

  // Réinitialiser quand la modale s'ouvre (quand le provider est monté)
  React.useEffect(() => {
    resetSteps(); // Réinitialiser les étapes complétées
    setIsScanning(false);
    setIsProcessing(false);
    setIsSuccess(false);
    setError(null);
    setTagUID(null);
    setScannedUID(null);
    setWrittenTagId(null);
    hasCreatedTagRef.current = false;
    resetForm({ name: '' });
  }, [resetSteps, resetForm]);

  // Réinitialiser l'état
  const reset = useCallback(() => {
    resetSteps(); // Réinitialiser les étapes complétées
    setIsScanning(false);
    setIsProcessing(false);
    setIsSuccess(false);
    setError(null);
    setTagUID(null);
    setScannedUID(null);
    setWrittenTagId(null);
    hasCreatedTagRef.current = false;
    resetForm({ name: '' });
  }, [resetSteps, resetForm]);

  // Étape 1 : Scanner le tag NFC
  const handleScanTag = useCallback(async () => {
    if (!user?.id || !kidoo.id) {
      setError('Utilisateur ou Kidoo non disponible');
      return;
    }

    setIsScanning(true);
    setError(null);

    try {
      // Lire le tag NFC pour obtenir l'UID
      const readResult = await readNFCTag(4, (state, message) => {
        console.log('[NFCWriteSheet] Scan:', state, message);
      });

      if (!readResult.success || !readResult.uid) {
        setError(readResult.error || 'Impossible de lire le tag NFC');
        setIsScanning(false);
        return;
      }

      const uid = readResult.uid;
      setScannedUID(uid);

      // Vérifier si ce tag existe déjà
      const checkResult = await checkTagExists('', user.id, uid, kidoo.id);

      if (!checkResult.success) {
        setError(checkResult.error || 'Erreur lors de la vérification du tag');
        setIsScanning(false);
        return;
      }

      if (checkResult.uidExists) {
        setError(t('kidoos.nfc.errorTagAlreadyUsed', 'Ce tag existe déjà. Veuillez utiliser un autre tag.'));
        setIsScanning(false);
        return;
      }

      // Le tag est valide, générer l'UUID et écrire directement sur le tag
      // Passer directement en mode écriture sans désactiver le scan pour éviter la confusion
      setIsProcessing(true);
      setIsScanning(false);
      
      // Générer l'UUID
      const { nfcManager } = await import('@/services/nfcManager');
      const generatedTagId = nfcManager.generateUUID();
      console.log('[NFCWriteSheet] UUID généré:', generatedTagId);

      // Vérifier si le tagId existe déjà
      const tagIdCheckResult = await checkTagExists(generatedTagId, user.id);

      if (!tagIdCheckResult.success) {
        const error = tagIdCheckResult.error || 'Erreur lors de la vérification du tag';
        setError(error);
        setIsProcessing(false);
        return;
      }

      if (tagIdCheckResult.tagIdExists) {
        const error = t('kidoos.nfc.errorTagAlreadyUsed', 'Ce tag existe déjà. Veuillez utiliser un autre tag.');
        setError(error);
        setIsProcessing(false);
        return;
      }

      // Écrire l'UUID sur le tag NFC
      // Note: L'UID a déjà été vérifié avant l'écriture, donc on peut écrire en toute sécurité
      const writeResult = await writeNFCTagId(generatedTagId, 4, (state, message) => {
        console.log('[NFCWriteSheet] Write:', state, message);
      });

      if (!writeResult.success) {
        setError(writeResult.error || 'Erreur lors de l\'écriture sur le tag');
        setIsProcessing(false);
        return;
      }

      // Stocker les données pour les étapes suivantes
      // Utiliser l'UID renvoyé par l'ESP32 après écriture, ou celui lu lors du scan
      setWrittenTagId(generatedTagId);
      setTagUID(writeResult.uid || uid);
      
      // Passer à l'étape de nommage
      setIsProcessing(false);
      markStepCompleted(1); // Marquer l'étape 1 comme complétée
      setCurrentStep(2);
    } catch (err) {
      console.error('[NFCWriteSheet] Erreur scan:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du scan du tag');
      setIsScanning(false);
    }
  }, [user?.id, kidoo.id, t, markStepCompleted, setCurrentStep, readNFCTag, writeNFCTagId]);

  // Étape 2 : Valider le nom et passer à l'étape 3
  const handleNextFromName = useCallback(async () => {
    const isValid = await trigger();
    if (isValid) {
      markStepCompleted(2); // Marquer l'étape 2 comme complétée
      setCurrentStep(3);
    }
  }, [trigger, markStepCompleted, setCurrentStep]);

  // Étape 3 : Créer le tag dans la DB (l'écriture est déjà faite à l'étape 1)
  const handleCreateTag = useCallback(async () => {
    if (!user?.id || !kidoo.id || hasCreatedTagRef.current || !writtenTagId) {
      return;
    }

    const formData = control._formValues as TagNameFormData;
    const tagName = formData.name;

    setIsProcessing(true);
    setError(null);
    hasCreatedTagRef.current = true;

    try {
      // Créer le tag dans la DB avec le tagId déjà écrit sur le tag NFC
      const { createTag } = await import('@/services/tagService');
      const createResult = await createTag(
        {
          tagId: writtenTagId,
          kidooId: kidoo.id,
          name: tagName,
        },
        user.id
      );

      if (!createResult.success) {
        const error = createResult.error || 'Erreur lors de la création du tag';
        setError(error);
        setIsProcessing(false);
        hasCreatedTagRef.current = false;
        return;
      }

      const createdTagId = createResult.data.id;

      // Mettre à jour le tag avec l'UID physique si fourni
      if (tagUID) {
        const { updateTag } = await import('@/services/tagService');
        await updateTag(createdTagId, { uid: tagUID }, user.id);
      }

      setIsSuccess(true);
      setIsProcessing(false);
      markStepCompleted(3); // Marquer l'étape 3 comme complétée

      // Envoyer la commande TAG_ADD_SUCCESS à l'ESP32 pour l'effet de couleur
      try {
        await tagAddSuccess();
        console.log('[NFCWriteContext] Commande TAG_ADD_SUCCESS envoyée à l\'ESP32');
      } catch (error) {
        console.error('[NFCWriteContext] Erreur lors de l\'envoi de la commande TAG_ADD_SUCCESS:', error);
        // Ne pas bloquer le processus si l'envoi échoue
      }

      // Appeler le callback et fermer automatiquement après un court délai
      setTimeout(() => {
        if (createdTagId && tagUID) {
          onTagWritten?.(createdTagId, tagUID);
        }
        // Fermer automatiquement après le callback
        if (bottomSheetRef.current) {
          bottomSheetRef.current.dismiss();
        }
      }, 2000); // 2 secondes pour laisser le temps à l'utilisateur de voir le succès
    } catch (err) {
      console.error('[NFCWriteSheet] Erreur création tag:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du tag');
      setIsProcessing(false);
      hasCreatedTagRef.current = false;
    }
  }, [user?.id, kidoo.id, control, onTagWritten, writtenTagId, tagUID, markStepCompleted, tagAddSuccess]);

  // Navigation entre les étapes
  const handleNext = useCallback(async () => {
    if (currentStep === 1) {
      await handleScanTag();
    } else if (currentStep === 2) {
      await handleNextFromName();
    } else if (currentStep === 3) {
      await handleCreateTag();
    }
  }, [currentStep, handleScanTag, handleNextFromName, handleCreateTag]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  }, [currentStep, setCurrentStep]);

  const handleCancel = useCallback(() => {
    import('@/services/nfcManager').then(({ nfcManager }) => {
      nfcManager.stopMonitoring();
    });
    reset();
    onDismiss?.();
  }, [onDismiss, reset]);

  const value: NFCWriteContextValue = {
    isScanning,
    isProcessing,
    isSuccess,
    error,
    tagUID,
    scannedUID,
    writtenTagId,
    form: {
      control,
      errors,
      trigger,
      reset: resetForm,
    },
    handleScanTag,
    handleNextFromName,
    handleCreateTag,
    handlePrevious,
    handleCancel,
    handleNext,
    setError,
    setBottomSheetRef,
  };

  return <NFCWriteContext.Provider value={value}>{children}</NFCWriteContext.Provider>;
}

export function useNFCWrite() {
  const context = useContext(NFCWriteContext);
  if (context === undefined) {
    throw new Error('useNFCWrite must be used within a NFCWriteProvider');
  }
  return context;
}
