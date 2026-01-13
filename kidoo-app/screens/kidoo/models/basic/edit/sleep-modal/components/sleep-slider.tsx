/**
 * Slider vertical pour régler le timeout de sommeil
 * Utilise le composant générique VerticalSlider
 */

import React from 'react';
import { Animated } from 'react-native';
import { VerticalSlider } from '@/components/ui/vertical-slider';
import { kidooActionsService } from '@/services/kidooActionsService';
import type { Kidoo } from '@/services/kidooService';

const MIN_TIMEOUT = 5000; // Minimum 5 secondes
const MAX_TIMEOUT = 300000; // Maximum 5 minutes (300 secondes)
const TIMEOUT_STEP = 5000; // Pas d'arrondi (5 secondes)

interface SleepSliderProps {
  timeout: number; // Timeout en millisecondes
  onTimeoutChange: (value: number) => void;
  onDraggingChange: (isDragging: boolean) => void;
  panY: Animated.Value;
  kidoo: Kidoo;
  isDragging?: boolean;
}

export function SleepSlider({
  timeout,
  onTimeoutChange,
  onDraggingChange,
  panY,
  kidoo,
  isDragging = false,
}: SleepSliderProps) {
  const handleValueCommit = (value: number) => {
    const actions = kidooActionsService.forKidoo(kidoo);
    actions.setSleepTimeout({ timeout: value });
  };

  return (
    <VerticalSlider
      value={timeout}
      min={MIN_TIMEOUT}
      max={MAX_TIMEOUT}
      step={TIMEOUT_STEP}
      onValueChange={onTimeoutChange}
      onDraggingChange={onDraggingChange}
      panY={panY}
      isDragging={isDragging}
      thumbIcon="moon.fill"
      marks={[5000, 30000, 60000, 120000, 300000]}
      onValueCommit={handleValueCommit}
    />
  );
}
