/**
 * Composant générique Step Indicator
 * Affiche la progression dans un stepper avec icônes personnalisables
 */

import React from 'react';
import { View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/hooks/use-theme';
import { useStepIndicator } from './StepIndicatorContext';

export interface StepIcon {
  name: keyof typeof MaterialIcons.glyphMap;
}

export interface StepIndicatorProps {
  /**
   * Icônes personnalisées pour chaque étape
   * Si non fourni, utilise les icônes par défaut
   */
  icons?: Record<number, keyof typeof MaterialIcons.glyphMap>;
  /**
   * Étape spécifique marquée comme complétée (optionnel)
   * Utile pour marquer une étape finale comme complétée avant de passer à la suivante
   */
  specificCompletedStep?: number;
}

const DEFAULT_ICONS: Record<number, keyof typeof MaterialIcons.glyphMap> = {
  1: 'circle',
  2: 'circle',
  3: 'check-circle',
};

export function StepIndicator({ icons, specificCompletedStep }: StepIndicatorProps) {
  const theme = useTheme();
  const { currentStep, totalSteps, isStepCompleted, isStepActive } = useStepIndicator();

  const stepIcons = icons || DEFAULT_ICONS;

  return (
    <View style={theme.components.setupStepIndicator}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = isStepActive(stepNumber);
        // L'étape est complétée si elle est dans completedSteps, ou si c'est une étape précédente
        // ou si c'est l'étape spécifique marquée comme complétée
        const isCompleted =
          isStepCompleted(stepNumber) || (specificCompletedStep === stepNumber && stepNumber === totalSteps);
        const iconName = stepIcons[stepNumber] || 'circle';

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
                <MaterialIcons name="check" size={20} color={theme.colors.background} />
              ) : (
                <MaterialIcons
                  name={iconName}
                  size={18}
                  color={isActive ? theme.colors.background : theme.colors.textSecondary}
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
