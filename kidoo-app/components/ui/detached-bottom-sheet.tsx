/**
 * Composant Bottom Sheet en mode detached (détaché)
 * Basé sur @lodev09/react-native-true-sheet
 * 
 * Simple wrapper autour de TrueSheet avec marges horizontales
 */

import { useMemo, useRef, useCallback, type ReactNode, type ElementRef } from 'react';
import { ViewStyle } from 'react-native';
import { TrueSheet } from '@lodev09/react-native-true-sheet';
import { useTheme } from '@/hooks/use-theme';

// Export du type pour utilisation externe
export type DetachedBottomSheetModalRef = ElementRef<typeof TrueSheet>;

export interface DetachedBottomSheetProps {
  children: ReactNode;
  snapPoints?: (string | number)[];
  onDismiss?: () => void;
  enablePanDownToClose?: boolean;
  enableHandlePanningGesture?: boolean;
  enableDynamicSizing?: boolean;
  keyboardBehavior?: 'extend' | 'fillParent' | 'interactive';
  keyboardBlurBehavior?: 'none' | 'restore';
  backgroundStyle?: object;
  handleIndicatorStyle?: object;
  bottomInset?: number;
  horizontalMargin?: number;
  style?: ViewStyle;
}

/**
 * Hook pour utiliser le DetachedBottomSheet
 */
export function useDetachedBottomSheet() {
  const bottomSheetRef = useRef<DetachedBottomSheetModalRef>(null);

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
 * Composant DetachedBottomSheet
 * Simple wrapper autour de TrueSheet avec marges horizontales
 */
import { forwardRef } from 'react';

export const DetachedBottomSheet = forwardRef<
  DetachedBottomSheetModalRef,
  Omit<DetachedBottomSheetProps, 'ref'>
>(
  (
    {
      children,
      snapPoints = ['50%'],
      onDismiss,
      enablePanDownToClose = true,
      enableHandlePanningGesture = true,
      enableDynamicSizing: _enableDynamicSizing = false,
      keyboardBehavior: _keyboardBehavior = 'interactive',
      keyboardBlurBehavior: _keyboardBlurBehavior = 'restore',
      backgroundStyle,
      handleIndicatorStyle,
      bottomInset: _bottomInset,
      horizontalMargin,
      style,
    },
    ref
  ) => {
    const theme = useTheme();

    // Convertir snapPoints en detents pour TrueSheet
    const detents = useMemo(() => {
      return snapPoints.map((point) => {
        if (typeof point === 'string' && point === 'auto') {
          return 'auto' as const;
        }
        if (typeof point === 'string' && point.endsWith('%')) {
          const percentage = parseFloat(point) / 100;
          return Math.min(1, Math.max(0.1, percentage));
        }
        if (typeof point === 'number') {
          return Math.min(1, Math.max(0.1, point));
        }
        return 0.5;
      });
    }, [snapPoints]);

    // Calculer les marges horizontales par défaut
    const defaultHorizontalMargin = horizontalMargin ?? theme.spacing.xl;

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

    // Style avec marges horizontales, padding et marginTop par défaut pour TrueSheet
    const sheetStyle = useMemo(() => ({
      marginHorizontal: defaultHorizontalMargin,
      padding: theme.spacing.xl,
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      ...style,
    }), [theme.spacing.xl, theme.spacing.md, defaultHorizontalMargin, style]);

    return (
      <TrueSheet
        ref={ref}
        detents={detents}
        onDidDismiss={onDismiss}
        dismissible={enablePanDownToClose}
        draggable={enableHandlePanningGesture}
        backgroundColor={backgroundColor}
        grabberOptions={grabberOptions}
        style={sheetStyle}
      >
        {children}
      </TrueSheet>
    );
  }
);

DetachedBottomSheet.displayName = 'DetachedBottomSheet';
