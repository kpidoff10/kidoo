/**
 * Slider vertical pour régler le timeout de sommeil
 * Utilise le composant générique VerticalSlider
 */

import { Animated } from 'react-native';
import { VerticalSlider } from '@/components/ui/vertical-slider';
import { useBasicSetSleepTimeout } from '@/services/models/basic/hooks/use-basic-sleep-timeout';

const MIN_TIMEOUT = 5000; // Minimum 5 secondes
const MAX_TIMEOUT = 300000; // Maximum 5 minutes (300 secondes)
const TIMEOUT_STEP = 5000; // Pas d'arrondi (5 secondes)

interface SleepSliderProps {
  sleepTimeout: number;
  onSleepTimeoutChange: (timeout: number) => void;
  onDraggingChange: (isDragging: boolean) => void;
  panY: Animated.Value;
  isDragging?: boolean;
  isLoading?: boolean;
}

export function SleepSlider({
  sleepTimeout,
  onSleepTimeoutChange,
  onDraggingChange,
  panY,
  isDragging = false,
  isLoading = false,
}: SleepSliderProps) {
  const { mutate: setSleepTimeout } = useBasicSetSleepTimeout();

  const handleValueCommit = (value: number) => {
    setSleepTimeout(
      { timeout: value },
      {
        onError: (error) => {
        console.error('[SleepSlider] Erreur lors de la définition du timeout:', error);
        },
      }
    );
  };

  const handleValueChange = (value: number) => {
    onSleepTimeoutChange(value);
  };

  return (
    <VerticalSlider
      value={sleepTimeout}
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
