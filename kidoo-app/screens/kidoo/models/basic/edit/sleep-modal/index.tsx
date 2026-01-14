/**
 * Modale pour régler le timeout de sommeil du Kidoo
 * Jauge verticale similaire au réglage de la luminosité
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { BottomSheet, type BottomSheetModalRef } from '@/components/ui/bottom-sheet';
import { kidooActionsService } from '@/services/kidooActionsService';
import { bleManager } from '@/services/bte';
import { useKidooEditBluetooth } from '../../../kidoo-edit-bluetooth-context';
import { SleepHeader, SleepSlider } from './components';
import type { Kidoo } from '@/services/kidooService';

const MIN_TIMEOUT = 5000; // Minimum 5 secondes
const MAX_TIMEOUT = 300000; // Maximum 5 minutes (300 secondes)
const SLIDER_HEIGHT = 300; // Hauteur de la jauge
const DEFAULT_TIMEOUT = 30000; // Valeur par défaut 30 secondes

interface SleepModalProps {
  kidoo: Kidoo;
  initialTimeout?: number;
  onDismiss?: () => void;
}

// Fonction utilitaire pour convertir le timeout en position Y (utilisée pour le chargement initial)
const timeoutToY = (value: number) => {
  const percentage = (value - MIN_TIMEOUT) / (MAX_TIMEOUT - MIN_TIMEOUT);
  return (1 - percentage) * SLIDER_HEIGHT; // Inversé car haut = max
};

export const SleepModal = React.forwardRef<BottomSheetModalRef, SleepModalProps>(
  ({ kidoo, initialTimeout = DEFAULT_TIMEOUT, onDismiss }, ref) => {
    const [timeout, setTimeoutValue] = useState(initialTimeout);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoadingTimeout, setIsLoadingTimeout] = useState(false);
    const panY = useRef(new Animated.Value(0)).current;
    const shouldLoadTimeout = useRef(true);
    const { isConnected } = useKidooEditBluetooth();

    // Fonction pour charger le timeout actuel depuis l'ESP32
    const loadCurrentTimeout = useCallback(async () => {
      // Vérifier directement l'état de connexion avec bleManager
      if (!bleManager.isConnected()) {
        console.log('[SleepModal] Kidoo non connecté, utilisation de la valeur par défaut');
        return;
      }

      setIsLoadingTimeout(true);
      try {
        const actions = kidooActionsService.forKidoo(kidoo);
        const result = await actions.getSleepTimeout();

        if (result.success && (result as any).data && typeof (result as any).data.timeout === 'number') {
          const currentTimeout = (result as any).data.timeout;
          setTimeoutValue(currentTimeout);
          // Mettre à jour la position du curseur
          const initialY = timeoutToY(currentTimeout);
          panY.setValue(initialY);
        } else {
          console.error('[SleepModal] Erreur lors de la récupération du timeout:', result.error);
        }
      } catch (error) {
        console.error('[SleepModal] Erreur lors du chargement du timeout:', error);
      } finally {
        setIsLoadingTimeout(false);
      }
    }, [kidoo, panY]);

    // Charger le timeout quand la modale s'ouvre ET que le Kidoo est connecté
    useEffect(() => {
      // Utiliser isConnected du contexte pour savoir si la connexion est établie
      if (!isConnected || !shouldLoadTimeout.current) {
        return;
      }

      // Attendre un court délai pour s'assurer que la modale est ouverte et la connexion stable
      const timer = setTimeout(() => {
        loadCurrentTimeout();
        shouldLoadTimeout.current = false;
      }, 500); // Délai pour laisser le temps à la connexion de se stabiliser

      return () => {
        clearTimeout(timer);
      };
    }, [isConnected, loadCurrentTimeout]);

    return (
      <BottomSheet
        ref={ref}
        onDismiss={() => {
          // Réinitialiser le flag de chargement quand la modale se ferme
          setIsLoadingTimeout(false);
          shouldLoadTimeout.current = true;
          onDismiss?.();
        }}
        enablePanDownToClose={!isDragging}
        enableHandlePanningGesture={!isDragging}
      >
        <View style={styles.container}>
          <SleepHeader timeout={timeout} isLoading={isLoadingTimeout} />

          <SleepSlider
            timeout={timeout}
            onTimeoutChange={setTimeoutValue}
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

SleepModal.displayName = 'SleepModal';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
});
