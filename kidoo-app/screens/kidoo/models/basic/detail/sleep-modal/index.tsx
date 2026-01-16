/**
 * Modale pour régler le timeout de sommeil du Kidoo
 * Jauge verticale similaire au réglage de la luminosité
 */

import React, { useState, useCallback, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { BottomSheet, type BottomSheetModalRef } from '@/components/ui/bottom-sheet';
import { useBasicKidoo } from '@/services/models/basic/contexts/BasicKidooContext';
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
    const { isConnected, getSleepTimeout } = useBasicKidoo();
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const panY = useRef(new Animated.Value(0)).current;
    const shouldLoadTimeout = useRef(true);

    // Fonction pour charger le timeout actuel depuis l'ESP32
    const loadCurrentTimeout = useCallback(() => {
      if (!isConnected) {
        console.log('[SleepModal] Kidoo non connecté, utilisation de la valeur par défaut');
        return;
      }

      setIsLoading(true);
      getSleepTimeout()
        .then((currentTimeout) => {
          // Mettre à jour la position du curseur
          const initialY = timeoutToY(currentTimeout);
          panY.setValue(initialY);
        
        })
        .catch((error) => {
            console.error('[SleepModal] Erreur lors du chargement du timeout:', error);
        })
        .finally(() => {
          // Ne mettre à jour l'état que si le composant est toujours monté
        
          setIsLoading(false);
      
        });
    }, [isConnected, getSleepTimeout, panY]);

    // Fonction appelée quand la modale s'ouvre
    const handleOpen = useCallback(() => {
      if (isConnected && shouldLoadTimeout.current) {
        loadCurrentTimeout();
        shouldLoadTimeout.current = false;
      }
    }, [isConnected, loadCurrentTimeout]);

    return (
      <BottomSheet
        ref={bottomSheetRef}
        onOpen={handleOpen}
        onDismiss={() => {
          // Marquer le composant comme démonté pour éviter les mises à jour d'état
        
          // Réinitialiser le flag de chargement quand la modale se ferme
          setIsLoading(true);
          shouldLoadTimeout.current = true;
        }}
        enablePanDownToClose={!isDragging}
        enableHandlePanningGesture={!isDragging}
      >
        <View style={styles.container}>
          <SleepHeader isLoading={isLoading} />

          <SleepSlider
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
