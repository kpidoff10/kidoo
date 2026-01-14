/**
 * Composant pour écrire un tag NFC avec stepper en 3 étapes
 * 1. Scan du tag (vérification si le tag existe)
 * 2. Choix du nom
 * 3. Création du tag et finalisation
 */

import React, { useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { BottomSheet, type BottomSheetModalRef } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import {
  ScanStep,
  NameStep,
  FinalizationStep,
} from './components';
import { StepIndicatorProvider, StepIndicator, useStepIndicator } from '@/components/ui/step-indicator';
import { NFCWriteProvider, useNFCWrite } from './NFCWriteContext';

const TOTAL_STEPS = 3;

export interface NFCWriteSheetProps {
  onTagWritten?: (tagId: string, uid: string) => void;
  onDismiss?: () => void;
}

// Composant interne qui utilise le contexte
const NFCWriteSheetContent = React.forwardRef<BottomSheetModalRef, NFCWriteSheetProps>(
  (_props, ref) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const { currentStep } = useStepIndicator();
    const {
      isScanning,
      isProcessing,
      isSuccess,
      error,
      tagUID,
      scannedUID,
      form,
      handleNext,
      handlePrevious,
      handleCancel,
      setBottomSheetRef,
    } = useNFCWrite();

    // Définir la ref du BottomSheet dans le contexte
    useEffect(() => {
      if (ref && 'current' in ref) {
        setBottomSheetRef(ref.current);
      }
    }, [ref, setBottomSheetRef]);


    const renderStepContent = () => {
      switch (currentStep) {
        case 1:
          return (
            <ScanStep
              isScanning={isScanning}
              isWriting={isProcessing}
              error={error}
              tagUID={scannedUID}
            />
          );
        case 2:
          return (
            <NameStep
              control={form.control}
              errors={form.errors}
              tagUID={scannedUID}
            />
          );
        case 3:
          const formData = form.control._formValues as { name: string };
          return (
            <FinalizationStep
              isProcessing={isProcessing}
              isSuccess={isSuccess}
              error={error}
              tagName={formData.name}
              tagUID={tagUID || scannedUID}
            />
          );
        default:
          return null;
      }
    };

    return (
      <BottomSheet
        ref={ref}
        onDismiss={handleCancel}
        detents={['auto']}
      >
        {/* Step Indicator */}
        <StepIndicator
          icons={{
            1: 'nfc',
            2: 'edit',
            3: 'check-circle',
          }}
          specificCompletedStep={isSuccess ? 3 : undefined}
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
        {!isSuccess && (
          <View style={theme.components.setupStepButtons}>
            {currentStep > 1 && (
              <Button
                label={t('kidoos.setup.buttons.previous', 'Précédent')}
                onPress={handlePrevious}
                variant="outline"
                style={theme.components.setupStepButton}
                disabled={isScanning || isProcessing}
            />
          )}
            <Button
              label={
                currentStep === TOTAL_STEPS
                  ? isProcessing
                    ? t('kidoos.nfc.creating', 'Création...')
                    : t('kidoos.setup.buttons.finish', 'Terminer')
                  : currentStep === 1
                    ? t('kidoos.nfc.scan', 'Scanner')
                    : t('kidoos.setup.buttons.next', 'Suivant')
              }
              onPress={handleNext}
              style={theme.components.setupStepButton}
              disabled={isScanning || isProcessing}
              loading={(isScanning || isProcessing) && currentStep !== 1}
          />
        </View>
        )}
      </BottomSheet>
    );
  }
);

NFCWriteSheetContent.displayName = 'NFCWriteSheetContent';

// Composant wrapper avec les providers
export const NFCWriteSheet = React.forwardRef<BottomSheetModalRef, NFCWriteSheetProps>(
  (props, ref) => {
    return (
      <StepIndicatorProvider totalSteps={TOTAL_STEPS} initialStep={1}>
        <NFCWriteProvider onTagWritten={props.onTagWritten} onDismiss={props.onDismiss}>
          <NFCWriteSheetContent {...props} ref={ref} />
        </NFCWriteProvider>
      </StepIndicatorProvider>
    );
  }
);

NFCWriteSheet.displayName = 'NFCWriteSheet';
