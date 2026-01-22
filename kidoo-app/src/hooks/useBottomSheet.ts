/**
 * useBottomSheet Hook
 * Hook pour gérer l'ouverture/fermeture d'un BottomSheet avec ID unique
 */

import { useRef, useCallback, useMemo } from 'react';
import { TrueSheet, DidDismissEvent } from '@lodev09/react-native-true-sheet';

// Compteur global pour générer des IDs uniques
let bottomSheetCounter = 0;

export interface UseBottomSheetReturn {
  /**
   * Ref à passer au composant BottomSheet
   */
  ref: React.RefObject<TrueSheet | null>;
  
  /**
   * ID unique pour ce bottom sheet (pour le prop `name`)
   */
  id: string;
  
  /**
   * Ouvrir le bottom sheet
   * @param index - Index du detent (défaut: 0)
   * @param animated - Animer l'ouverture (défaut: true)
   */
  open: (index?: number, animated?: boolean) => Promise<void>;
  
  /**
   * Fermer le bottom sheet
   * @param animated - Animer la fermeture (défaut: true)
   */
  close: (animated?: boolean) => Promise<void>;
  
  /**
   * Vérifier si le bottom sheet est ouvert
   */
  isOpen: () => boolean;
  
  /**
   * Handler pour onDidDismiss - à passer au BottomSheet
   */
  handleDidDismiss: (event: DidDismissEvent) => void;
}

/**
 * Hook pour gérer un BottomSheet
 * 
 * @example
 * ```tsx
 * const bottomSheet = useBottomSheet();
 * 
 * <BottomSheet
 *   ref={bottomSheet.ref}
 *   name={bottomSheet.id}
 *   onDismiss={bottomSheet.close}
 * >
 *   <Text>Contenu</Text>
 * </BottomSheet>
 * 
 * <Button onPress={() => bottomSheet.open()} title="Ouvrir" />
 * ```
 */
export function useBottomSheet(): UseBottomSheetReturn {
  const ref = useRef<TrueSheet>(null);
  // Générer un ID unique stable qui ne change pas entre les renders
  const id = useMemo(() => {
    bottomSheetCounter += 1;
    return `bottom-sheet-${bottomSheetCounter}`;
  }, []);
  const isOpenRef = useRef(false);

  const handleDidDismiss = useCallback((event: DidDismissEvent) => {
    // Mettre à jour l'état quand le sheet est fermé
    isOpenRef.current = false;
  }, []);

  const open = useCallback(async (index?: number, animated?: boolean) => {
    try {
      if (!ref.current) {
        console.warn('BottomSheet ref is not available');
        return;
      }
      // Toujours essayer d'ouvrir, même si on pense qu'il est déjà ouvert
      // Le sheet lui-même gérera l'état
      await ref.current.present(index, animated);
      isOpenRef.current = true;
    } catch (error) {
      console.error('Erreur lors de l\'ouverture du bottom sheet:', error);
      isOpenRef.current = false;
    }
  }, []);

  const close = useCallback(async (animated?: boolean) => {
    try {
      // Ne pas fermer si déjà fermé
      if (!isOpenRef.current) {
        return;
      }
      if (!ref.current) {
        return;
      }
      await ref.current.dismiss(animated);
      // Ne pas mettre à jour isOpenRef ici, onDidDismiss le fera
    } catch (error) {
      console.error('Erreur lors de la fermeture du bottom sheet:', error);
      isOpenRef.current = false;
    }
  }, []);

  const isOpen = useCallback(() => {
    return isOpenRef.current;
  }, []);

  return {
    ref,
    id,
    open,
    close,
    isOpen,
    handleDidDismiss,
  };
}
