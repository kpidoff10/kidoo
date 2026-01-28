/**
 * WeekdayPicker Component
 * Composant pour sélectionner les jours de la semaine
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/theme';
import { Text } from '../Typography/Text';

export type Weekday = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface WeekdayPickerProps {
  /**
   * Jours sélectionnés
   */
  selectedDays: Weekday[];
  
  /**
   * Callback appelé quand les jours changent
   */
  onDaysChange: (days: Weekday[]) => void;
  
  /**
   * Label optionnel
   */
  label?: string;
  
  /**
   * Style personnalisé pour le conteneur
   */
  containerStyle?: View['props']['style'];
}

const WEEKDAYS: { key: Weekday; short: string; long: string }[] = [
  { key: 'monday', short: 'L', long: 'Lun' },
  { key: 'tuesday', short: 'M', long: 'Mar' },
  { key: 'wednesday', short: 'M', long: 'Mer' },
  { key: 'thursday', short: 'J', long: 'Jeu' },
  { key: 'friday', short: 'V', long: 'Ven' },
  { key: 'saturday', short: 'S', long: 'Sam' },
  { key: 'sunday', short: 'D', long: 'Dim' },
];

export function WeekdayPicker({ 
  selectedDays, 
  onDaysChange, 
  label,
  containerStyle 
}: WeekdayPickerProps) {
  const { colors: themeColors, spacing, fonts, borderRadius } = useTheme();

  const toggleDay = (day: Weekday) => {
    if (selectedDays.includes(day)) {
      onDaysChange(selectedDays.filter(d => d !== day));
    } else {
      onDaysChange([...selectedDays, day]);
    }
  };

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

      <View style={styles.daysContainer}>
        {WEEKDAYS.map((day) => {
          const isSelected = selectedDays.includes(day.key);
          return (
            <TouchableOpacity
              key={day.key}
              style={[
                styles.dayItem,
                {
                  backgroundColor: isSelected 
                    ? themeColors.primary 
                    : 'transparent',
                  borderColor: isSelected 
                    ? themeColors.primary 
                    : themeColors.border,
                  borderWidth: isSelected ? 2 : 1.5,
                  borderRadius: borderRadius.full,
                },
              ]}
              onPress={() => toggleDay(day.key)}
              activeOpacity={0.6}
            >
              <View style={styles.dayContent}>
                <Text
                  style={[
                    styles.dayShort,
                    {
                      color: isSelected 
                        ? themeColors.textInverse 
                        : themeColors.text,
                      fontWeight: isSelected 
                        ? fonts.weight.bold 
                        : fonts.weight.semibold,
                    },
                  ]}
                >
                  {day.short}
                </Text>
              </View>
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
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 8,
  },
  dayItem: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 48,
    maxHeight: 48,
  },
  dayContent: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  dayShort: {
    fontSize: 16,
  },
});
