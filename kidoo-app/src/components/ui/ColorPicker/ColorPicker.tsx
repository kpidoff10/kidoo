/**
 * ColorPicker Component
 * Composant générique pour sélectionner une couleur parmi plusieurs options
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme';
import { Text } from '../Typography/Text';

export interface ColorPickerProps {
  /**
   * Couleur sélectionnée (hex code)
   */
  selectedColor: string;
  
  /**
   * Callback appelé quand la couleur change
   */
  onColorChange: (color: string) => void;
  
  /**
   * Liste des couleurs disponibles (hex codes)
   * Par défaut : 10 couleurs prédéfinies
   */
  colors?: string[];
  
  /**
   * Label optionnel
   */
  label?: string;
  
  /**
   * Style personnalisé pour le conteneur
   */
  containerStyle?: View['props']['style'];
}

/**
 * Couleurs par défaut pour le coucher (couleurs saturées à 100% pour des couleurs "profondes")
 * Chaque couleur est saturée à 100% : rouge = 100% rouge, bleu = 100% bleu, etc.
 * Couleurs espacées pour éviter les doublons visuels
 */
const DEFAULT_BEDTIME_COLORS = [
  '#FF0000', // Rouge pur (100% rouge) - REQUIS
  '#FF8C00', // Orange foncé (100% orange)
  '#FFFF00', // Jaune pur (100% jaune)
  '#00FF00', // Vert pur (100% vert)
  '#00FFFF', // Cyan pur (100% cyan)
  '#0000FF', // Bleu pur (100% bleu) - REQUIS
  '#8000FF', // Violet pur (100% violet)
  '#FF00FF', // Magenta pur (100% magenta)
  '#FF1493', // Rose profond (100% saturé)
  '#FFFFFF', // Blanc - REQUIS
];

export function ColorPicker({ 
  selectedColor, 
  onColorChange, 
  colors = DEFAULT_BEDTIME_COLORS,
  label,
  containerStyle 
}: ColorPickerProps) {
  const { colors: themeColors, spacing, fonts, borderRadius } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: themeColors.text,
              fontSize: fonts.size.sm,
              fontWeight: fonts.weight.medium,
              marginBottom: spacing[4],
            },
          ]}
        >
          {label}
        </Text>
      )}

      <View style={styles.colorsContainer}>
        {colors.map((color, index) => {
          // Normaliser les couleurs pour la comparaison (majuscules)
          const normalizedColor = color.toUpperCase();
          const normalizedSelected = selectedColor?.toUpperCase() || '';
          const isSelected = normalizedColor === normalizedSelected;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.colorItem,
                {
                  backgroundColor: color,
                  borderColor: isSelected ? themeColors.primary : themeColors.border,
                  borderWidth: isSelected ? 3 : 2,
                  borderRadius: borderRadius.full,
                },
              ]}
              onPress={() => onColorChange(color)}
              activeOpacity={0.7}
            >
              {isSelected && (
                <View style={styles.checkmarkContainer}>
                  <Ionicons name="checkmark" size={20} color={themeColors.textInverse} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  label: {
    textAlign: 'center',
  },
  colorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  colorItem: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  checkmarkContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 24,
  },
});
