/**
 * BrightnessSection Component
 * Section avec le slider de luminosité
 */

import React, { useRef, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Slider } from '@/components/ui';
import { Controller, Control } from 'react-hook-form';

interface BrightnessSectionProps {
  control: Control<{
    color: string;
    brightness: number;
  }>;
}

export function BrightnessSection({ control }: BrightnessSectionProps) {
  const { t } = useTranslation();
  const lastValueRef = useRef<number | null>(null);

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="brightness"
        render={({ field: { value, onChange } }) => {
          // Initialiser lastValueRef avec la valeur actuelle si elle n'est pas encore définie
          if (value !== undefined && value !== null && lastValueRef.current === null) {
            lastValueRef.current = value;
          }

          // Fonction wrapper pour éviter les valeurs invalides pendant le glissement
          const handleValueChange = useCallback((newValue: number) => {
            // Vérifier que la valeur est valide
            if (newValue < 0 || newValue > 100 || isNaN(newValue)) {
              return;
            }

            // Si on passe d'une valeur > 0 à 0, c'est probablement un bug du slider
            // Ignorer ce saut suspect vers 0 (sauf si la valeur actuelle est déjà 0)
            if (lastValueRef.current !== null && lastValueRef.current > 0 && newValue === 0) {
              // Ne pas mettre à jour si c'est un saut suspect vers 0
              return;
            }

            // Mettre à jour seulement si la valeur a vraiment changé
            if (newValue !== lastValueRef.current) {
              lastValueRef.current = newValue;
              onChange(newValue);
            }
          }, [onChange]);

          return (
            <Slider
              value={value ?? 50}
              minimumValue={0}
              maximumValue={100}
              step={1}
              onValueChange={handleValueChange}
              label={t('kidoos.dream.wakeup.brightness', { 
                defaultValue: 'Luminosité' 
              })}
              formatValue={(val) => `${Math.round(val)}%`}
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
    width: '100%',
  },
});
