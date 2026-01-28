/**
 * ColorOrEffectSection Component
 * Section pour choisir entre une couleur fixe ou un effet pour le mode bedtime
 */

import React, { useMemo } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ColorPicker } from '@/components/ui';
import { Controller, Control, useWatch } from 'react-hook-form';
import { useTheme } from '@/theme';

interface ColorOrEffectSectionProps {
  control: Control<{
    color: string;
    effect: string | null;
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

// Effets disponibles pour le mode bedtime (sans "none" qui est géré par le mode couleur)
const BEDTIME_EFFECTS = [
  { value: 'pulse', label: 'Pulsation' },
  { value: 'rainbow-soft', label: 'Arc-en-ciel doux' },
  { value: 'breathe', label: 'Respiration' },
  { value: 'nightlight', label: 'Veilleuse' },
] as const;

export function ColorOrEffectSection({ control }: ColorOrEffectSectionProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const selectedColor = useWatch({ control, name: 'color' });

  // Ajouter la couleur sélectionnée à la liste si elle n'y est pas déjà
  const colorList = useMemo(() => {
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
      <Text style={[styles.label, { color: colors.text }]}>
        {t('kidoos.dream.bedtime.mode', { defaultValue: 'Mode d\'affichage' })}
      </Text>
      
      <Controller
        control={control}
        name="effect"
        render={({ field: { value: effectValue, onChange: onEffectChange } }) => {
          const isColor = effectValue === null || effectValue === 'none';
          
          return (
            <>
              <View style={styles.modeSelectorContainer}>
                <TouchableOpacity
                  style={[
                    styles.modeButton,
                    isColor && styles.modeButtonActive,
                    { backgroundColor: isColor ? colors.primary : colors.surface, borderColor: colors.border }
                  ]}
                  onPress={() => {
                    // Passer en mode couleur seulement si on n'est pas déjà en mode couleur
                    if (!isColor) {
                      onEffectChange('none');
                    }
                  }}
                >
                  <Text style={[styles.modeButtonText, { color: isColor ? '#FFFFFF' : colors.text }]}>
                    Couleur
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modeButton,
                    !isColor && styles.modeButtonActive,
                    { backgroundColor: !isColor ? colors.primary : colors.surface, borderColor: colors.border }
                  ]}
                  onPress={() => {
                    // Passer en mode effet seulement si on n'est pas déjà en mode effet
                    if (isColor) {
                      // Utiliser la valeur actuelle si elle existe et n'est pas 'none', sinon 'pulse'
                      const currentEffect = effectValue && effectValue !== 'none' ? effectValue : 'pulse';
                      onEffectChange(currentEffect);
                    }
                  }}
                >
                  <Text style={[styles.modeButtonText, { color: !isColor ? '#FFFFFF' : colors.text }]}>
                    Effet
                  </Text>
                </TouchableOpacity>
              </View>

              {isColor ? (
                <View style={styles.colorPickerContainer}>
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
                          colors={colorList}
                          label={t('kidoos.dream.bedtime.selectColor', { 
                            defaultValue: 'Sélectionnez la couleur' 
                          })}
                        />
                      );
                    }}
                  />
                </View>
              ) : (
                <View style={styles.effectPickerContainer}>
                  <Text style={[styles.effectLabel, { color: colors.text }]}>
                    {t('kidoos.dream.bedtime.selectEffect', { 
                      defaultValue: 'Sélectionnez un effet' 
                    })}
                  </Text>
                  <View style={styles.effectsGrid}>
                    {BEDTIME_EFFECTS.map((effectOption) => {
                      const isSelected = effectValue !== null && effectValue !== 'none' && effectOption.value === effectValue;
                      return (
                        <TouchableOpacity
                          key={effectOption.value}
                          style={[
                            styles.effectButton,
                            isSelected && styles.effectButtonActive,
                            { 
                              backgroundColor: isSelected ? colors.primary : colors.surface,
                              borderColor: colors.border 
                            }
                          ]}
                          onPress={() => onEffectChange(effectOption.value)}
                        >
                          <Text style={[
                            styles.effectButtonText,
                            { color: isSelected ? '#FFFFFF' : colors.text }
                          ]}>
                            {effectOption.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}
            </>
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  modeSelectorContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeButtonActive: {
    // Style déjà appliqué via backgroundColor
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  colorPickerContainer: {
    marginTop: 8,
  },
  effectPickerContainer: {
    marginTop: 8,
  },
  effectLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  effectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  effectButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  effectButtonActive: {
    // Style déjà appliqué via backgroundColor
  },
  effectButtonText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
