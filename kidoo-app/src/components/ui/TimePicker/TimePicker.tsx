/**
 * TimePicker Component
 * Composant générique pour sélectionner une heure (heures et minutes)
 */

import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme';
import { Text } from '../Typography/Text';

export interface TimePickerProps {
  /**
   * Heure sélectionnée (0-23)
   */
  hour: number;
  
  /**
   * Minutes sélectionnées (0-59)
   */
  minute: number;
  
  /**
   * Callback appelé quand l'heure change
   */
  onTimeChange: (hour: number, minute: number) => void;
  
  /**
   * Label optionnel
   */
  label?: string;
  
  /**
   * Style personnalisé pour le conteneur
   */
  containerStyle?: View['props']['style'];
}

export function TimePicker({ hour, minute, onTimeChange, label, containerStyle }: TimePickerProps) {
  const { colors, spacing, fonts } = useTheme();
  const [hourInput, setHourInput] = useState<string>(hour.toString().padStart(2, '0'));
  const [minuteInput, setMinuteInput] = useState<string>(minute.toString().padStart(2, '0'));
  const hourInputRef = useRef<TextInput>(null);
  const minuteInputRef = useRef<TextInput>(null);

  // Synchroniser les inputs avec les props
  useEffect(() => {
    setHourInput(hour.toString().padStart(2, '0'));
  }, [hour]);

  useEffect(() => {
    setMinuteInput(minute.toString().padStart(2, '0'));
  }, [minute]);

  const handleHourIncrement = () => {
    const newHour = hour >= 23 ? 0 : hour + 1;
    onTimeChange(newHour, minute);
  };

  const handleHourDecrement = () => {
    const newHour = hour <= 0 ? 23 : hour - 1;
    onTimeChange(newHour, minute);
  };

  const handleMinuteIncrement = () => {
    const newMinute = minute >= 59 ? 0 : minute + 1;
    onTimeChange(hour, newMinute);
  };

  const handleMinuteDecrement = () => {
    const newMinute = minute <= 0 ? 59 : minute - 1;
    onTimeChange(hour, newMinute);
  };

  const handleHourChange = (text: string) => {
    // Ne garder que les chiffres
    const numericValue = text.replace(/[^0-9]/g, '');
    setHourInput(numericValue);
  };

  const handleHourBlur = () => {
    const numValue = parseInt(hourInput, 10);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 23) {
      onTimeChange(numValue, minute);
    } else {
      // Réinitialiser à la valeur actuelle si invalide
      setHourInput(hour.toString().padStart(2, '0'));
    }
  };

  const handleMinuteChange = (text: string) => {
    // Ne garder que les chiffres
    const numericValue = text.replace(/[^0-9]/g, '');
    setMinuteInput(numericValue);
  };

  const handleMinuteBlur = () => {
    const numValue = parseInt(minuteInput, 10);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 59) {
      onTimeChange(hour, numValue);
    } else {
      // Réinitialiser à la valeur actuelle si invalide
      setMinuteInput(minute.toString().padStart(2, '0'));
    }
  };

  // Format pour afficher les nombres avec zéro devant si nécessaire
  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: colors.text,
              fontSize: fonts.size.sm,
              fontWeight: fonts.weight.medium,
              marginBottom: spacing[4],
            },
          ]}
        >
          {label}
        </Text>
      )}

      <View style={styles.pickerContainer}>
        {/* Sélecteur d'heures */}
        <View style={styles.pickerWrapper}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={handleHourIncrement}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-up" size={24} color={colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.valueContainer, { backgroundColor: colors.surface, borderColor: colors.primary }]}
            onPress={() => hourInputRef.current?.focus()}
            activeOpacity={0.7}
          >
            <TextInput
              ref={hourInputRef}
              style={[
                styles.valueText,
                {
                  color: colors.primary,
                  fontSize: fonts.size['2xl'],
                  fontWeight: fonts.weight.bold,
                },
              ]}
              value={hourInput}
              onChangeText={handleHourChange}
              onBlur={handleHourBlur}
              keyboardType="number-pad"
              maxLength={2}
              selectTextOnFocus
              textAlign="center"
            />
            <Text style={[styles.unitText, { color: colors.textSecondary, fontSize: fonts.size.sm }]}>
              h
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={handleHourDecrement}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-down" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Séparateur */}
        <Text style={[styles.separator, { color: colors.text, fontSize: fonts.size['2xl'] }]}>:</Text>

        {/* Sélecteur de minutes */}
        <View style={styles.pickerWrapper}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={handleMinuteIncrement}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-up" size={24} color={colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.valueContainer, { backgroundColor: colors.surface, borderColor: colors.primary }]}
            onPress={() => minuteInputRef.current?.focus()}
            activeOpacity={0.7}
          >
            <TextInput
              ref={minuteInputRef}
              style={[
                styles.valueText,
                {
                  color: colors.primary,
                  fontSize: fonts.size['2xl'],
                  fontWeight: fonts.weight.bold,
                },
              ]}
              value={minuteInput}
              onChangeText={handleMinuteChange}
              onBlur={handleMinuteBlur}
              keyboardType="number-pad"
              maxLength={2}
              selectTextOnFocus
              textAlign="center"
            />
            <Text style={[styles.unitText, { color: colors.textSecondary, fontSize: fonts.size.sm }]}>
              min
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={handleMinuteDecrement}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-down" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
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
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  pickerWrapper: {
    alignItems: 'center',
    gap: 8,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
    paddingTop: 8,
  },
  valueText: {
    textAlign: 'center',
    minWidth: 40,
    padding: 0,
    marginBottom: -4,
  },
  unitText: {
    textAlign: 'center',
    marginTop: -2,
  },
  separator: {
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
});
