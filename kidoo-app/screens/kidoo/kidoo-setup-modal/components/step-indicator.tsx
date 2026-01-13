/**
 * Step Indicator Component
 * Affiche la progression dans le stepper avec icônes
 */

import React from 'react';
import { View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/hooks/use-theme';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  isStep3Completed?: boolean;
}

const STEP_ICONS: Record<number, keyof typeof MaterialIcons.glyphMap> = {
  1: 'edit',
  2: 'wifi',
  3: 'check-circle',
};

export function StepIndicator({ currentStep, totalSteps, isStep3Completed = false }: StepIndicatorProps) {
  const theme = useTheme();

  return (
    <View style={theme.components.setupStepIndicator}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        // L'étape est complétée si elle est passée OU si c'est l'étape 3 et qu'elle est validée
        const isCompleted = stepNumber < currentStep || (stepNumber === 3 && isStep3Completed);
        const iconName = STEP_ICONS[stepNumber] || 'circle';

        return (
          <React.Fragment key={stepNumber}>
            <View
              style={[
                theme.components.setupStepIndicatorCircle,
                isActive && theme.components.setupStepIndicatorCircleActive,
                isCompleted && theme.components.setupStepIndicatorCircleCompleted,
              ]}
            >
              {isCompleted ? (
                <MaterialIcons
                  name="check"
                  size={20}
                  color={theme.colors.background}
                />
              ) : (
                <MaterialIcons
                  name={iconName}
                  size={18}
                  color={
                    isActive
                      ? theme.colors.background
                      : theme.colors.textSecondary
                  }
                />
              )}
            </View>
            {index < totalSteps - 1 && (
              <View
                style={[
                  theme.components.setupStepIndicatorLine,
                  isCompleted && theme.components.setupStepIndicatorLineCompleted,
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}
