/**
 * Modale pour régler la luminosité du Kidoo
 * Jauge verticale similaire au réglage du flash
 */

import React, { useState, useCallback, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { BottomSheet, type BottomSheetModalRef } from '@/components/ui/bottom-sheet';
import { useBasicKidoo } from '@/contexts/BasicKidooContext';
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
    const { isConnected, getBrightness } = useBasicKidoo();
    const [brightness, setBrightness] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoadingBrightness, setIsLoadingBrightness] = useState(true);
    const panY = useRef(new Animated.Value(0)).current;
    const shouldLoadBrightness = useRef(true);

    // Fonction pour charger la luminosité actuelle depuis l'ESP32
    const loadCurrentBrightness = useCallback(() => {
      if (!isConnected) {
        console.log('[BrightnessModal] Kidoo non connecté, utilisation de la valeur par défaut');
        return;
      }

      setIsLoadingBrightness(true);
      getBrightness()
        .then((currentBrightness) => {
          setBrightness(currentBrightness);
          const initialY = brightnessToY(currentBrightness);
          panY.setValue(initialY);
        
        })
        .catch((error) => {
    
            console.error('[BrightnessModal] Erreur lors du chargement de la luminosité:', error);
          
        })
        .finally(() => {
          // Ne mettre à jour l'état que si le composant est toujours monté
        
          setIsLoadingBrightness(false);
      
        });
    }, [isConnected, getBrightness, panY]);

    // Fonction appelée quand la modale s'ouvre
    const handleOpen = useCallback(() => {
      if (isConnected && shouldLoadBrightness.current) {
        loadCurrentBrightness();
        shouldLoadBrightness.current = false;
      }
    }, [isConnected, loadCurrentBrightness]);

    return (
      <BottomSheet
        ref={bottomSheetRef}
        onOpen={handleOpen}
        onDismiss={() => {
          // Marquer le composant comme démonté pour éviter les mises à jour d'état
        
          // Réinitialiser le flag de chargement quand la modale se ferme
          setIsLoadingBrightness(true);
          shouldLoadBrightness.current = true;
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
            isDragging={isDragging}
            isLoading={isLoadingBrightness}
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
