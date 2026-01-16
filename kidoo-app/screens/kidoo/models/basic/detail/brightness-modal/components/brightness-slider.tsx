/**
 * Slider vertical pour régler la luminosité
 * Utilise le composant générique VerticalSlider
 */

import { Animated } from 'react-native';
import { VerticalSlider } from '@/components/ui/vertical-slider';
import { useBasicKidoo } from '@/services/models/basic/contexts/BasicKidooContext';

const MIN_BRIGHTNESS = 10; // Luminosité minimale (10%)
const MAX_BRIGHTNESS = 100; // Luminosité maximale (100%)
const BRIGHTNESS_STEP = 5; // Pas d'arrondi (5%)

interface BrightnessSliderProps {
  brightness: number;
  onBrightnessChange: (value: number) => void;
  onDraggingChange: (isDragging: boolean) => void;
  panY: Animated.Value;
  isDragging?: boolean;
  isLoading?: boolean;
}

export function BrightnessSlider({
  brightness,
  onBrightnessChange,
  onDraggingChange,
  panY,
  isDragging = false,
  isLoading = false,
}: BrightnessSliderProps) {
  const { setBrightness } = useBasicKidoo();

  const handleValueCommit = (value: number) => {
    setBrightness({ percent: value })
      .catch((error) => {
        console.error('[BrightnessSlider] Erreur lors de la définition de la luminosité:', error);
      });
  };

  return (
    <VerticalSlider
      value={brightness}
      min={MIN_BRIGHTNESS}
      max={MAX_BRIGHTNESS}
      step={BRIGHTNESS_STEP}
      onValueChange={onBrightnessChange}
      onDraggingChange={onDraggingChange}
      panY={panY}
      isDragging={isDragging}
      thumbIcon="sun.max.fill"
      marks={[10, 25, 50, 75, 100]}
      onValueCommit={handleValueCommit}
      isLoading={isLoading}
    />
  );
}
