/**
 * ColorPickerSection Component
 * Section avec le ColorPicker
 */

import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ColorPicker } from '@/components/ui';
import { Controller, Control, useWatch } from 'react-hook-form';

interface ColorPickerSectionProps {
  control: Control<{
    color: string;
    brightness: number;
  }>;
}

// Couleurs par défaut pour le réveil (jaune doux par défaut)
const DEFAULT_WAKEUP_COLORS = [
  '#FFC864', // Jaune doux (couleur par défaut)
  '#FFD700', // Or
  '#FFA500', // Orange
  '#FF8C00', // Orange foncé
  '#FF6B6B', // Rouge corail
  '#FF1493', // Rose profond
  '#FF00FF', // Magenta
  '#8000FF', // Violet
  '#00FF00', // Vert
  '#FFFFFF', // Blanc
];

export function ColorPickerSection({ control }: ColorPickerSectionProps) {
  const { t } = useTranslation();
  const selectedColor = useWatch({ control, name: 'color' });

  // Ajouter la couleur sélectionnée à la liste si elle n'y est pas déjà
  const colors = useMemo(() => {
    if (!selectedColor) {
      return DEFAULT_WAKEUP_COLORS;
    }
    
    // Normaliser la couleur sélectionnée (majuscules pour cohérence)
    const normalizedSelected = selectedColor.toUpperCase();
    
    // Vérifier si la couleur est déjà dans la liste (comparaison insensible à la casse)
    const colorExists = DEFAULT_WAKEUP_COLORS.some(
      color => color.toUpperCase() === normalizedSelected
    );
    
    if (colorExists) {
      return DEFAULT_WAKEUP_COLORS;
    }
    
    // Ajouter la couleur normalisée au début de la liste pour qu'elle soit visible
    return [normalizedSelected, ...DEFAULT_WAKEUP_COLORS];
  }, [selectedColor]);

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="color"
        render={({ field: { value, onChange } }) => {
          // Normaliser la valeur pour la comparaison (majuscules)
          const normalizedValue = value ? value.toUpperCase() : '';
          
          return (
            <ColorPicker
              selectedColor={normalizedValue}
              onColorChange={(color) => {
                // Normaliser la couleur sélectionnée avant de la sauvegarder
                onChange(color.toUpperCase());
              }}
              colors={colors}
              label={t('kidoos.dream.wakeup.selectColor', { 
                defaultValue: 'Sélectionnez la couleur' 
              })}
            />
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
  },
});
