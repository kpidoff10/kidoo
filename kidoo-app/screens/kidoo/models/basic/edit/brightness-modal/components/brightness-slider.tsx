/**
 * Slider vertical pour régler la luminosité
 * Utilise le composant générique VerticalSlider
 */

import React from 'react';
import { Animated } from 'react-native';
import { VerticalSlider } from '@/components/ui/vertical-slider';
import { kidooActionsService } from '@/services/kidooActionsService';
import type { Kidoo } from '@/services/kidooService';

const MIN_BRIGHTNESS = 10; // Luminosité minimale (10%)
const MAX_BRIGHTNESS = 100; // Luminosité maximale (100%)
const BRIGHTNESS_STEP = 5; // Pas d'arrondi (5%)

interface BrightnessSliderProps {
  brightness: number;
  onBrightnessChange: (value: number) => void;
  onDraggingChange: (isDragging: boolean) => void;
  panY: Animated.Value;
  kidoo: Kidoo;
  isDragging?: boolean;
}

export function BrightnessSlider({
  brightness,
  onBrightnessChange,
  onDraggingChange,
  panY,
  kidoo,
  isDragging = false,
}: BrightnessSliderProps) {
  const handleValueCommit = (value: number) => {
    const actions = kidooActionsService.forKidoo(kidoo);
    actions.setBrightness({ percent: value });
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
    />
  );
}
