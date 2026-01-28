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
    nightlightAllNight: boolean;
  }>;
}

// Couleurs par défaut pour le coucher
const DEFAULT_BEDTIME_COLORS = [
  '#FF0000', // Rouge pur
  '#FF8C00', // Orange foncé
  '#FFFF00', // Jaune pur
  '#00FF00', // Vert pur
  '#00FFFF', // Cyan pur
  '#0000FF', // Bleu pur
  '#8000FF', // Violet pur
  '#FF00FF', // Magenta pur
  '#FF1493', // Rose profond
  '#FFFFFF', // Blanc
];

export function ColorPickerSection({ control }: ColorPickerSectionProps) {
  const { t } = useTranslation();
  const selectedColor = useWatch({ control, name: 'color' });

  // Ajouter la couleur sélectionnée à la liste si elle n'y est pas déjà
  const colors = useMemo(() => {
    if (!selectedColor) {
      return DEFAULT_BEDTIME_COLORS;
    }
    
    // Normaliser la couleur sélectionnée (majuscules pour cohérence)
    const normalizedSelected = selectedColor.toUpperCase();
    
    // Vérifier si la couleur est déjà dans la liste (comparaison insensible à la casse)
    const colorExists = DEFAULT_BEDTIME_COLORS.some(
      color => color.toUpperCase() === normalizedSelected
    );
    
    if (colorExists) {
      return DEFAULT_BEDTIME_COLORS;
    }
    
    // Ajouter la couleur normalisée au début de la liste pour qu'elle soit visible
    return [normalizedSelected, ...DEFAULT_BEDTIME_COLORS];
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
              label={t('kidoos.dream.bedtime.selectColor', { 
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
