/**
 * Bedtime Config Screen
 * Page pour configurer l'heure de coucher du modèle Dream
 */

import React, { useLayoutEffect, useCallback, useEffect } from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TimePicker, ColorPicker, Button, Text, Slider, ContentScrollView } from '@/components/ui';
import { useTheme } from '@/theme';
import { useDreamBedtimeConfig, useUpdateDreamBedtimeConfig } from '@/hooks';
import { updateDreamBedtimeConfigSchema, UpdateDreamBedtimeConfigInput } from '@shared';

type RouteParams = {
  kidooId: string;
};

type BedtimeConfigFormData = UpdateDreamBedtimeConfigInput;

// Fonction helper pour convertir RGB en hex
function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((x) => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('')}`;
}

export function BedtimeConfigScreen() {
  const { t } = useTranslation();
  const { spacing, colors } = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const { kidooId } = (route.params as RouteParams) || {};

  const { data: config, isLoading } = useDreamBedtimeConfig(kidooId);
  const updateConfig = useUpdateDreamBedtimeConfig();

  // Mettre à jour le titre de la page
  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('kidoos.dream.bedtime.title', { defaultValue: 'Heure de coucher' }),
    });
  }, [navigation, t]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<BedtimeConfigFormData>({
    resolver: zodResolver(updateDreamBedtimeConfigSchema),
    defaultValues: {
      hour: 22,
      minute: 0,
      color: '#FF6B6B',
      brightness: 50,
      nightlightAllNight: false,
    },
  });

  // Charger la configuration depuis l'API
  useEffect(() => {
    if (config) {
      const colorHex = rgbToHex(config.colorR, config.colorG, config.colorB);
      reset({
        hour: config.hour,
        minute: config.minute,
        color: colorHex,
        brightness: config.brightness,
        nightlightAllNight: config.nightlightAllNight,
      });
    }
  }, [config, reset]);

  const handleTest = useCallback(async () => {
    // TODO: Envoyer une commande de test au Kidoo pour prévisualiser la configuration
    const formData = watch();
    console.log('Test de la configuration:', { 
      kidooId,
      ...formData
    });
  }, [kidooId, watch]);

  const onSubmit = useCallback(
    async (data: BedtimeConfigFormData) => {
      updateConfig.mutate(
        { id: kidooId, data },
        {
          onSuccess: () => {
            navigation.goBack();
          },
        }
      );
    },
    [updateConfig, kidooId, navigation]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ContentScrollView>
        <View style={styles.content}>
          {/* TimePicker */}
          <Controller
            control={control}
            name="hour"
            render={({ field: { value: hour } }) => {
              const minuteValue = watch('minute');
              return (
                <TimePicker
                  hour={hour}
                  minute={minuteValue}
                  onTimeChange={(newHour, newMinute) => {
                    setValue('hour', newHour, { shouldValidate: true });
                    setValue('minute', newMinute, { shouldValidate: true });
                  }}
                  label={t('kidoos.dream.bedtime.selectTime', { 
                    defaultValue: 'Sélectionnez l\'heure de coucher' 
                  })}
                />
              );
            }}
          />
          
          {/* ColorPicker */}
          <View style={styles.colorPickerContainer}>
            <Controller
              control={control}
              name="color"
              render={({ field: { value, onChange } }) => (
                <ColorPicker
                  selectedColor={value}
                  onColorChange={onChange}
                  label={t('kidoos.dream.bedtime.selectColor', { 
                    defaultValue: 'Sélectionnez la couleur' 
                  })}
                />
              )}
            />
          </View>

          {/* Slider Luminosité */}
          <View style={styles.brightnessContainer}>
            <Controller
              control={control}
              name="brightness"
              render={({ field: { value, onChange } }) => (
                <Slider
                  value={value}
                  minimumValue={0}
                  maximumValue={100}
                  step={1}
                  onValueChange={onChange}
                  label={t('kidoos.dream.bedtime.brightness', { 
                    defaultValue: 'Luminosité' 
                  })}
                  formatValue={(val) => `${Math.round(val)}%`}
                />
              )}
            />
          </View>

          {/* Switch Veilleuse toute la nuit */}
          <View style={styles.switchContainer}>
            <Controller
              control={control}
              name="nightlightAllNight"
              render={({ field: { value, onChange } }) => (
                <View style={styles.switchRow}>
                  <Text style={[styles.switchLabel, { color: colors.text }]}>
                    {t('kidoos.dream.bedtime.nightlightAllNight', { 
                      defaultValue: 'Veilleuse allumée toute la nuit' 
                    })}
                  </Text>
                  <Switch
                    value={value}
                    onValueChange={onChange}
                    trackColor={{ false: colors.border, true: colors.primary + '80' }}
                    thumbColor={value ? colors.primary : colors.textTertiary}
                  />
                </View>
              )}
            />
          </View>

          {/* Boutons Actions */}
          <View style={styles.actionsContainer}>
            <View style={styles.actionsRow}>
              <Button
                title={t('kidoos.dream.bedtime.test', { defaultValue: 'Tester' })}
                variant="outline"
                onPress={handleTest}
                style={styles.testButton}
                disabled={isLoading || updateConfig.isPending}
              />
              <Button
                title={t('common.save', { defaultValue: 'Enregistrer' })}
                variant="primary"
                onPress={handleSubmit(onSubmit)}
                style={styles.validateButton}
                disabled={isLoading || updateConfig.isPending}
              />
            </View>
          </View>
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
  colorPickerContainer: {
    marginTop: 32,
  },
  brightnessContainer: {
    marginTop: 32,
    width: '100%',
  },
  switchContainer: {
    marginTop: 32,
    width: '100%',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 0,
  },
  switchLabel: {
    fontSize: 16,
    flex: 1,
  },
  actionsContainer: {
    marginTop: 10,
    paddingVertical: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  testButton: {
    flex: 1,
  },
  validateButton: {
    flex: 1,
  },
});
