/**
 * Modale pour régler la luminosité du Kidoo
 * Jauge verticale similaire au réglage du flash
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { BottomSheet, type BottomSheetModalRef } from '@/components/ui/bottom-sheet';
import { useBasicGetBrightness } from '@/services/models/basic/hooks/use-basic-brightness';
import { BrightnessHeader, BrightnessSlider } from './components';

const MIN_BRIGHTNESS = 10; // Luminosité minimale (10%)
const MAX_BRIGHTNESS = 100; // Luminosité maximale (100%)
const SLIDER_HEIGHT = 300; // Hauteur de la jauge

// Fonction utilitaire pour convertir la luminosité en position Y (utilisée pour le chargement initial)
const brightnessToY = (value: number) => {
  const percentage = (value - MIN_BRIGHTNESS) / (MAX_BRIGHTNESS - MIN_BRIGHTNESS);
  return (1 - percentage) * SLIDER_HEIGHT; // Inversé car haut = 100%
};

interface BrightnessModalProps {
  bottomSheetRef: React.RefObject<BottomSheetModalRef | null>;
}

export const BrightnessModal = ({ bottomSheetRef }: BrightnessModalProps) => {
  const { data: brightnessData, isLoading, refetch } = useBasicGetBrightness();
    const [brightness, setBrightness] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const panY = useRef(new Animated.Value(0)).current;

  // Mettre à jour la luminosité et la position du slider quand les données changent
  useEffect(() => {
    if (brightnessData?.brightness !== undefined) {
      setBrightness(brightnessData.brightness);
      const initialY = brightnessToY(brightnessData.brightness);
          panY.setValue(initialY);
    }
  }, [brightnessData, panY]);

    // Fonction appelée quand la modale s'ouvre
    const handleOpen = useCallback(() => {
    refetch();
  }, [refetch]);

    return (
      <BottomSheet
        ref={bottomSheetRef}
        onOpen={handleOpen}
        onDismiss={() => {
        // Réinitialiser la position du slider quand la modale se ferme
        if (brightnessData?.brightness !== undefined) {
          const initialY = brightnessToY(brightnessData.brightness);
          panY.setValue(initialY);
        }
        }}
        enablePanDownToClose={!isDragging}
        enableHandlePanningGesture={!isDragging}
      >
        <View style={styles.container}>
        <BrightnessHeader brightness={brightness} isLoading={isLoading} />

          <BrightnessSlider
            brightness={brightness}
            onBrightnessChange={setBrightness}
            onDraggingChange={setIsDragging}
            panY={panY}
            isDragging={isDragging}
          isLoading={isLoading}
          />
        </View>
      </BottomSheet>
    );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
});
