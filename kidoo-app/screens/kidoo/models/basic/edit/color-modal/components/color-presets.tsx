/**
 * Grille de couleurs prédéfinies
 * Affiche une sélection de couleurs communes avec indicateur de sélection
 */

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { ColorOptions } from '@/services/kidoo-actions/types';

// Couleurs prédéfinies
const PRESET_COLORS: ColorOptions[] = [
  { r: 255, g: 0, b: 0 },
  { r: 255, g: 128, b: 0 },
  { r: 255, g: 255, b: 0 },
  { r: 128, g: 255, b: 0 },
  { r: 0, g: 255, b: 0 },
  { r: 0, g: 255, b: 128 },
  { r: 0, g: 255, b: 255 },
  { r: 0, g: 128, b: 255 },
  { r: 0, g: 0, b: 255 },
  { r: 128, g: 0, b: 255 },
  { r: 255, g: 0, b: 255 },
  { r: 255, g: 0, b: 128 },
  { r: 255, g: 255, b: 255 },
  { r: 128, g: 128, b: 128 },
  { r: 0, g: 0, b: 0 },
];

interface ColorPresetsProps {
  color: ColorOptions;
  onPresetSelect: (presetColor: ColorOptions) => void;
}

export function ColorPresets({ color, onPresetSelect }: ColorPresetsProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View style={styles.presetsContainer}>
      <ThemedText style={[styles.presetsTitle, { marginBottom: theme.spacing.md }]}>
        {t('kidoos.edit.basic.menu.colors.presets', 'Couleurs prédéfinies')}
      </ThemedText>
      <View style={styles.presetsGrid}>
        {PRESET_COLORS.map((preset, index) => {
          const isSelected = color.r === preset.r && color.g === preset.g && color.b === preset.b;
          const isPresetDark = preset.r + preset.g + preset.b < 384;
          
          return (
            <Pressable
              key={index}
              style={[
                styles.presetColor,
                {
                  backgroundColor: `rgb(${preset.r}, ${preset.g}, ${preset.b})`,
                  borderColor: isSelected ? theme.colors.tint : theme.colors.border,
                  borderWidth: isSelected ? 3 : 2,
                },
              ]}
              onPress={() => onPresetSelect(preset)}
            >
              {isSelected && (
                <IconSymbol
                  name="checkmark"
                  size={20}
                  color={isPresetDark ? '#fff' : '#000'}
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  presetsContainer: {
    width: '100%',
  },
  presetsTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  presetColor: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
