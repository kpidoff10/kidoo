/**
 * Composant générique Bottom Sheet réutilisable
 * Basé sur @lodev09/react-native-true-sheet
 * 
 * Simple wrapper autour de TrueSheet pour maintenir la compatibilité avec l'ancienne API
 */

import React, { useMemo, useRef, useCallback, ReactNode } from 'react';
import { SheetDetent, TrueSheet } from '@lodev09/react-native-true-sheet';
import { useTheme } from '@/hooks/use-theme';

// Export du type pour utilisation externe
export type BottomSheetModalRef = React.ElementRef<typeof TrueSheet>;

export interface BottomSheetProps {
  children: ReactNode;
  onDismiss?: () => void;
  enablePanDownToClose?: boolean;
  enableHandlePanningGesture?: boolean;
  backgroundStyle?: object;
  handleIndicatorStyle?: object;
  detents?: SheetDetent[];
  scrollable?: boolean;
}

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
export const BottomSheet = React.forwardRef<BottomSheetModalRef, Omit<BottomSheetProps, 'ref'>>(
  (
    {
      children,
      onDismiss,
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
      marginTop: theme.spacing.md,
    }), [theme.spacing.xl, theme.spacing.md]);

    return (
      <TrueSheet
        scrollable={scrollable}
        ref={ref}
        detents={detents}
        onDidDismiss={onDismiss}
        dismissible={enablePanDownToClose}
        draggable={enableHandlePanningGesture}
        backgroundColor={backgroundColor}
        grabberOptions={grabberOptions}
        style={defaultStyle}
      >
        {children}
      </TrueSheet>
    );
  }
);

BottomSheet.displayName = 'BottomSheet';
