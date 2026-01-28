/**
 * TestButton Component
 * Bouton indépendant pour démarrer/arrêter le test
 * Récupère automatiquement la couleur et la luminosité depuis le formulaire
 * Gère son propre état et envoie les mises à jour en temps réel pendant le test
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useWatch, Control } from 'react-hook-form';
import { Button } from '@/components/ui';
import { useTestDreamBedtime } from '@/hooks';

interface TestButtonProps {
  kidooId: string;
  control: Control<{
    color: string;
    effect: string | null;
    brightness: number;
    nightlightAllNight: boolean;
  }>;
}

export function TestButton({
  kidooId,
  control,
}: TestButtonProps) {
  const { t } = useTranslation();
  const testBedtime = useTestDreamBedtime();
  
  // Récupérer les valeurs directement depuis le formulaire
  const color = useWatch({ control, name: 'color' });
  const brightness = useWatch({ control, name: 'brightness' });
  
  // État interne pour gérer le test
  const [isTestActive, setIsTestActive] = useState(false);
  
  // Refs pour tracker les dernières valeurs envoyées et éviter les boucles
  const lastColorRef = useRef<string | null>(null);
  const lastBrightnessRef = useRef<number | null>(null);
  const isInitializingRef = useRef(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePress = useCallback(() => {
    if (isTestActive) {
      // Arrêter le test
      setIsTestActive(false);
      testBedtime.mutate(
        {
          id: kidooId,
          action: 'stop',
        },
      );
    } else {
      // Démarrer le test
      const currentColor = color || '#FF6B6B';
      const currentBrightness = brightness ?? 50;

      setIsTestActive(true);
      isInitializingRef.current = true;
      lastColorRef.current = currentColor;
      lastBrightnessRef.current = currentBrightness;

      testBedtime.mutate(
        {
          id: kidooId,
          action: 'start',
          params: {
            color: currentColor,
            brightness: currentBrightness,
          },
        },
        {
          onSuccess: () => {
            isInitializingRef.current = false;
          },
          onError: () => {
            setIsTestActive(false);
            isInitializingRef.current = false;
          },
        },
      );
    }
  }, [isTestActive, kidooId, color, brightness, testBedtime]);

  // Envoyer automatiquement les mises à jour en temps réel pendant le test
  useEffect(() => {
    // Ne rien faire si le test n'est pas actif ou si on est en train d'initialiser
    if (!isTestActive || isInitializingRef.current) {
      // Réinitialiser les refs quand le test n'est pas actif
      if (!isTestActive) {
        lastColorRef.current = null;
        lastBrightnessRef.current = null;
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
          debounceTimeoutRef.current = null;
        }
      }
      return;
    }

    const currentColor = color || '#FF6B6B';
    const currentBrightness = brightness ?? 50;

    // Vérifier si les valeurs ont vraiment changé
    const colorChanged = lastColorRef.current !== null && lastColorRef.current !== currentColor;
    const brightnessChanged = lastBrightnessRef.current !== null && lastBrightnessRef.current !== currentBrightness;

    if (colorChanged || brightnessChanged) {
      lastColorRef.current = currentColor;
      lastBrightnessRef.current = currentBrightness;

      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      const sendUpdate = () => {
        if (isTestActive && !isInitializingRef.current) {
          testBedtime.mutate({
            id: kidooId,
            action: 'start',
            params: {
              color: currentColor,
              brightness: currentBrightness,
            },
          });
        }
      };

      if (colorChanged) {
        // Changement de couleur : envoi immédiat
        sendUpdate();
      } else if (brightnessChanged) {
        // Changement de brightness : debounce de 300ms
        debounceTimeoutRef.current = setTimeout(() => {
          sendUpdate();
          debounceTimeoutRef.current = null;
        }, 300);
      }
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [color, brightness, isTestActive, kidooId, testBedtime]);

  // Nettoyage au démontage : arrêter le test si actif
  useEffect(() => {
    return () => {
      if (isTestActive && kidooId) {
        testBedtime.mutate({
          id: kidooId,
          action: 'stop',
        });
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <Button
        title={
          isTestActive
            ? t('kidoos.dream.bedtime.stopTest', { defaultValue: 'Arrêter le test' })
            : t('kidoos.dream.bedtime.test', { defaultValue: 'Tester' })
        }
        variant={isTestActive ? 'primary' : 'outline'}
        onPress={handlePress}
        style={styles.button}
        fullWidth
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 20,
    paddingVertical: 10,
  },
  button: {
    width: '100%',
  },
});
