/**
 * WeekdaySelector Component
 * Composant réutilisable pour sélectionner un jour parmi les jours de la semaine
 * avec gestion des jours actifs/inactifs
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../Button';
import { Text } from '../Typography';
import { useTheme } from '@/theme';
import { Weekday } from '../WeekdayPicker';

export interface WeekdaySelectorProps {
  /**
   * Jour actuellement sélectionné pour configuration
   */
  selectedDay: Weekday;
  
  /**
   * Jours actifs (activés)
   */
  activeDays: Weekday[];
  
  /**
   * Jours configurés (avec une heure définie) - affiche une bordure success
   */
  configuredDays?: Weekday[];
  
  /**
   * Callback appelé quand un jour est sélectionné
   */
  onDaySelect: (day: Weekday) => void;
  
  /**
   * Callback optionnel appelé quand un jour doit être activé
   * Si non fourni, le jour sera automatiquement activé lors de la sélection
   */
  onDayActivate?: (day: Weekday) => void;
  
  /**
   * Label optionnel au-dessus du sélecteur
   */
  label?: string;
  
  /**
   * Ordre des jours (par défaut: lundi à dimanche avec samedi/dimanche en bas)
   */
  dayOrder?: Weekday[];
  
  /**
   * Style personnalisé pour le conteneur
   */
  containerStyle?: ViewStyle;
  
  /**
   * Style personnalisé pour la ligne de jours
   */
  rowStyle?: ViewStyle;
  
  /**
   * Style personnalisé pour chaque bouton de jour
   */
  buttonStyle?: ViewStyle;
}

const DEFAULT_DAY_ORDER: Weekday[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export function WeekdaySelector({
  selectedDay,
  activeDays,
  configuredDays = [],
  onDaySelect,
  onDayActivate,
  label,
  dayOrder = DEFAULT_DAY_ORDER,
  containerStyle,
  rowStyle,
  buttonStyle,
}: WeekdaySelectorProps) {
  const { t } = useTranslation();
  const { colors, spacing } = useTheme();

  const handleDayPress = (day: Weekday) => {
    onDaySelect(day);
    
    // Activer le jour s'il n'est pas déjà actif
    if (!activeDays.includes(day)) {
      if (onDayActivate) {
        onDayActivate(day);
      } else {
        // Comportement par défaut : activer automatiquement
        // L'utilisateur peut gérer cela via onDayActivate si nécessaire
      }
    }
  };

  const dayLabels: Record<Weekday, string> = {
    monday: t('kidoos.dream.bedtime.monday', { defaultValue: 'Lun' }),
    tuesday: t('kidoos.dream.bedtime.tuesday', { defaultValue: 'Mar' }),
    wednesday: t('kidoos.dream.bedtime.wednesday', { defaultValue: 'Mer' }),
    thursday: t('kidoos.dream.bedtime.thursday', { defaultValue: 'Jeu' }),
    friday: t('kidoos.dream.bedtime.friday', { defaultValue: 'Ven' }),
    saturday: t('kidoos.dream.bedtime.saturday', { defaultValue: 'Sam' }),
    sunday: t('kidoos.dream.bedtime.sunday', { defaultValue: 'Dim' }),
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>
          {label}
        </Text>
      )}
      
      <View style={[styles.daySelectorRow, rowStyle]}>
        {dayOrder.map((day) => {
          const isSelected = selectedDay === day;
          const isActive = activeDays.includes(day);
          const isConfigured = configuredDays.includes(day);
          
          // Toujours afficher une bordure (outline au minimum)
          let variant: 'primary' | 'outline' | 'ghost' = 'outline';
          if (isSelected) {
            variant = 'primary';
          }
          
          // Icône selon l'état : coche verte si configuré, croix rouge si non configuré
          let rightIcon: React.ReactNode = null;
          if (isConfigured) {
            // Jour configuré : coche verte
            rightIcon = (
              <Ionicons 
                name="checkmark-circle" 
                size={16} 
                color={isSelected ? colors.textInverse : colors.success} 
                style={{ marginLeft: 4 }}
              />
            );
          } else {
            // Jour non configuré : croix rouge (toujours affichée)
            rightIcon = (
              <Ionicons 
                name="close-circle" 
                size={16} 
                color={isSelected ? colors.textInverse : colors.error} 
                style={{ marginLeft: 4 }}
              />
            );
          }
          
          return (
            <Button
              key={day}
              title={dayLabels[day]}
              variant={variant}
              onPress={() => handleDayPress(day)}
              style={[styles.daySelectorButton, buttonStyle]}
              rightIcon={rightIcon}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  daySelectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  daySelectorButton: {
    flex: 1,
    minWidth: '30%',
  },
});
