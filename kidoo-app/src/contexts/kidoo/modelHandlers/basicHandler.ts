/**
 * Handler pour le modèle Kidoo Basic
 */

import { ModelHandler } from './types';
import { MenuListItem } from '@/components/ui/MenuList/MenuList';
import { Kidoo } from '@/api';

export class BasicModelHandler implements ModelHandler {
  model = 'BASIC';

  supportsFeature(feature: string): boolean {
    const supportedFeatures = ['nfc', 'led', 'audio', 'potentiometer'];
    return supportedFeatures.includes(feature.toLowerCase());
  }

  getAvailableFeatures(): string[] {
    return ['nfc', 'led', 'audio', 'potentiometer'];
  }

  getMenuItems(
    kidoo: Kidoo, 
    t: (key: string, options?: any) => string,
    callbacks?: {
      onConfigureBedtime?: () => void;
      [key: string]: (() => void) | undefined;
    }
  ): MenuListItem[] {
    const items: MenuListItem[] = [];

    // Item NFC (spécifique au Basic)
    if (this.supportsFeature('nfc')) {
      items.push({
        label: t('kidoos.features.nfc', { defaultValue: 'NFC' }),
        value: t('kidoos.features.available', { defaultValue: 'Disponible' }),
        icon: 'card-outline',
        onPress: () => {
          // TODO: Naviguer vers la page NFC ou ouvrir un modal
          console.log('NFC pressed for Basic');
        },
      });
    }

    // Item Potentiomètre (spécifique au Basic)
    if (this.supportsFeature('potentiometer')) {
      items.push({
        label: t('kidoos.features.potentiometer', { defaultValue: 'Potentiomètre' }),
        value: t('kidoos.features.available', { defaultValue: 'Disponible' }),
        icon: 'settings-outline',
        onPress: () => {
          // TODO: Naviguer vers la page de configuration du potentiomètre
          console.log('Potentiometer pressed for Basic');
        },
      });
    }

    return items;
  }

  // Fonctions spécifiques au Basic peuvent être ajoutées ici
  // Exemple :
  // async handleNFCCommand(kidoo: Kidoo, command: string): Promise<void> {
  //   // Logique spécifique au Basic pour NFC
  // }
}
