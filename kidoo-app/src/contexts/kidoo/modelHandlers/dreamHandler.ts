/**
 * Handler pour le modèle Kidoo Dream
 */

import { ModelHandler, CustomAction } from './types';
import { MenuListItem } from '@/components/ui/MenuList/MenuList';
import { Kidoo } from '@/api';

export class DreamModelHandler implements ModelHandler {
  model = 'DREAM';

  supportsFeature(feature: string): boolean {
    const supportedFeatures = ['led', 'audio'];
    return supportedFeatures.includes(feature.toLowerCase());
  }

  getAvailableFeatures(): string[] {
    return ['led', 'audio'];
  }

  getMenuItems(
    kidoo: Kidoo, 
    t: (key: string, options?: any) => string,
    callbacks?: {
      onConfigureBedtime?: () => void;
      onConfigureWakeup?: () => void;
      [key: string]: (() => void) | undefined;
    }
  ): MenuListItem[] {
    const items: MenuListItem[] = [];

    // Item pour configurer l'heure de coucher (spécifique au Dream)
    items.push({
      label: t('kidoos.dream.bedtime.title', { defaultValue: 'Heure de coucher' }),
      value: t('kidoos.dream.bedtime.configure', { defaultValue: 'Configurer' }),
      icon: 'moon-outline',
      onPress: callbacks?.onConfigureBedtime || (() => {
        console.log('Bedtime configuration pressed for Dream');
      }),
    });

    // Item pour configurer l'heure de réveil (spécifique au Dream)
    items.push({
      label: t('kidoos.dream.wakeup.title', { defaultValue: 'Heure de réveil' }),
      value: t('kidoos.dream.wakeup.configure', { defaultValue: 'Configurer' }),
      icon: 'sunny-outline',
      onPress: callbacks?.onConfigureWakeup || (() => {
        console.log('Wakeup configuration pressed for Dream');
      }),
    });

    return items;
  }

  getCustomActions(
    kidoo: Kidoo,
    t: (key: string, options?: any) => string,
    callbacks?: {
      onStartBedtime?: () => void;
      onStopBedtime?: () => void;
      onStopRoutine?: () => void;
      [key: string]: (() => void) | undefined;
    }
  ): CustomAction[] {
    const actions: CustomAction[] = [];

    // Bouton pour lancer la routine de coucher
    actions.push({
      id: 'start-bedtime',
      label: t('kidoos.dream.bedtime.startRoutine', { defaultValue: 'Lancer la routine' }),
      icon: 'play',
      variant: 'primary',
      onPress: callbacks?.onStartBedtime || (() => {
        console.log('Start bedtime routine pressed for Dream');
      }),
    });

    // Bouton pour arrêter la routine active (bedtime ou wakeup)
    actions.push({
      id: 'stop-routine',
      label: t('kidoos.dream.routine.stop', { defaultValue: 'Arrêter la routine' }),
      icon: 'stop',
      variant: 'secondary',
      onPress: callbacks?.onStopRoutine || (() => {
        console.log('Stop routine pressed for Dream');
      }),
    });

    return actions;
  }

  // Fonctions spécifiques au Dream peuvent être ajoutées ici
  // Exemple :
  // async handleDreamSpecificAction(kidoo: Kidoo): Promise<void> {
  //   // Logique spécifique au Dream
  // }
}
