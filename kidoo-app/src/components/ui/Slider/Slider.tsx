/**
 * Slider Component
 * Composant générique pour un slider/jauge de valeur
 */

import React, { useRef, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme';
import { Text } from '../Typography';

export interface SliderProps {
  /**
   * Valeur actuelle (min-max)
   */
  value: number;
  
  /**
   * Valeur minimale
   */
  minimumValue?: number;
  
  /**
   * Valeur maximale
   */
  maximumValue?: number;
  
  /**
   * Pas d'incrémentation
   */
  step?: number;
  
  /**
   * Callback appelé quand la valeur change
   */
  onValueChange: (value: number) => void;
  
  /**
   * Label optionnel
   */
  label?: string;
  
  /**
   * Format de la valeur affichée (optionnel)
   */
  formatValue?: (value: number) => string;
  
  /**
   * Style personnalisé pour le conteneur
   */
  containerStyle?: View['props']['style'];
}

export function Slider({ 
  value, 
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  onValueChange,
  label,
  formatValue,
  containerStyle 
}: SliderProps) {
  const { colors, spacing, fonts } = useTheme();
  const styles = createStyles(spacing);
  const trackRef = useRef<View>(null);
  const trackWidthRef = useRef<number>(0);

  const displayValue = formatValue ? formatValue(value) : value.toString();
  const percentage = ((value - minimumValue) / (maximumValue - minimumValue)) * 100;

  // Calculer la valeur à partir d'une position X sur la barre
  const getValueFromPosition = useCallback((x: number) => {
    const trackWidth = trackWidthRef.current;
    if (!trackWidth) return value;

    // Clamp la position entre 0 et la largeur de la barre
    const clampedX = Math.max(0, Math.min(x, trackWidth));
    const percentage = (clampedX / trackWidth) * 100;
    const rawValue = minimumValue + (percentage / 100) * (maximumValue - minimumValue);
    
    // Appliquer le step
    const steppedValue = Math.round(rawValue / step) * step;
    
    // Clamp entre min et max
    return Math.max(minimumValue, Math.min(maximumValue, steppedValue));
  }, [value, minimumValue, maximumValue, step]);

  // PanResponder pour gérer les gestes de glissement et les clics
  const trackPageXRef = useRef<number>(0);
  
  const panResponder = useRef(
    PanResponder.create({
      // Capturer le geste AVANT qu'il n'atteigne le BottomSheet
      // Cela empêche le BottomSheet de réduire quand on glisse sur le Slider
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        // Mesurer la position et la largeur de la barre
        trackRef.current?.measure((x, y, width, height, pageX, pageY) => {
          if (width <= 0) return; // Largeur invalide, ne rien faire
          
          trackWidthRef.current = width;
          trackPageXRef.current = pageX;
          
          // Utiliser la position absolue du geste plutôt que locationX
          // car locationX peut être incorrect si on touche le thumb qui dépasse de la barre
          const absoluteX = evt.nativeEvent.pageX ?? evt.nativeEvent.locationX + pageX;
          const relativeX = Math.max(0, Math.min(absoluteX - pageX, width));
          const newValue = getValueFromPosition(relativeX);
          
          // Ne mettre à jour que si la valeur est valide, différente de la valeur actuelle,
          // et pas un saut suspect vers 0 (sauf si la valeur actuelle est déjà proche de 0)
          const isValidValue = newValue >= minimumValue && newValue <= maximumValue;
          const isDifferent = newValue !== value;
          const isNotSuspiciousJump = value <= 5 || Math.abs(newValue - value) < 50;
          
          if (isValidValue && isDifferent && isNotSuspiciousJump) {
            onValueChange(newValue);
          }
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        // Calculer la position relative à la barre pendant le glissement
        if (trackWidthRef.current > 0 && trackPageXRef.current > 0) {
          const absoluteX = gestureState.moveX;
          const relativeX = absoluteX - trackPageXRef.current;
          const newValue = getValueFromPosition(relativeX);
          if (newValue !== value) {
            onValueChange(newValue);
          }
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        // Finaliser la valeur à la fin du geste
        if (trackWidthRef.current > 0 && trackPageXRef.current > 0) {
          const absoluteX = gestureState.moveX;
          const relativeX = absoluteX - trackPageXRef.current;
          const newValue = getValueFromPosition(relativeX);
          onValueChange(newValue);
        }
      },
      // Empêcher le BottomSheet de terminer notre geste
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  const handleDecrement = () => {
    const newValue = Math.max(minimumValue, value - step);
    onValueChange(newValue);
  };

  const handleIncrement = () => {
    const newValue = Math.min(maximumValue, value + step);
    onValueChange(newValue);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelRow}>
          <Text
            style={[
              styles.label,
              {
                color: colors.text,
                fontSize: fonts.size.sm,
                fontWeight: fonts.weight.medium,
              },
            ]}
          >
            {label}
          </Text>
          <Text
            style={[
              styles.value,
              {
                color: colors.primary,
                fontSize: fonts.size.base,
                fontWeight: fonts.weight.bold,
              },
            ]}
          >
            {displayValue}
          </Text>
        </View>
      )}

      <View style={styles.sliderContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={handleDecrement}
          activeOpacity={0.7}
          disabled={value <= minimumValue}
        >
          <Ionicons 
            name="remove" 
            size={20} 
            color={value <= minimumValue ? colors.textTertiary : colors.primary} 
          />
        </TouchableOpacity>

        <View
          ref={trackRef}
          style={[styles.track, { backgroundColor: colors.border }]}
          onLayout={(evt) => {
            trackWidthRef.current = evt.nativeEvent.layout.width;
          }}
          {...panResponder.panHandlers}
        >
          <View
            style={[
              styles.fill,
              {
                width: `${percentage}%`,
                backgroundColor: colors.primary,
              },
            ]}
          />
          <View
            style={[
              styles.thumb,
              {
                left: `${percentage}%`,
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={handleIncrement}
          activeOpacity={0.7}
          disabled={value >= maximumValue}
        >
          <Ionicons 
            name="add" 
            size={20} 
            color={value >= maximumValue ? colors.textTertiary : colors.primary} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (spacing: any) => StyleSheet.create({
  container: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3] || 12,
  },
  label: {},
  value: {},
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  track: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    position: 'relative',
    overflow: 'visible',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  thumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginLeft: -10,
    marginTop: -7,
  },
});
