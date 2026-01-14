/**
 * Modale d'édition pour le modèle Basic
 * Utilise le contexte Bluetooth pour gérer la connexion automatique
 */

import { ScrollView } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { useBottomSheet } from '@/components/ui/bottom-sheet';
import {
  BasicEditHeader,
  BasicFeaturesMenu,
  BrightnessModal,
  ColorModal,
} from './components';
import { SleepModal } from './sleep-modal';
import type { Kidoo } from '@/services/kidooService';

interface BasicEditModalProps {
  kidoo: Kidoo;
}

export function BasicEditModal({
  kidoo,
}: BasicEditModalProps) {
  const theme = useTheme();
  const brightnessModal = useBottomSheet();
  const colorModal = useBottomSheet();
  const sleepModal = useBottomSheet();

  const handleBrightnessPress = () => {
    brightnessModal.present();
  };

  const handleEffectsPress = () => {
    // TODO: Implémenter la sélection d'effets
    console.log('Effets LED');
  };

  const handleSleepPress = () => {
    sleepModal.present();
  };

  const handleColorsPress = () => {
    colorModal.present();
  };

  const handleResetPress = () => {
    // TODO: Implémenter la réinitialisation
    console.log('Réinitialiser');
  };

  return (
    <ScrollView
      style={theme.components.setupStepContent}
      contentContainerStyle={{
        ...theme.components.setupStepContentScroll,
        alignItems: 'stretch', // Permet aux éléments de prendre toute la largeur
      }}
      showsVerticalScrollIndicator={false}
    >
      <BasicEditHeader />

      <BasicFeaturesMenu
        onBrightnessPress={handleBrightnessPress}
        onEffectsPress={handleEffectsPress}
        onSleepPress={handleSleepPress}
        onColorsPress={handleColorsPress}
        onResetPress={handleResetPress}
      />

      <BrightnessModal
        ref={brightnessModal.ref}
        kidoo={kidoo}
        initialBrightness={50}
      />

      <ColorModal
        ref={colorModal.ref}
        kidoo={kidoo}
        initialColor={{ r: 255, g: 255, b: 255 }}
      />

      <SleepModal
        ref={sleepModal.ref}
        kidoo={kidoo}
        initialTimeout={30000}
      />
    </ScrollView>
  );
}
