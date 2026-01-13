/**
 * Modale pour choisir la couleur du Kidoo
 * Sliders RGB et couleurs prédéfinies
 */

import React, { useState, useCallback, useRef } from 'react';
import { ScrollView } from 'react-native';
import { BottomSheet, type BottomSheetModalRef } from '@/components/ui/bottom-sheet';
import { kidooActionsService } from '@/services/kidooActionsService';
import { bleManager } from '@/services/bleManager';
import {
  ColorHeader,
  ColorPreview,
  ColorSliders,
  ColorPresets,
} from './components';
import type { Kidoo } from '@/services/kidooService';
import type { ColorOptions } from '@/services/kidoo-actions/types';

interface ColorModalProps {
  kidoo: Kidoo;
  initialColor?: ColorOptions;
  onDismiss?: () => void;
}

export const ColorModal = React.forwardRef<BottomSheetModalRef, ColorModalProps>(
  ({ kidoo, initialColor = { r: 255, g: 255, b: 255 }, onDismiss }, ref) => {
    const [color, setColor] = useState<ColorOptions>(initialColor);
    const lastSentColor = useRef<ColorOptions>(color);
    const sendTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Envoyer la couleur au Kidoo avec debounce
    const sendColor = useCallback(async (newColor: ColorOptions) => {
      if (!bleManager.isConnected()) {
        console.log('[ColorModal] Kidoo non connecté');
        return;
      }

      // Éviter d'envoyer la même couleur plusieurs fois
      if (
        newColor.r === lastSentColor.current.r &&
        newColor.g === lastSentColor.current.g &&
        newColor.b === lastSentColor.current.b
      ) {
        return;
      }

      // Annuler le timeout précédent
      if (sendTimeoutRef.current) {
        clearTimeout(sendTimeoutRef.current);
      }

      // Debounce pour éviter trop d'envois
      sendTimeoutRef.current = setTimeout(async () => {
        try {
          const actions = kidooActionsService.forKidoo(kidoo);
          const result = await actions.setColor(newColor);
          
          if (result.success) {
            lastSentColor.current = newColor;
          } else {
            console.error('[ColorModal] Erreur lors de l\'envoi de la couleur:', result.error);
          }
        } catch (error) {
          console.error('[ColorModal] Erreur lors de l\'envoi de la couleur:', error);
        }
      }, 200); // Attendre 200ms après le dernier changement
    }, [kidoo]);

    // Gérer le changement de couleur via slider
    const handleColorChange = useCallback((component: 'r' | 'g' | 'b', value: number) => {
      const newColor = { ...color, [component]: Math.round(value) };
      setColor(newColor);
      sendColor(newColor);
    }, [color, sendColor]);

    // Gérer la sélection d'une couleur prédéfinie
    const handlePresetColorPress = useCallback((presetColor: ColorOptions) => {
      setColor(presetColor);
      sendColor(presetColor);
    }, [sendColor]);

    return (
      <BottomSheet
        ref={ref}
        onDismiss={onDismiss}
        
      >
        <ScrollView
          nestedScrollEnabled
         
          showsVerticalScrollIndicator={false}
        >
          <ColorHeader />
          <ColorPreview color={color} />
          <ColorSliders color={color} onColorChange={handleColorChange} />
          <ColorPresets color={color} onPresetSelect={handlePresetColorPress} />
        </ScrollView>
      </BottomSheet>
    );
  }
);

ColorModal.displayName = 'ColorModal';

