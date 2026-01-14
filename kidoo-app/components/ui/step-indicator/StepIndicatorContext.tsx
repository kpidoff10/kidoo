/**
 * Contexte pour gérer l'état du Step Indicator
 */

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface StepIndicatorContextValue {
  currentStep: number;
  totalSteps: number;
  completedSteps: Set<number>;
  setCurrentStep: (step: number) => void;
  setTotalSteps: (steps: number) => void;
  markStepCompleted: (step: number) => void;
  markStepIncomplete: (step: number) => void;
  resetSteps: () => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  isStepCompleted: (step: number) => boolean;
  isStepActive: (step: number) => boolean;
}

const StepIndicatorContext = createContext<StepIndicatorContextValue | undefined>(undefined);

interface StepIndicatorProviderProps {
  totalSteps: number;
  initialStep?: number;
  children: ReactNode;
}

export function StepIndicatorProvider({
  totalSteps: initialTotalSteps,
  initialStep = 1,
  children,
}: StepIndicatorProviderProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [totalSteps, setTotalSteps] = useState(initialTotalSteps);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const markStepCompleted = useCallback((step: number) => {
    setCompletedSteps((prev) => new Set([...prev, step]));
  }, []);

  const markStepIncomplete = useCallback((step: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.delete(step);
      return next;
    });
  }, []);

  const resetSteps = useCallback(() => {
    setCurrentStep(initialStep);
    setCompletedSteps(new Set());
  }, [initialStep]);

  const goToNextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  }, [totalSteps]);

  const goToPreviousStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const isStepCompleted = useCallback(
    (step: number) => {
      return completedSteps.has(step) || step < currentStep;
    },
    [completedSteps, currentStep]
  );

  const isStepActive = useCallback(
    (step: number) => {
      return step === currentStep;
    },
    [currentStep]
  );

  const value: StepIndicatorContextValue = {
    currentStep,
    totalSteps,
    completedSteps,
    setCurrentStep,
    setTotalSteps,
    markStepCompleted,
    markStepIncomplete,
    resetSteps,
    goToNextStep,
    goToPreviousStep,
    isStepCompleted,
    isStepActive,
  };

  return <StepIndicatorContext.Provider value={value}>{children}</StepIndicatorContext.Provider>;
}

export function useStepIndicator() {
  const context = useContext(StepIndicatorContext);
  if (context === undefined) {
    throw new Error('useStepIndicator must be used within a StepIndicatorProvider');
  }
  return context;
}
