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
 * Couleurs par défaut pour le coucher (tons chauds et apaisants)
 */
const DEFAULT_BEDTIME_COLORS = [
  '#FF6B6B', // Rouge corail
  '#FF8E53', // Orange doux
  '#FFA07A', // Saumon
  '#FFB347', // Orange pêche
  '#FFD700', // Or
  '#FFE4B5', // Mocassin
  '#FF69B4', // Rose vif
  '#90EE90', // Vert clair
  '#32CD32', // Vert lime
  '#4169E1', // Bleu royal
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
          const isSelected = color === selectedColor;
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
