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
}: VerticalSliderProps) {
  const theme = useTheme();
  const sliderRef = useRef<View>(null);
  const touchAreaRef = useRef<View>(null);
  const startY = useRef(0);
  const startValue = useRef(value);
  const clickedValue = useRef<number | null>(null);
  const lastSentValue = useRef(value);
  const isDraggingRef = useRef(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_evt, gestureState) => {
        // Capturer le geste si c'est principalement vertical (pour le slider)
        const { dy, dx } = gestureState;
        const absDy = Math.abs(dy);
        const absDx = Math.abs(dx);
        
        // Si le mouvement est principalement vertical, capturer le geste
        return absDy > absDx && absDy > 5;
      },
      onPanResponderTerminationRequest: () => {
        // Refuser la terminaison pendant le drag
        return false;
      },
      onPanResponderGrant: (evt) => {
        isDraggingRef.current = true;
        onDraggingChange(true);
        startY.current = evt.nativeEvent.pageY;
        clickedValue.current = null; // Réinitialiser
        
        // Obtenir la position Y relative à la zone de capture pour gérer les clics
        touchAreaRef.current?.measure((_x, _y, _width, _height, _pageX, pageY) => {
          const touchY = evt.nativeEvent.pageY - pageY;
          const clampedY = Math.max(0, Math.min(SLIDER_HEIGHT, touchY));
          
          // Calculer la valeur depuis la position du clic
          const newValue = yToValueFunc(clampedY);
          const clampedValue = Math.max(min, Math.min(max, newValue));
          
          // Stocker la valeur du clic
          clickedValue.current = clampedValue;
          startValue.current = clampedValue;
          
          // Mettre à jour immédiatement
          onValueChange(clampedValue);
          panY.setValue(clampedY);
        });
      },
      onPanResponderMove: (_evt, gestureState) => {
        const deltaY = gestureState.dy;
        const currentY = valueToYFunc(startValue.current) + deltaY;
        const clampedY = Math.max(0, Math.min(SLIDER_HEIGHT, currentY));
        panY.setValue(clampedY);
        
        const newValue = yToValueFunc(clampedY);
        // S'assurer que la valeur est dans la plage valide
        const clampedValue = Math.max(min, Math.min(max, newValue));
        onValueChange(clampedValue);
        
        // Debounce pour envoyer la commande seulement si la valeur a changé
        if (clampedValue !== lastSentValue.current && onValueCommit) {
          lastSentValue.current = clampedValue;
          
          // Annuler le timer précédent s'il existe
          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
          }
          
          // Programmer l'envoi avec debounce
          debounceTimerRef.current = setTimeout(() => {
            onValueCommit(clampedValue);
            debounceTimerRef.current = null;
          }, debounceDelay);
        }
      },
      onPanResponderRelease: (_evt, gestureState) => {
        isDraggingRef.current = false;
        onDraggingChange(false);
        
        // Si c'était un simple clic (pas de mouvement significatif), utiliser la valeur déjà calculée dans Grant
        const absDy = Math.abs(gestureState.dy);
        
        // Annuler tout debounce en cours lors du relâchement
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
          debounceTimerRef.current = null;
        }
        
        if (absDy < 10) {
          // Simple clic : utiliser la valeur stockée dans clickedValue
          if (clickedValue.current !== null) {
            const finalValue = clickedValue.current;
            onValueChange(finalValue);
            // Envoyer seulement si la valeur est différente de la dernière envoyée
            if (finalValue !== lastSentValue.current && onValueCommit) {
              lastSentValue.current = finalValue;
              // Pour un clic, envoyer immédiatement (pas de debounce)
              onValueCommit(finalValue);
            }
          }
          return;
        }
        
        // Sinon, c'était un glissement : calculer depuis le delta
        const deltaY = gestureState.dy;
        const finalY = valueToYFunc(startValue.current) + deltaY;
        const clampedY = Math.max(0, Math.min(SLIDER_HEIGHT, finalY));
        
        // Calculer la valeur finale depuis la position Y
        const finalValue = yToValueFunc(clampedY);
        const clampedValue = Math.max(min, Math.min(max, finalValue));
        
        // Mettre à jour l'état et la position du curseur
        onValueChange(clampedValue);
        panY.setValue(clampedY);
        
        // Envoyer seulement si la valeur est différente de la dernière envoyée
        if (clampedValue !== lastSentValue.current && onValueCommit) {
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
    width: 120, // Zone de capture plus large (2x la largeur du slider)
    height: SLIDER_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
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
});
