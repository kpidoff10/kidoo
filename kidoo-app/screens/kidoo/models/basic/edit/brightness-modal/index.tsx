/**
 * Modale pour régler la luminosité du Kidoo
 * Jauge verticale similaire au réglage du flash
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { BottomSheet, type BottomSheetModalRef } from '@/components/ui/bottom-sheet';
import { bleManager } from '@/services/bte';
import { BrightnessHeader, BrightnessSlider } from './components';
import type { Kidoo } from '@/services/kidooService';

const MIN_BRIGHTNESS = 10; // Luminosité minimale (10%)
const MAX_BRIGHTNESS = 100; // Luminosité maximale (100%)
const SLIDER_HEIGHT = 300; // Hauteur de la jauge

interface BrightnessModalProps {
  kidoo: Kidoo;
  initialBrightness?: number;
  onDismiss?: () => void;
}

// Fonction utilitaire pour convertir la luminosité en position Y (utilisée pour le chargement initial)
const brightnessToY = (value: number) => {
  const percentage = (value - MIN_BRIGHTNESS) / (MAX_BRIGHTNESS - MIN_BRIGHTNESS);
  return (1 - percentage) * SLIDER_HEIGHT; // Inversé car haut = 100%
};

export const BrightnessModal = React.forwardRef<BottomSheetModalRef, BrightnessModalProps>(
  ({ kidoo, initialBrightness = 100, onDismiss }, ref) => {
    const [brightness, setBrightness] = useState(initialBrightness);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoadingBrightness, setIsLoadingBrightness] = useState(false);
    const panY = useRef(new Animated.Value(0)).current;
    const shouldLoadBrightness = useRef(true);

    // Fonction pour charger la luminosité actuelle depuis l'ESP32
    const loadCurrentBrightness = useCallback(async () => {
      // Vérifier directement l'état de connexion avec bleManager
      if (!bleManager.isConnected()) {
        console.log('[BrightnessModal] Kidoo non connecté, utilisation de la valeur par défaut');
        return;
      }

      setIsLoadingBrightness(true);
      try {
        const response = await bleManager.getBrightness({
          timeout: 5000,
          timeoutErrorMessage: 'Timeout: aucune réponse reçue pour BRIGHTNESS_GET',
        });

        if (response.status === 'success' && typeof response.brightness === 'number') {
          const currentBrightness = response.brightness;
          setBrightness(currentBrightness);
          // Mettre à jour la position du curseur
          const initialY = brightnessToY(currentBrightness);
          panY.setValue(initialY);
        } else {
          console.error('[BrightnessModal] Erreur lors de la récupération de la luminosité:', response.error);
        }
      } catch (error) {
        console.error('[BrightnessModal] Erreur lors du chargement de la luminosité:', error);
      } finally {
        setIsLoadingBrightness(false);
      }
    }, [panY]);

    // Charger la luminosité quand la modale s'ouvre ET que le Kidoo est connecté
    useEffect(() => {
      // Vérifier directement l'état de connexion avec bleManager
      if (!bleManager.isConnected() || !shouldLoadBrightness.current) {
        return;
      }

      // Attendre un court délai pour s'assurer que la modale est ouverte et la connexion stable
      const timer = setTimeout(() => {
        loadCurrentBrightness();
        shouldLoadBrightness.current = false;
      }, 300);

      return () => {
        clearTimeout(timer);
      };
    }, [loadCurrentBrightness]);

    return (
      <BottomSheet
        ref={ref}
        onDismiss={() => {
          // Réinitialiser le flag de chargement quand la modale se ferme
          setIsLoadingBrightness(false);
          shouldLoadBrightness.current = true;
          onDismiss?.();
        }}
        enablePanDownToClose={!isDragging}
        enableHandlePanningGesture={!isDragging}
      >
        <View style={styles.container}>
          <BrightnessHeader brightness={brightness} isLoading={isLoadingBrightness} />

          <BrightnessSlider
            brightness={brightness}
            onBrightnessChange={setBrightness}
            onDraggingChange={setIsDragging}
            panY={panY}
            kidoo={kidoo}
            isDragging={isDragging}
          />
        </View>
      </BottomSheet>
    );
  }
);

BrightnessModal.displayName = 'BrightnessModal';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
});
