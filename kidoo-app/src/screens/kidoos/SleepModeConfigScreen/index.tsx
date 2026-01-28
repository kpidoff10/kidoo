/**
 * Sleep Mode Config Screen
 * Page pour configurer le mode veille (couleur unie ou effet)
 */

import React, { useLayoutEffect, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { ContentScrollView, ScreenLoader } from '@/components/ui';
import { useTheme } from '@/theme';
import { useSleepModeConfig, useUpdateSleepModeConfig } from '@/hooks';
import { SleepModeSection } from './components';

type RouteParams = {
  kidooId: string;
};

// Fonction helper pour convertir RGB en hex
function rgbToHex(r: number, g: number, b: number): string {
  const hex = `#${[r, g, b].map((x) => {
    const hexStr = x.toString(16);
    return hexStr.length === 1 ? '0' + hexStr : hexStr;
  }).join('')}`;
  return hex.toUpperCase();
}

// Type du formulaire SleepModeConfig
type SleepModeConfigFormData = {
  sleepModeType: 'color' | 'effect';
  sleepModeColor: string;
  sleepModeEffect: number;
};

export function SleepModeConfigScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const { kidooId } = (route.params as RouteParams) || {};

  const { data: sleepModeConfig, isLoading } = useSleepModeConfig(kidooId);
  const { control, setValue } = useForm<SleepModeConfigFormData>({
    defaultValues: {
      sleepModeType: 'color',
      sleepModeColor: '#000000',
      sleepModeEffect: 5,
    },
  });

  // Mettre à jour le titre de la page
  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('kidoos.sleepMode.title', { defaultValue: 'Mode veille' }),
    });
  }, [navigation, t]);

  // Initialiser le formulaire avec les données du serveur
  const initializedRef = useRef(false);
  useEffect(() => {
    if (sleepModeConfig && !isLoading && !initializedRef.current) {
      if (sleepModeConfig.type === 'color' && sleepModeConfig.color) {
        const colorHex = rgbToHex(sleepModeConfig.color.r, sleepModeConfig.color.g, sleepModeConfig.color.b);
        setValue('sleepModeType', 'color');
        setValue('sleepModeColor', colorHex);
        setValue('sleepModeEffect', 5);
      } else if (sleepModeConfig.type === 'effect' && sleepModeConfig.effect !== undefined) {
        setValue('sleepModeType', 'effect');
        setValue('sleepModeEffect', sleepModeConfig.effect);
        setValue('sleepModeColor', '#000000');
      }
      initializedRef.current = true;
    }
  }, [sleepModeConfig, isLoading, setValue]);

  if (isLoading) {
    return <ScreenLoader />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ContentScrollView>
        <View style={styles.content}>
          <SleepModeSection
            control={control}
            setValue={setValue}
            kidooId={kidooId}
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
