/**
 * Bedtime Config Screen
 * Page pour configurer l'heure de coucher du modèle Dream
 */

import React, { useLayoutEffect, useCallback, useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { ContentScrollView, Weekday, ScreenLoader } from '@/components/ui';
import { useTheme } from '@/theme';
import { useDreamBedtimeConfig, useUpdateDreamBedtimeConfig } from '@/hooks';
import {
  WeekdaySelectorSection,
  TimePickerSection,
  ColorPickerSection,
  ColorOrEffectSection,
  BrightnessSection,
  NightlightSwitch,
  TestButton,
} from './components';

type RouteParams = {
  kidooId: string;
};

// Fonction helper pour convertir RGB en hex
function rgbToHex(r: number, g: number, b: number): string {
  const hex = `#${[r, g, b].map((x) => {
    const hexStr = x.toString(16);
    return hexStr.length === 1 ? '0' + hexStr : hexStr;
  }).join('')}`;
  // Normaliser en majuscules pour cohérence avec ColorPicker
  return hex.toUpperCase();
}

export function BedtimeConfigScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const { kidooId } = (route.params as RouteParams) || {};

  const { data: config, isLoading } = useDreamBedtimeConfig(kidooId);
  const updateConfig = useUpdateDreamBedtimeConfig();

  // États pour la gestion des jours
  const [selectedDayForTime, setSelectedDayForTime] = useState<Weekday>('monday');
  const [weekdayTimes, setWeekdayTimes] = useState<Partial<Record<Weekday, { hour: number; minute: number; activated: boolean }>>>({});
  const [savedConfiguredDays, setSavedConfiguredDays] = useState<Weekday[]>([]);
  
  // Refs pour le debounce de sauvegarde
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializingRef = useRef(false);
  const configLoadedRef = useRef(false);
  const weekdayTimesRef = useRef<Partial<Record<Weekday, { hour: number; minute: number; activated: boolean }>>>({});

  // Mettre à jour le titre de la page
  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('kidoos.dream.bedtime.title', { defaultValue: 'Heure de coucher' }),
    });
  }, [navigation, t]);

  // Formulaire simplifié (sans Zod pour éviter les problèmes)
  const { control, reset, watch, getValues } = useForm({
    defaultValues: {
      color: '#FF6B6B',
      effect: null as string | null,
      brightness: 50,
      nightlightAllNight: false,
    },
  });

  // Charger les données existantes depuis la config
  useEffect(() => {
    // Si on a fini de charger (même si config est undefined/null, c'est OK pour une nouvelle config)
    if (!isLoading && !configLoadedRef.current) {
      console.log('[BEDTIME-CONFIG] Initialisation:', { config, isLoading });
      isInitializingRef.current = true;
      
      if (config) {
        // Initialiser le formulaire avec les valeurs existantes
        const colorHex = rgbToHex(config.colorR, config.colorG, config.colorB);
        reset({
          color: colorHex,
          effect: config.effect || null,
          brightness: config.brightness,
          nightlightAllNight: config.nightlightAllNight,
        });

        // Initialiser weekdayTimes avec les données existantes
        if (config.weekdaySchedule) {
          setWeekdayTimes(config.weekdaySchedule);
          weekdayTimesRef.current = config.weekdaySchedule;
          // Calculer les jours configurés
          const configuredDays = Object.entries(config.weekdaySchedule)
            .filter(([_, time]) => time.activated)
            .map(([day]) => day as Weekday);
          setSavedConfiguredDays(configuredDays);
        } else {
          // Initialiser avec un objet vide si pas de schedule
          weekdayTimesRef.current = {};
        }
      } else {
        // Pas de config existante, utiliser les valeurs par défaut du formulaire
        weekdayTimesRef.current = {};
      }
      
      // Marquer comme chargé APRÈS avoir initialisé toutes les données
      // Utiliser requestAnimationFrame pour s'assurer que React a fini de mettre à jour
      requestAnimationFrame(() => {
        configLoadedRef.current = true;
        isInitializingRef.current = false;
        console.log('[BEDTIME-CONFIG] Données chargées, sauvegarde activée');
      });
    }
  }, [config, isLoading, reset]);

  // Fonction pour sauvegarder la configuration
  const saveConfig = useCallback(() => {
    // Vérifications de base
    if (!kidooId) {
      console.log('[BEDTIME-CONFIG] Sauvegarde ignorée: pas de kidooId');
      return;
    }

    if (isInitializingRef.current) {
      console.log('[BEDTIME-CONFIG] Sauvegarde ignorée: initialisation en cours');
      return;
    }

    if (!configLoadedRef.current) {
      console.log('[BEDTIME-CONFIG] Sauvegarde ignorée: config pas encore chargée');
      return;
    }

    // Annuler le timeout précédent s'il existe
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Débouncer la sauvegarde de 500ms
    saveTimeoutRef.current = setTimeout(() => {
      const formValues = getValues();
      const color = formValues.color || '#FF6B6B';
      const effect = formValues.effect;
      const brightness = formValues.brightness ?? 50;
      const nightlightAllNight = formValues.nightlightAllNight ?? false;

      // Construire weekdaySchedule avec seulement les jours activés
      const weekdaySchedule: Record<string, { hour: number; minute: number; activated: boolean }> = {};
      Object.entries(weekdayTimesRef.current).forEach(([day, time]) => {
        if (time && time.activated) {
          weekdaySchedule[day] = {
            hour: time.hour,
            minute: time.minute,
            activated: true,
          };
        }
      });

      console.log('[BEDTIME-CONFIG] Sauvegarde en cours:', {
        kidooId,
        weekdaySchedule,
        color,
        effect,
        brightness,
        nightlightAllNight,
      });

      // Préparer les données : soit color soit effect
      const updateData: {
        weekdaySchedule?: Record<string, { hour: number; minute: number; activated: boolean }>;
        color?: string;
        effect?: string;
        brightness: number;
        nightlightAllNight: boolean;
      } = {
        brightness,
        nightlightAllNight,
      };

      if (effect && effect !== 'none') {
        // Mode effet
        updateData.effect = effect;
      } else {
        // Mode couleur fixe
        updateData.color = color;
      }

      if (Object.keys(weekdaySchedule).length > 0) {
        updateData.weekdaySchedule = weekdaySchedule;
      }

      updateConfig.mutate(
        {
          id: kidooId,
          data: updateData,
        },
        {
          onSuccess: () => {
            console.log('[BEDTIME-CONFIG] Sauvegarde réussie');
          },
          onError: (error) => {
            console.error('[BEDTIME-CONFIG] Erreur de sauvegarde:', error);
          },
        },
      );

      saveTimeoutRef.current = null;
    }, 500);
  }, [kidooId, getValues, updateConfig]);

  // Mettre à jour la ref quand weekdayTimes change
  useEffect(() => {
    weekdayTimesRef.current = weekdayTimes;
  }, [weekdayTimes]);

  // Sauvegarder automatiquement lors des changements de weekdayTimes
  useEffect(() => {
    if (!isInitializingRef.current && configLoadedRef.current) {
      console.log('[BEDTIME-CONFIG] Changement de weekdayTimes détecté:', weekdayTimes);
      saveConfig();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekdayTimes]);

  // Sauvegarder automatiquement lors des changements du formulaire (couleur, effect, brightness, nightlightAllNight)
  const color = watch('color');
  const effect = watch('effect');
  const brightness = watch('brightness');
  const nightlightAllNight = watch('nightlightAllNight');
  
  useEffect(() => {
    if (!isInitializingRef.current && configLoadedRef.current) {
      console.log('[BEDTIME-CONFIG] Changement de formulaire détecté:', { color, effect, brightness, nightlightAllNight });
      saveConfig();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color, effect, brightness, nightlightAllNight]);

  // Nettoyage au démontage
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Gestion du switch pour activer/désactiver un jour
  const handleSwitchChange = useCallback((day: Weekday, activated: boolean) => {
    setWeekdayTimes(prev => {
      const currentTime = prev[day];
      if (activated) {
        if (!currentTime) {
          return {
            ...prev,
            [day]: { hour: 22, minute: 0, activated: true },
          };
        } else {
          return {
            ...prev,
            [day]: { ...currentTime, activated: true },
          };
        }
      } else {
        if (currentTime) {
          return {
            ...prev,
            [day]: { ...currentTime, activated: false },
          };
        }
        return prev;
      }
    });
  }, []);

  // Gestion du changement d'heure
  const handleTimeChange = useCallback((day: Weekday, hour: number, minute: number) => {
    setWeekdayTimes(prev => ({
      ...prev,
      [day]: {
        hour,
        minute,
        activated: prev[day]?.activated ?? true,
      },
    }));
  }, []);


  // Calculer les jours actifs
  const activeDays = Object.entries(weekdayTimes)
    .filter(([_, time]) => time?.activated === true)
    .map(([day]) => day as Weekday);

  if (isLoading) {
    return <ScreenLoader />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ContentScrollView>
        <View style={styles.content}>
          <WeekdaySelectorSection
            selectedDay={selectedDayForTime}
            activeDays={activeDays}
            configuredDays={savedConfiguredDays}
            weekdayTimes={weekdayTimes}
            onDaySelect={setSelectedDayForTime}
            onSwitchChange={handleSwitchChange}
          />

          {weekdayTimes[selectedDayForTime]?.activated && (
            <TimePickerSection
              selectedDay={selectedDayForTime}
              hour={weekdayTimes[selectedDayForTime]?.hour ?? 22}
              minute={weekdayTimes[selectedDayForTime]?.minute ?? 0}
              onTimeChange={(hour, minute) => handleTimeChange(selectedDayForTime, hour, minute)}
            />
          )}

          <ColorOrEffectSection control={control} />

          <BrightnessSection control={control} />

          <NightlightSwitch control={control} />

          <TestButton
            kidooId={kidooId}
            control={control}
          />
        </View>
      </ContentScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingVertical: 10,
  },
});
