/**
 * Menu d'actions flottant avec boutons multiples
 * Composant réutilisable utilisant React Native Reanimated
 * Basé sur: https://docs.swmansion.com/react-native-reanimated/examples/floatingactionbutton/
 */

import { useCallback, useRef } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/use-theme';
import { IconSymbol } from './icon-symbol';

export interface FloatingActionMenuItem {
  icon: string;
  onPress: () => void;
  label?: string;
}

export interface FloatingActionMenuProps {
  /** Actions secondaires à afficher */
  actions: FloatingActionMenuItem[];
  /** Position en bas (par défaut: insets.bottom + spacing.md) */
  bottom?: number;
  /** Position à droite (par défaut: spacing.md) */
  right?: number;
  /** Taille des boutons (par défaut: 56) */
  buttonSize?: number;
  /** Espacement entre les boutons (par défaut: 70) */
  buttonSpacing?: number;
  /** Durée de l'animation en ms (par défaut: 200) */
  animationDuration?: number;
}

const BUTTON_SIZE = 56;
const BUTTON_SPACING = 70;
const ANIMATION_DURATION = 200;

export function FloatingActionMenu({
  actions,
  bottom,
  right,
  buttonSize = BUTTON_SIZE,
  buttonSpacing = BUTTON_SPACING,
  animationDuration = ANIMATION_DURATION,
}: FloatingActionMenuProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const isExpanded = useSharedValue(false);
  const isActionInProgressRef = useRef(false);

  const toggleMenu = useCallback(() => {
    isExpanded.value = !isExpanded.value;
    // isExpanded est un SharedValue stable, pas besoin de le mettre dans les dépendances
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleActionPress = useCallback(
    (action: FloatingActionMenuItem) => {
      // Empêcher les doubles clics
      if (isActionInProgressRef.current) {
        return;
      }

      isActionInProgressRef.current = true;

      // Exécuter l'action
      action.onPress();

      // Fermer le menu
      isExpanded.value = false;

      // Réinitialiser le flag
      setTimeout(() => {
        isActionInProgressRef.current = false;
      }, 500);
      // isExpanded est un SharedValue stable, pas besoin de le mettre dans les dépendances
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Style pour le bouton principal (rotation du +)
  const plusIconStyle = useAnimatedStyle(() => {
    const rotateValue = isExpanded.value ? '45deg' : '0deg';
    return {
      transform: [{ rotate: withTiming(rotateValue, { duration: animationDuration }) }],
    };
  });

  // Styles pour les boutons secondaires - créer toujours les 5 styles (max 5 actions)
  // Animer aussi l'ombre pour éviter qu'elle s'entasse
  const buttonStyle0 = useAnimatedStyle(() => {
    const translateY = isExpanded.value ? -buttonSpacing * 1 : 0;
    const opacity = isExpanded.value ? 1 : 0;
    const shadowOpacity = isExpanded.value ? 0.3 : 0;
    const elevation = isExpanded.value ? 8 : 0;
    return {
      transform: [{ translateY: withTiming(translateY, { duration: animationDuration }) }],
      opacity: withTiming(opacity, { duration: animationDuration }),
      shadowOpacity: withTiming(shadowOpacity, { duration: animationDuration }),
      elevation: withTiming(elevation, { duration: animationDuration }),
    };
  });

  const buttonStyle1 = useAnimatedStyle(() => {
    const translateY = isExpanded.value ? -buttonSpacing * 2 : 0;
    const opacity = isExpanded.value ? 1 : 0;
    const shadowOpacity = isExpanded.value ? 0.3 : 0;
    const elevation = isExpanded.value ? 8 : 0;
    return {
      transform: [{ translateY: withTiming(translateY, { duration: animationDuration }) }],
      opacity: withTiming(opacity, { duration: animationDuration }),
      shadowOpacity: withTiming(shadowOpacity, { duration: animationDuration }),
      elevation: withTiming(elevation, { duration: animationDuration }),
    };
  });

  const buttonStyle2 = useAnimatedStyle(() => {
    const translateY = isExpanded.value ? -buttonSpacing * 3 : 0;
    const opacity = isExpanded.value ? 1 : 0;
    const shadowOpacity = isExpanded.value ? 0.3 : 0;
    const elevation = isExpanded.value ? 8 : 0;
    return {
      transform: [{ translateY: withTiming(translateY, { duration: animationDuration }) }],
      opacity: withTiming(opacity, { duration: animationDuration }),
      shadowOpacity: withTiming(shadowOpacity, { duration: animationDuration }),
      elevation: withTiming(elevation, { duration: animationDuration }),
    };
  });

  const buttonStyle3 = useAnimatedStyle(() => {
    const translateY = isExpanded.value ? -buttonSpacing * 4 : 0;
    const opacity = isExpanded.value ? 1 : 0;
    const shadowOpacity = isExpanded.value ? 0.3 : 0;
    const elevation = isExpanded.value ? 8 : 0;
    return {
      transform: [{ translateY: withTiming(translateY, { duration: animationDuration }) }],
      opacity: withTiming(opacity, { duration: animationDuration }),
      shadowOpacity: withTiming(shadowOpacity, { duration: animationDuration }),
      elevation: withTiming(elevation, { duration: animationDuration }),
    };
  });

  const buttonStyle4 = useAnimatedStyle(() => {
    const translateY = isExpanded.value ? -buttonSpacing * 5 : 0;
    const opacity = isExpanded.value ? 1 : 0;
    const shadowOpacity = isExpanded.value ? 0.3 : 0;
    const elevation = isExpanded.value ? 8 : 0;
    return {
      transform: [{ translateY: withTiming(translateY, { duration: animationDuration }) }],
      opacity: withTiming(opacity, { duration: animationDuration }),
      shadowOpacity: withTiming(shadowOpacity, { duration: animationDuration }),
      elevation: withTiming(elevation, { duration: animationDuration }),
    };
  });

  const secondaryButtonStyles = [
    buttonStyle0,
    buttonStyle1,
    buttonStyle2,
    buttonStyle3,
    buttonStyle4,
  ];

  const bottomPosition = bottom !== undefined ? bottom : insets.bottom + theme.spacing.md;
  const rightPosition = right !== undefined ? right : theme.spacing.md;

  return (
    <View
      style={[
        styles.container,
        {
          right: rightPosition,
          bottom: bottomPosition,
        },
      ]}
    >
      {/* Boutons secondaires - limiter à 5 actions */}
      {actions.slice(0, 5).map((action, index) => {
        const buttonStyle = secondaryButtonStyles[index];
        return (
          <Animated.View
            key={index}
            style={[
              buttonStyle,
              {
                position: 'absolute',
                width: buttonSize,
                height: buttonSize,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowRadius: 8,
              },
            ]}
          >
            <Pressable
              onPress={() => handleActionPress(action)}
              style={[
                styles.buttonContent,
                {
                  width: buttonSize,
                  height: buttonSize,
                  borderRadius: buttonSize / 2,
                  backgroundColor: theme.colors.tint,
                },
              ]}
            >
              <IconSymbol name={action.icon as any} size={24} color={theme.colors.background} />
            </Pressable>
          </Animated.View>
        );
      })}

      {/* Bouton principal */}
      <Pressable
        onPress={toggleMenu}
        style={[
          styles.mainButton,
          {
            width: buttonSize,
            height: buttonSize,
            borderRadius: buttonSize / 2,
            backgroundColor: theme.colors.tint,
            ...theme.shadows.lg,
          },
        ]}
      >
        <Animated.View style={plusIconStyle}>
          <IconSymbol name="plus" size={28} color={theme.colors.background} />
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
  },
  mainButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
