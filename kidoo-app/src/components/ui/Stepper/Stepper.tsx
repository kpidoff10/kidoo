/**
 * Stepper Component
 * Composant réutilisable pour afficher des étapes avec indicateurs visuels
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../Typography/Text';
import { useTheme } from '@/theme';

export interface StepperStep {
  /**
   * Titre de l'étape
   */
  title: string;
  
  /**
   * Description optionnelle de l'étape
   */
  description?: string;
  
  /**
   * Si true, l'étape est complétée
   */
  completed?: boolean;
  
  /**
   * Si true, l'étape est active (en cours)
   */
  active?: boolean;
  
  /**
   * Icône pour l'étape (nom d'icône Ionicons)
   */
  icon?: keyof typeof Ionicons.glyphMap;
  
  /**
   * Contenu personnalisé pour l'étape
   */
  content?: React.ReactNode;
}

export interface StepperProps {
  /**
   * Liste des étapes
   */
  steps: StepperStep[];
  
  /**
   * Index de l'étape active (0-based)
   * Si non fourni, utilise la propriété active des steps
   */
  activeStep?: number;
  
  /**
   * Orientation du stepper
   * 'horizontal' : affichage horizontal (par défaut)
   * 'vertical' : affichage vertical
   */
  orientation?: 'horizontal' | 'vertical';
  
  /**
   * Style personnalisé pour le conteneur
   */
  style?: View['props']['style'];
}

/**
 * Composant Stepper pour afficher des étapes avec indicateurs visuels
 * 
 * @example
 * ```tsx
 * <Stepper
 *   steps={[
 *     { title: 'Étape 1', completed: true, icon: 'checkmark' },
 *     { title: 'Étape 2', active: true, icon: 'settings' },
 *     { title: 'Étape 3', icon: 'flag' },
 *   ]}
 * />
 * ```
 */
export function Stepper({ steps, activeStep, orientation = 'horizontal', style }: StepperProps) {
  const { colors, spacing } = useTheme();
  
  // Déterminer l'étape active si fournie via prop
  const currentActiveStep = activeStep !== undefined ? activeStep : 
    steps.findIndex((step) => step.active);
  
  const isHorizontal = orientation === 'horizontal';
  
  if (isHorizontal) {
    return (
      <View style={[styles.horizontalContainer, style]}>
        {steps.map((step, index) => {
          const isActive = index === currentActiveStep || step.active;
          const isCompleted = step.completed || index < currentActiveStep;
          const isLast = index === steps.length - 1;
          
          return (
            <React.Fragment key={index}>
              <View style={styles.horizontalStepContainer}>
                {/* Indicateur d'étape */}
                <View
                  style={[
                    styles.horizontalStepIndicator,
                    {
                      backgroundColor: isCompleted
                        ? colors.primary
                        : isActive
                        ? colors.primary + '20'
                        : colors.border,
                      borderColor: isActive ? colors.primary : colors.border,
                    },
                  ]}
                >
                  {isCompleted ? (
                    <Ionicons name="checkmark" size={20} color={colors.textInverse} />
                  ) : step.icon ? (
                    <Ionicons 
                      name={step.icon} 
                      size={20} 
                      color={isActive ? colors.primary : colors.textTertiary} 
                    />
                  ) : (
                    <Text
                      variant="caption"
                      style={{
                        color: isActive ? colors.textInverse : colors.textTertiary,
                        fontWeight: 'bold',
                        fontSize: 14,
                      }}
                    >
                      {index + 1}
                    </Text>
                  )}
                </View>
                
                {/* Titre de l'étape */}
                <Text
                  variant="caption"
                  color={isActive ? 'primary' : isCompleted ? 'secondary' : 'tertiary'}
                  style={{ 
                    fontWeight: isActive ? '600' : 'normal',
                    marginTop: spacing[1],
                    textAlign: 'center',
                  }}
                  numberOfLines={1}
                >
                  {step.title}
                </Text>
              </View>
              
              {/* Ligne de connexion horizontale */}
              {!isLast && (
                <View
                  style={[
                    styles.horizontalConnector,
                    {
                      backgroundColor: isCompleted
                        ? colors.primary
                        : colors.border,
                    },
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    );
  }
  
  // Version verticale (code original)
  return (
    <View style={[styles.container, style]}>
      {steps.map((step, index) => {
        const isActive = index === currentActiveStep || step.active;
        const isCompleted = step.completed || index < currentActiveStep;
        const isLast = index === steps.length - 1;
        
        return (
          <View key={index} style={styles.stepContainer}>
            {/* Ligne de connexion */}
            {!isLast && (
              <View
                style={[
                  styles.connector,
                  {
                    backgroundColor: isCompleted
                      ? colors.primary
                      : colors.border,
                  },
                ]}
              />
            )}
            
            {/* Indicateur d'étape */}
            <View
              style={[
                styles.stepIndicator,
                {
                  backgroundColor: isCompleted
                    ? colors.primary
                    : isActive
                    ? colors.primary + '20'
                    : colors.border,
                  borderColor: isActive ? colors.primary : colors.border,
                },
              ]}
            >
              {isCompleted ? (
                <Ionicons name="checkmark" size={16} color={colors.textInverse} />
              ) : step.icon ? (
                <Ionicons 
                  name={step.icon} 
                  size={16} 
                  color={isActive ? colors.primary : colors.textTertiary} 
                />
              ) : (
                <View
                  style={[
                    styles.stepNumber,
                    {
                      backgroundColor: isActive ? colors.primary : 'transparent',
                    },
                  ]}
                >
                  {isActive ? (
                    <Text
                      variant="caption"
                      style={{
                        color: colors.textInverse,
                        fontWeight: 'bold',
                      }}
                    >
                      {index + 1}
                    </Text>
                  ) : (
                    <Text
                      variant="caption"
                      style={{
                        color: colors.textTertiary,
                      }}
                    >
                      {index + 1}
                    </Text>
                  )}
                </View>
              )}
            </View>
            
            {/* Contenu de l'étape */}
            <View style={styles.stepContent}>
              <Text
                variant="body"
                color={isActive ? 'primary' : isCompleted ? 'secondary' : 'tertiary'}
                style={{ fontWeight: isActive ? '600' : 'normal' }}
              >
                {step.title}
              </Text>
              {step.description && (
                <Text
                  variant="caption"
                  color="tertiary"
                  style={{ marginTop: spacing[1] }}
                >
                  {step.description}
                </Text>
              )}
              {step.content && (
                <View style={{ marginTop: spacing[3] }}>{step.content}</View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  horizontalStepContainer: {
    alignItems: 'center',
    flex: 1,
    minWidth: 60,
  },
  horizontalStepIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  horizontalConnector: {
    flex: 1,
    height: 2,
    marginHorizontal: 8,
    marginTop: -20, // Aligner avec le centre de l'indicateur
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  connector: {
    position: 'absolute',
    left: 15,
    top: 32,
    width: 2,
    height: '100%',
    minHeight: 24,
  },
  stepIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    zIndex: 1,
  },
  stepNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepContent: {
    flex: 1,
    paddingTop: 4,
  },
});
