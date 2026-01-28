/**
 * WeekdaySelectorSection Component
 * Section avec le sélecteur de jour et le switch pour activer/désactiver
 */

import React from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { WeekdaySelector, Weekday, Text } from '@/components/ui';
import { useTheme } from '@/theme';

interface WeekdaySelectorSectionProps {
  selectedDay: Weekday;
  activeDays: Weekday[];
  configuredDays: Weekday[];
  weekdayTimes: Partial<Record<Weekday, { hour: number; minute: number; activated: boolean }>>;
  onDaySelect: (day: Weekday) => void;
  onSwitchChange: (day: Weekday, activated: boolean) => void;
}

export function WeekdaySelectorSection({
  selectedDay,
  activeDays,
  configuredDays,
  weekdayTimes,
  onDaySelect,
  onSwitchChange,
}: WeekdaySelectorSectionProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const dayLabels: Record<Weekday, string> = {
    monday: t('kidoos.dream.wakeup.monday', { defaultValue: 'Lundi' }),
    tuesday: t('kidoos.dream.wakeup.tuesday', { defaultValue: 'Mardi' }),
    wednesday: t('kidoos.dream.wakeup.wednesday', { defaultValue: 'Mercredi' }),
    thursday: t('kidoos.dream.wakeup.thursday', { defaultValue: 'Jeudi' }),
    friday: t('kidoos.dream.wakeup.friday', { defaultValue: 'Vendredi' }),
    saturday: t('kidoos.dream.wakeup.saturday', { defaultValue: 'Samedi' }),
    sunday: t('kidoos.dream.wakeup.sunday', { defaultValue: 'Dimanche' }),
  };

  return (
    <View>
      <WeekdaySelector
        selectedDay={selectedDay}
        activeDays={activeDays}
        configuredDays={activeDays}
        onDaySelect={onDaySelect}
        label={t('kidoos.dream.wakeup.selectDayToConfigure', { 
          defaultValue: 'Sélectionnez un jour pour configurer l\'heure' 
        })}
        containerStyle={styles.daySelectorContainer}
      />

      {/* Switch pour activer/désactiver le jour sélectionné */}
      <View style={styles.switchContainer}>
        <View style={styles.switchRow}>
          <Text style={[styles.switchLabel, { color: colors.text }]}>
            {t('kidoos.dream.wakeup.activateFor', { 
              defaultValue: `Activer pour ${dayLabels[selectedDay]}`,
              day: dayLabels[selectedDay]
            })}
          </Text>
          <Switch
            value={weekdayTimes[selectedDay]?.activated ?? false}
            onValueChange={(value) => onSwitchChange(selectedDay, value)}
            trackColor={{ false: colors.border, true: colors.primary + '80' }}
            thumbColor={(weekdayTimes[selectedDay]?.activated ?? false) ? colors.primary : colors.textTertiary}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  daySelectorContainer: {
    width: '100%',
  },
  switchContainer: {
    marginTop: 12,
    width: '100%',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 16,
    flex: 1,
  },
});
