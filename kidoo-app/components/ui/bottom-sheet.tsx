/**
 * Composant générique Bottom Sheet réutilisable
 * Basé sur @lodev09/react-native-true-sheet
 * 
 * Simple wrapper autour de TrueSheet pour maintenir la compatibilité avec l'ancienne API
 */

import React, { useMemo, useRef, useCallback, ReactNode, createContext, useContext } from 'react';
import { SheetDetent, TrueSheet } from '@lodev09/react-native-true-sheet';
import { useTheme } from '@/hooks/use-theme';

// Export du type pour utilisation externe
export type BottomSheetModalRef = React.ElementRef<typeof TrueSheet>;

// Contexte pour exposer la fonction close aux enfants
const BottomSheetContext = createContext<{ close: () => void } | null>(null);

/**
 * Hook pour fermer le BottomSheet depuis l'intérieur
 */
export function useBottomSheetClose() {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error('useBottomSheetClose must be used within a BottomSheet');
  }
  return context.close;
}

export interface BottomSheetProps {
  children: ReactNode;
  onDismiss?: () => void;
  onOpen?: () => void;
  enablePanDownToClose?: boolean;
  enableHandlePanningGesture?: boolean;
  backgroundStyle?: object;
  handleIndicatorStyle?: object;
  detents?: SheetDetent[];
  scrollable?: boolean;
}

// Export du type des props sans 'ref' pour utilisation dans forwardRef
export type BottomSheetPropsWithoutRef = Omit<BottomSheetProps, 'ref'>;

/**
 * Hook pour utiliser le BottomSheet
 */
export function useBottomSheet() {
  const bottomSheetRef = useRef<BottomSheetModalRef>(null);

  const present = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const dismiss = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  const close = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  return {
    ref: bottomSheetRef,
    present,
    dismiss,
    close,
  };
}

/**
 * Composant générique BottomSheet
 * Simple wrapper autour de TrueSheet
 */
export const BottomSheet = React.forwardRef<BottomSheetModalRef, BottomSheetPropsWithoutRef>(
  (
    {
      children,
      onDismiss,
      onOpen,
      enablePanDownToClose = true,
      enableHandlePanningGesture = true,
      backgroundStyle,
      handleIndicatorStyle,
      detents = ['auto'],
      scrollable = false,
    },
    ref
  ) => {
    const theme = useTheme();

    // Fonction pour fermer le sheet depuis l'intérieur
    const close = useCallback(() => {
      if (ref && 'current' in ref && ref.current) {
        ref.current.dismiss();
      }
    }, [ref]);



    // Extraire backgroundColor depuis backgroundStyle si fourni
    const backgroundColor = useMemo(() => {
      if (backgroundStyle && typeof backgroundStyle === 'object' && 'backgroundColor' in backgroundStyle) {
        return backgroundStyle.backgroundColor as string;
      }
      return theme.colors.background;
    }, [theme.colors.background, backgroundStyle]);

    // Extraire grabberOptions depuis handleIndicatorStyle si fourni
    const grabberOptions = useMemo(() => {
      if (handleIndicatorStyle && typeof handleIndicatorStyle === 'object') {
        return {
          color: 'backgroundColor' in handleIndicatorStyle 
            ? handleIndicatorStyle.backgroundColor as string
            : theme.colors.borderLight,
          width: 'width' in handleIndicatorStyle 
            ? handleIndicatorStyle.width as number
            : 40,
          height: 'height' in handleIndicatorStyle 
            ? handleIndicatorStyle.height as number
            : 4,
        };
      }
      return {
        color: theme.colors.borderLight,
        width: 40,
        height: 4,
      };
    }, [theme.colors.borderLight, handleIndicatorStyle]);

    // Style par défaut avec padding et marginTop
    // Ajout du paddingBottom pour éviter que le contenu passe sous la barre de navigation
    const defaultStyle = useMemo(() => ({
      padding: theme.spacing.xl,
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md + 10,
    }), [theme.spacing.xl, theme.spacing.md]);

    // Wrapper pour onDidPresent avec logs
    const handleDidPresent = useCallback(() => {
      console.log('[BottomSheet] ===== onDidPresent DÉBUT =====');
      console.log('[BottomSheet] Sheet présenté avec succès');
      if (onOpen) {
        console.log('[BottomSheet] Appel de onOpen callback...');
        try {
          onOpen();
          console.log('[BottomSheet] ✅ onOpen callback appelé avec succès');
        } catch (error) {
          console.error('[BottomSheet] ❌ Erreur dans onOpen callback:', error);
        }
      } else {
        console.log('[BottomSheet] Pas de onOpen callback défini');
      }
      console.log('[BottomSheet] ===== onDidPresent FIN =====');
    }, [onOpen]);

    return (
      <BottomSheetContext.Provider value={{ close }}>
        <TrueSheet
          scrollable={scrollable}
          ref={ref}
          detents={detents}
          onDidDismiss={onDismiss}
          onDidPresent={handleDidPresent}
          dismissible={enablePanDownToClose}
          draggable={enableHandlePanningGesture}
          backgroundColor={backgroundColor}
          grabberOptions={grabberOptions}
          style={defaultStyle}
        >
          {children}
        </TrueSheet>
      </BottomSheetContext.Provider>
    );
  }
);

BottomSheet.displayName = 'BottomSheet';
