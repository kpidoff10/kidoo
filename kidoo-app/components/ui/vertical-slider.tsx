/**
 * Slider vertical générique réutilisable
 * Gère les gestes tactiles, les animations et les interactions
 */

import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, PanResponder, Animated } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

const SLIDER_HEIGHT = 300; // Hauteur de la jauge
const THUMB_SIZE = 40; // Taille du curseur
const DEFAULT_DEBOUNCE_DELAY = 300; // Délai de debounce par défaut en ms

export interface VerticalSliderProps {
  /** Valeur actuelle du slider */
  value: number;
  /** Valeur minimale */
  min: number;
  /** Valeur maximale */
  max: number;
  /** Pas d'arrondi (défaut: 1) */
  step?: number;
  /** Callback quand la valeur change */
  onValueChange: (value: number) => void;
  /** Callback quand l'état de drag change */
  onDraggingChange: (isDragging: boolean) => void;
  /** Valeur animée pour la position Y */
  panY: Animated.Value;
  /** Si le slider est en train d'être glissé */
  isDragging?: boolean;
  /** Nom de l'icône pour le thumb (défaut: "circle.fill") */
  thumbIcon?: string;
  /** Valeurs pour les graduations (optionnel) */
  marks?: number[];
  /** Fonction pour convertir une valeur en position Y (optionnel, calculée automatiquement si non fournie) */
  valueToY?: (value: number) => number;
  /** Fonction pour convertir une position Y en valeur (optionnel, calculée automatiquement si non fournie) */
  yToValue?: (y: number) => number;
  /** Callback quand la valeur est définie (commit) - pour envoyer la commande */
  onValueCommit?: (value: number) => void;
  /** Délai de debounce en ms pour onValueCommit (défaut: 300ms) */
  debounceDelay?: number;
  /** Afficher le skeleton de chargement (défaut: false) */
  isLoading?: boolean;
}

// Arrondir une valeur par pas, en s'assurant de respecter les limites min/max
const roundToStep = (value: number, step: number = 1, min: number, max: number) => {
  // Si la valeur est très proche du minimum (tolérance de 1%), utiliser le minimum
  if (value < min + step / 2) {
    return min;
  }
  // Si la valeur est très proche du maximum (tolérance de 1%), utiliser le maximum
  if (value > max - step / 2) {
    return max;
  }
  // Sinon, arrondir normalement
  const rounded = Math.round(value / step) * step;
  // S'assurer que la valeur arrondie ne dépasse pas les limites
  if (rounded < min) return min;
  if (rounded > max) return max;
  return rounded;
};

// Convertir une valeur en position Y (par défaut)
const defaultValueToY = (value: number, min: number, max: number) => {
  const percentage = (value - min) / (max - min);
  return (1 - percentage) * SLIDER_HEIGHT; // Inversé car haut = max
};

// Convertir une position Y en valeur (par défaut)
const defaultYToValue = (y: number, min: number, max: number, step: number = 1) => {
  const clampedY = Math.max(0, Math.min(SLIDER_HEIGHT, y));
  const percentage = 1 - clampedY / SLIDER_HEIGHT; // Inversé car haut = max
  const value = percentage * (max - min) + min;
  const rounded = roundToStep(value, step, min, max);
  return rounded;
};

export function VerticalSlider({
  value,
  min,
  max,
  step = 1,
  onValueChange,
  onDraggingChange,
  panY,
  thumbIcon = 'circle.fill',
  marks,
  valueToY,
  yToValue,
  onValueCommit,
  debounceDelay = DEFAULT_DEBOUNCE_DELAY,
  isLoading = false,
}: VerticalSliderProps) {
  const theme = useTheme();
  const sliderRef = useRef<View>(null);
  const touchAreaRef = useRef<View>(null);
  const startY = useRef(0); // Position Y initiale relative au slider (0-300)
  const startValue = useRef(value);
  const lastSentValue = useRef(value);
  const isDraggingRef = useRef(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  // Utiliser les fonctions fournies ou les fonctions par défaut
  // Utiliser useMemo pour éviter de recréer les fonctions à chaque render
  const valueToYFunc = React.useMemo(
    () => valueToY || ((v: number) => defaultValueToY(v, min, max)),
    [valueToY, min, max]
  );
  const yToValueFunc = React.useMemo(
    () => yToValue || ((y: number) => defaultYToValue(y, min, max, step)),
    [yToValue, min, max, step]
  );

  // Initialiser la position du curseur (seulement si on n'est pas en train de glisser)
  useEffect(() => {
    if (!isDraggingRef.current) {
      const initialY = valueToYFunc(value);
      panY.setValue(initialY);
      startValue.current = value;
      lastSentValue.current = value;
    }
  }, [value, panY, valueToYFunc]);

  // Nettoyer le timer de debounce lors du démontage
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Animation shimmer pour le skeleton
  useEffect(() => {
    if (!isLoading) return;

    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    shimmerAnimation.start();

    return () => {
      shimmerAnimation.stop();
    };
  }, [isLoading, shimmerAnim]);

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true, // Capturer dès le début
      onMoveShouldSetPanResponder: (_evt, gestureState) => {
        // Capturer le geste si c'est principalement vertical (pour le slider)
        const { dy, dx } = gestureState;
        const absDy = Math.abs(dy);
        const absDx = Math.abs(dx);
        
        // Si le mouvement est principalement vertical, capturer le geste (seuil très bas pour plus de réactivité)
        // Accepter même les mouvements légèrement horizontaux si le mouvement vertical est significatif
        return absDy > 2 || (absDy > absDx && absDy > 1);
      },
      onMoveShouldSetPanResponderCapture: (_evt, gestureState) => {
        // Capturer aussi lors du mouvement si principalement vertical
        const { dy, dx } = gestureState;
        const absDy = Math.abs(dy);
        const absDx = Math.abs(dx);
        return absDy > 2 || (absDy > absDx && absDy > 1);
      },
      onPanResponderTerminationRequest: () => {
        // Refuser la terminaison pendant le drag
        return false;
      },
      onPanResponderGrant: (evt) => {
        isDraggingRef.current = true;
        onDraggingChange(true);
        
        // Annuler tout debounce en cours
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
          debounceTimerRef.current = null;
        }
        
        // Obtenir la position Y initiale relative au slider (une seule mesure)
        touchAreaRef.current?.measure((_x, _y, _width, _height, _pageX, pageY) => {
          const touchY = evt.nativeEvent.pageY - pageY;
          // Ajuster pour le padding vertical (20px en haut)
          const adjustedY = touchY - 20;
          // Clamper entre 0 et SLIDER_HEIGHT
          const initialY = Math.max(0, Math.min(SLIDER_HEIGHT, adjustedY));
          
          // Calculer la valeur initiale depuis la position du touch
          const initialValue = yToValueFunc(initialY);
          const clampedInitialValue = Math.max(min, Math.min(max, initialValue));
          
          // Stocker la position Y initiale relative au slider (0-300)
          startY.current = initialY;
          startValue.current = clampedInitialValue;
          
          // Mettre à jour immédiatement
          onValueChange(clampedInitialValue);
          panY.setValue(initialY);
        });
      },
      onPanResponderMove: (_evt, gestureState) => {
        // Calculer la nouvelle position Y directement depuis la position initiale et le delta
        // gestureState.dy > 0 quand on glisse vers le bas (augmente Y dans le slider)
        const currentY = startY.current + gestureState.dy;
        const clampedY = Math.max(0, Math.min(SLIDER_HEIGHT, currentY));
        
        // Calculer la valeur depuis la position Y
        const newValue = yToValueFunc(clampedY);
        const clampedValue = Math.max(min, Math.min(max, newValue));
        
        // Mettre à jour la position du curseur et la valeur
        panY.setValue(clampedY);
        onValueChange(clampedValue);
        
        // Debounce pour envoyer la commande pendant le mouvement (seulement si valeur change)
        if (clampedValue !== lastSentValue.current && onValueCommit) {
          lastSentValue.current = clampedValue;
          
          // Annuler le timer précédent s'il existe
          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
          }
          
          // Programmer l'envoi avec debounce
          debounceTimerRef.current = setTimeout(() => {
            if (onValueCommit) {
              onValueCommit(clampedValue);
            }
            debounceTimerRef.current = null;
          }, debounceDelay);
        }
      },
      onPanResponderRelease: (_evt, gestureState) => {
        isDraggingRef.current = false;
        onDraggingChange(false);
        
        // Annuler tout debounce en cours lors du relâchement
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
          debounceTimerRef.current = null;
        }
        
        // Calculer la position finale directement depuis la position initiale et le delta
        const finalY = startY.current + gestureState.dy;
        const clampedY = Math.max(0, Math.min(SLIDER_HEIGHT, finalY));
        
        // Calculer la valeur finale depuis la position Y
        const finalValue = yToValueFunc(clampedY);
        const clampedValue = Math.max(min, Math.min(max, finalValue));
        
        // Mettre à jour l'état et la position du curseur
        onValueChange(clampedValue);
        panY.setValue(clampedY);
        startValue.current = clampedValue;
        
        // Toujours envoyer lors du relâchement pour confirmer la valeur finale choisie
        if (onValueCommit) {
          lastSentValue.current = clampedValue;
          // Lors du relâchement, envoyer immédiatement la valeur finale
          onValueCommit(clampedValue);
        }
      },
    })
  ).current;

  // Styles dynamiques
  const thumbPosition = panY.interpolate({
    inputRange: [0, SLIDER_HEIGHT],
    outputRange: [0, SLIDER_HEIGHT - THUMB_SIZE],
    extrapolate: 'clamp',
  });

  const trackFillHeight = panY.interpolate({
    inputRange: [0, SLIDER_HEIGHT],
    outputRange: [SLIDER_HEIGHT, 0],
    extrapolate: 'clamp',
  });

  // Afficher le skeleton si isLoading est true
  if (isLoading) {
    return (
      <View style={styles.sliderContainer}>
        {/* Zone de capture pour aligner avec le slider réel */}
        <View style={styles.touchArea}>
          {/* Barre verticale du skeleton */}
          <View
            style={[
              styles.sliderTrack,
              {
                height: SLIDER_HEIGHT,
                backgroundColor: theme.colors.surfaceSecondary,
              },
            ]}
          >
            {/* Effet shimmer animé */}
            <Animated.View
              style={[
                styles.shimmer,
                {
                  opacity: shimmerOpacity,
                  backgroundColor: theme.colors.tint,
                },
              ]}
            />

            {/* Marqueurs du skeleton positionnés comme les marqueurs réels */}
            {marks?.map((markValue) => {
              const y = valueToYFunc(markValue);
              return (
                <View
                  key={markValue}
                  style={[
                    styles.mark,
                    {
                      top: y - 1,
                      backgroundColor: theme.colors.borderLight,
                    },
                  ]}
                />
              );
            })}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.sliderContainer}>
      {/* Zone de capture invisible plus large pour faciliter l'interaction */}
      <View
        ref={touchAreaRef}
        style={styles.touchArea}
        {...panResponder.panHandlers}
      >
        <View
          ref={sliderRef}
          style={[
            styles.sliderTrack,
            {
              height: SLIDER_HEIGHT,
              backgroundColor: theme.colors.surfaceSecondary,
            },
          ]}
        >
        {/* Piste remplie (partie active) */}
        <Animated.View
          style={[
            styles.sliderFill,
            {
              height: trackFillHeight,
              backgroundColor: theme.colors.tint,
            },
          ]}
        />

        {/* Curseur */}
        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [{ translateY: thumbPosition }],
              backgroundColor: theme.colors.tint,
              borderColor: theme.colors.background,
            },
          ]}
        >
          <IconSymbol
            name={thumbIcon as any}
            size={20}
            color={theme.colors.background}
          />
        </Animated.View>

        {/* Graduations */}
        {marks?.map((markValue) => {
          const y = valueToYFunc(markValue);
          return (
            <View
              key={markValue}
              style={[
                styles.mark,
                {
                  top: y - 1,
                  backgroundColor: theme.colors.text,
                },
              ]}
            />
          );
        })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sliderContainer: {
    alignItems: 'center',
    width: '100%',
  },
  touchArea: {
    width: 250, // Zone de capture très large pour faciliter le touch (environ 4x la largeur du slider)
    height: SLIDER_HEIGHT + 40, // Ajouter un peu de hauteur pour faciliter le touch en haut/bas
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20, // Padding vertical pour faciliter le touch
    // Pas de backgroundColor pour rester invisible
  },
  sliderTrack: {
    width: 60,
    borderRadius: 30,
    position: 'relative',
    overflow: 'hidden', // Permet au borderRadius de couper automatiquement le fill
  },
  sliderFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // Le borderRadius du parent (sliderTrack) coupe automatiquement le fill
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    left: (60 - THUMB_SIZE) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  mark: {
    position: 'absolute',
    width: 4,
    height: 2,
    left: -8,
    borderRadius: 1,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 30,
  },
});
