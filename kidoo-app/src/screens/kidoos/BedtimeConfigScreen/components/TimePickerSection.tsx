/**
 * TimePickerSection Component
 * Section avec le TimePicker pour le jour sélectionné
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { TimePicker, Weekday } from '@/components/ui';

interface TimePickerSectionProps {
  selectedDay: Weekday;
  hour: number;
  minute: number;
  onTimeChange: (hour: number, minute: number) => void;
}

export function TimePickerSection({
  selectedDay,
  hour,
  minute,
  onTimeChange,
}: TimePickerSectionProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <TimePicker
        hour={hour}
        minute={minute}
        onTimeChange={onTimeChange}
        label={t('kidoos.dream.bedtime.configureTimeForDay', { 
          defaultValue: 'Heure de coucher' 
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    width: '100%',
  },
});
