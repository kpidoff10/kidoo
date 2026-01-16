/**
 * Modale pour régler le timeout de sommeil du Kidoo
 * Jauge verticale similaire au réglage de la luminosité
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { BottomSheet, type BottomSheetModalRef } from '@/components/ui/bottom-sheet';
import { useBasicGetSleepTimeout } from '@/services/models/basic/hooks/use-basic-sleep-timeout';
import { SleepHeader, SleepSlider } from './components';

const MIN_TIMEOUT = 5000; // Minimum 5 secondes
const MAX_TIMEOUT = 300000; // Maximum 5 minutes (300 secondes)
const SLIDER_HEIGHT = 300; // Hauteur de la jauge

// Fonction utilitaire pour convertir le timeout en position Y (utilisée pour le chargement initial)
const timeoutToY = (value: number) => {
  const percentage = (value - MIN_TIMEOUT) / (MAX_TIMEOUT - MIN_TIMEOUT);
  return (1 - percentage) * SLIDER_HEIGHT; // Inversé car haut = max
};

interface SleepModalProps {
  bottomSheetRef: React.RefObject<BottomSheetModalRef | null>;
}

export const SleepModal = ({ bottomSheetRef }: SleepModalProps) => {
  const { data: sleepTimeoutData, isLoading, refetch } = useBasicGetSleepTimeout();
  const [sleepTimeout, setSleepTimeout] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const panY = useRef(new Animated.Value(0)).current;

  // Mettre à jour le timeout et la position du slider quand les données changent
  useEffect(() => {
    if (sleepTimeoutData?.sleepTimeout !== undefined) {
      setSleepTimeout(sleepTimeoutData.sleepTimeout);
      const initialY = timeoutToY(sleepTimeoutData.sleepTimeout);
      panY.setValue(initialY);
    }
  }, [sleepTimeoutData, panY]);

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
        if (sleepTimeoutData?.sleepTimeout !== undefined) {
          const initialY = timeoutToY(sleepTimeoutData.sleepTimeout);
          panY.setValue(initialY);
        }
      }}
      enablePanDownToClose={!isDragging}
      enableHandlePanningGesture={!isDragging}
    >
      <View style={styles.container}>
        <SleepHeader sleepTimeout={sleepTimeout} isLoading={isLoading} />

        <SleepSlider
          sleepTimeout={sleepTimeout}
          onSleepTimeoutChange={setSleepTimeout}
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
