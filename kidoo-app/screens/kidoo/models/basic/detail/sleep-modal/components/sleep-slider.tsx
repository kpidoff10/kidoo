/**
 * Slider vertical pour régler le timeout de sommeil
 * Utilise le composant générique VerticalSlider
 */

import { Animated } from 'react-native';
import { VerticalSlider } from '@/components/ui/vertical-slider';
import { useBasicKidoo } from '@/services/models/basic/contexts/BasicKidooContext';
import { useEffect, useState } from 'react';

const MIN_TIMEOUT = 5000; // Minimum 5 secondes
const MAX_TIMEOUT = 300000; // Maximum 5 minutes (300 secondes)
const TIMEOUT_STEP = 5000; // Pas d'arrondi (5 secondes)

interface SleepSliderProps {
  onDraggingChange: (isDragging: boolean) => void;
  panY: Animated.Value;
  isDragging?: boolean;
  isLoading?: boolean;
}

export function SleepSlider({
  onDraggingChange,
  panY,
  isDragging = false,
  isLoading = false,
}: SleepSliderProps) {
  const { setSleepTimeout, getSleepTimeout } = useBasicKidoo();
  const [timeout, setTimeoutValue] = useState(0);

  const handleValueCommit = (value: number) => {
    setSleepTimeout({ timeout: value })
      .catch((error) => {
        console.error('[SleepSlider] Erreur lors de la définition du timeout:', error);
      });
  };

  useEffect(() => {
    getSleepTimeout().then((timeout) => {
      setTimeoutValue(timeout);
    });
  }, [getSleepTimeout]);

  const handleValueChange = (value: number) => {
    setTimeoutValue(value);
  };

  return (
    <VerticalSlider
      value={timeout}
      min={MIN_TIMEOUT}
      max={MAX_TIMEOUT}
      step={TIMEOUT_STEP}
      onValueChange={handleValueChange}
      onDraggingChange={onDraggingChange}
      panY={panY}
      isDragging={isDragging}
      thumbIcon="moon.fill"
      marks={[5000, 30000, 60000, 120000, 300000]}
      onValueCommit={handleValueCommit}
      isLoading={isLoading}
    />
  );
}
