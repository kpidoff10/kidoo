/**
 * Wrapper thématique pour TrueSheet
 * Applique automatiquement les styles par défaut du thème (padding, marginTop, backgroundColor, grabberOptions)
 */

import React, { useMemo, ReactNode } from 'react';
import { ViewStyle } from 'react-native';
import { TrueSheet } from '@lodev09/react-native-true-sheet';
import { useTheme } from '@/hooks/use-theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type ThemedTrueSheetRef = React.ElementRef<typeof TrueSheet>;

export interface ThemedTrueSheetProps {
  children: ReactNode;
  detents?: ('auto' | number)[];
  onDidDismiss?: () => void;
  onDidPresent?: () => void;
  dismissible?: boolean;
  draggable?: boolean;
  backgroundColor?: string;
  dimmed?: boolean;
  grabberOptions?: {
    color?: string;
    width?: number;
    height?: number;
  };
  style?: ViewStyle;
  insetAdjustment?: 'automatic' | 'never';
}

/**
 * Wrapper thématique pour TrueSheet
 * Applique automatiquement les styles par défaut du thème
 */
export const ThemedTrueSheet = React.forwardRef<ThemedTrueSheetRef, ThemedTrueSheetProps>(
  (
    {
      children,
      detents = ['auto'],
      onDidDismiss,
      onDidPresent,
      dismissible = true,
      draggable = true,
      backgroundColor: customBackgroundColor,
      dimmed = true,
      grabberOptions: customGrabberOptions,
      style: customStyle,
      insetAdjustment = 'automatic',
    },
    ref
  ) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();

    // Style par défaut avec padding et marginTop
    const defaultStyle = useMemo(() => ({
      padding: theme.spacing.xl,
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.xl,
      paddingBottom: insets.bottom,
    }), [theme.spacing.xl, theme.spacing.md, insets.bottom]);

    // Fusionner les styles : défaut + personnalisé
    const mergedStyle = useMemo(() => ({
      ...defaultStyle,
      ...customStyle,
    }), [defaultStyle, customStyle]);

    // backgroundColor par défaut depuis le thème
    const backgroundColor = useMemo(() => {
      return customBackgroundColor ?? theme.colors.background;
    }, [theme.colors.background, customBackgroundColor]);

    // grabberOptions par défaut depuis le thème
    const grabberOptions = useMemo(() => {
      if (customGrabberOptions) {
        return {
          color: customGrabberOptions.color ?? theme.colors.borderLight,
          width: customGrabberOptions.width ?? 40,
          height: customGrabberOptions.height ?? 4,
        };
      }
      return {
        color: theme.colors.borderLight,
        width: 40,
        height: 4,
      };
    }, [theme.colors.borderLight, customGrabberOptions]);

    return (
      <TrueSheet
        ref={ref}
        detents={detents}
        onDidDismiss={onDidDismiss}
        onDidPresent={onDidPresent}
        dismissible={dismissible}
        draggable={draggable}
        backgroundColor={backgroundColor}
        dimmed={dimmed}
        grabberOptions={grabberOptions}
        style={mergedStyle}
        insetAdjustment={insetAdjustment}
      >
        {children}
      </TrueSheet>
    );
  }
);

ThemedTrueSheet.displayName = 'ThemedTrueSheet';
