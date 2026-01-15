/**
 * Composant pour ajouter du contenu multimédia à un tag avec stepper en 3 étapes
 */

import React from 'react';
import { View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { BottomSheet, type BottomSheetModalRef } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { StepIndicatorProvider, StepIndicator, useStepIndicator } from '@/components/ui/step-indicator';
import { MultimediaProvider, useMultimedia } from './MultimediaContext';
import { MultimediaStep1, MultimediaStep2, MultimediaStep3 } from './components';

const TOTAL_STEPS = 3;

export interface MultimediaSheetProps {
  onDismiss?: () => void;
}

// Composant interne qui utilise le contexte
const MultimediaSheetContent = React.forwardRef<BottomSheetModalRef, MultimediaSheetProps>(
  (props, ref) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const { currentStep } = useStepIndicator();
    const { handleNext, handlePrevious, handleOpen, handleFinish, isProcessing, acceptTerms, form } = useMultimedia();
    const selectedFile = form.control._formValues?.audioFile;

    const handleDismiss = () => {
      props.onDismiss?.();
    };

    const handleNextPress = async () => {
      if (currentStep === TOTAL_STEPS) {
        await handleFinish();
      } else {
        await handleNext();
      }
    };

    const renderStepContent = () => {
      switch (currentStep) {
        case 1:
        return <MultimediaStep1 />;
        case 2:
        return <MultimediaStep2 />;
        case 3:
        return <MultimediaStep3 />;
        default:
        return null;
      }
    };

    return (
      <BottomSheet
        ref={ref}
        onOpen={handleOpen}
        onDismiss={handleDismiss}
        detents={['auto']}
      >
        {/* Step Indicator */}
        <StepIndicator
          icons={{
            1: 'music-note',
            2: 'edit',
            3: 'check-circle',
          }}
        />

        {/* Step Content */}
        <ScrollView
          style={theme.components.setupStepContent}
          contentContainerStyle={theme.components.setupStepContentScroll}
          showsVerticalScrollIndicator={false}
        >
          {renderStepContent()}
        </ScrollView>

        {/* Buttons */}
        <View style={theme.components.setupStepButtons}>
          {currentStep > 1 && (
            <Button
              label={t('kidoos.setup.buttons.previous', 'Précédent')}
              onPress={handlePrevious}
              variant="outline"
              style={theme.components.setupStepButton}
            />
          )}
          <Button
            label={
              currentStep === TOTAL_STEPS
                ? t('kidoos.setup.buttons.finish', 'Terminer')
                : t('kidoos.setup.buttons.next', 'Suivant')
            }
            onPress={handleNextPress}
            disabled={isProcessing || (currentStep === 1 && !acceptTerms) || (currentStep === 2 && !selectedFile)}
            style={theme.components.setupStepButton}
          />
        </View>
      </BottomSheet>
    );
  }
);

MultimediaSheetContent.displayName = 'MultimediaSheetContent';

// Composant wrapper avec les providers
export const MultimediaSheet = React.forwardRef<BottomSheetModalRef, MultimediaSheetProps>(
  (props, ref) => {
    return (
      <StepIndicatorProvider totalSteps={TOTAL_STEPS} initialStep={1}>
        <MultimediaProvider onDismiss={props.onDismiss}>
          <MultimediaSheetContent {...props} ref={ref} />
        </MultimediaProvider>
      </StepIndicatorProvider>
    );
  }
);

MultimediaSheet.displayName = 'MultimediaSheet';
