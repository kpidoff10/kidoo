/**
 * Aperçu de la couleur sélectionnée
 * Affiche un cercle avec la couleur, la valeur hex et les valeurs RGB
 */

import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import type { ColorOptions } from '@/services/kidoo-actions/types';

interface ColorPreviewProps {
  color: ColorOptions;
}

// Convertir RGB en hex pour affichage
const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${[r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('')}`;
};

export function ColorPreview({ color }: ColorPreviewProps) {
  const theme = useTheme();
  const isDarkColor = color.r + color.g + color.b < 384;

  return (
    <View style={styles.previewContainer}>
      <View
        style={[
          styles.colorPreview,
          {
            backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <ThemedText style={[styles.hexValue, { color: isDarkColor ? '#fff' : '#000' }]}>
          {rgbToHex(color.r, color.g, color.b)}
        </ThemedText>
      </View>
      <View style={styles.rgbContainer}>
        <ThemedText style={styles.rgbLabel}>
          R: {color.r} G: {color.g} B: {color.b}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  previewContainer: {
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
  },
  colorPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  hexValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  rgbContainer: {
    alignItems: 'center',
  },
  rgbLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
});
