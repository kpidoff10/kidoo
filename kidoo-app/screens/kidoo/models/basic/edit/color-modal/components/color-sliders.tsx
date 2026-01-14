/**
 * Sliders RGB pour ajuster la couleur
 * Trois sliders horizontaux pour Rouge, Vert et Bleu
 */

import { View, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import type { ColorOptions } from '@/services/kidoo-actions/types';

interface ColorSlidersProps {
  color: ColorOptions;
  onColorChange: (component: 'r' | 'g' | 'b', value: number) => void;
}

export function ColorSliders({ color, onColorChange }: ColorSlidersProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View style={styles.slidersContainer}>
      {/* Slider Rouge */}
      <View style={styles.sliderRow}>
        <View style={styles.sliderLabelContainer}>
          <ThemedText style={[styles.sliderLabel, { color: '#ff0000' }]}>
            {t('kidoos.edit.basic.menu.colors.red', 'Rouge')}
          </ThemedText>
          <ThemedText style={styles.sliderValue}>{color.r}</ThemedText>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={255}
          value={color.r}
          onValueChange={(value) => onColorChange('r', value)}
          minimumTrackTintColor="#ff0000"
          maximumTrackTintColor={theme.colors.surfaceSecondary}
          thumbTintColor="#ff0000"
        />
      </View>

      {/* Slider Vert */}
      <View style={styles.sliderRow}>
        <View style={styles.sliderLabelContainer}>
          <ThemedText style={[styles.sliderLabel, { color: '#00ff00' }]}>
            {t('kidoos.edit.basic.menu.colors.green', 'Vert')}
          </ThemedText>
          <ThemedText style={styles.sliderValue}>{color.g}</ThemedText>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={255}
          value={color.g}
          onValueChange={(value) => onColorChange('g', value)}
          minimumTrackTintColor="#00ff00"
          maximumTrackTintColor={theme.colors.surfaceSecondary}
          thumbTintColor="#00ff00"
        />
      </View>

      {/* Slider Bleu */}
      <View style={styles.sliderRow}>
        <View style={styles.sliderLabelContainer}>
          <ThemedText style={[styles.sliderLabel, { color: '#0000ff' }]}>
            {t('kidoos.edit.basic.menu.colors.blue', 'Bleu')}
          </ThemedText>
          <ThemedText style={styles.sliderValue}>{color.b}</ThemedText>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={255}
          value={color.b}
          onValueChange={(value) => onColorChange('b', value)}
          minimumTrackTintColor="#0000ff"
          maximumTrackTintColor={theme.colors.surfaceSecondary}
          thumbTintColor="#0000ff"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slidersContainer: {
    width: '100%',
    marginBottom: 32,
  },
  sliderRow: {
    marginBottom: 24,
  },
  sliderLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.7,
  },
  slider: {
    width: '100%',
    height: 40,
  },
});
