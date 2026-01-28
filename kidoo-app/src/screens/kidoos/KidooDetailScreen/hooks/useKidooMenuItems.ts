/**
 * Hook pour générer les items de menu d'un Kidoo
 * Combine les items communs et les items spécifiques au modèle
 */

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MenuListItem } from '@/components/ui/MenuList/MenuList';
import { Kidoo } from '@/api';
import { ModelHandler } from '@/contexts/kidoo/modelHandlers';
import { getKidooModelDisplayName, getKidooModelIcon } from '@/config';
import { useAuth } from '@/contexts';
import moment from 'moment';

interface UseKidooMenuItemsParams {
  kidoo: Kidoo | undefined;
  modelHandler: ModelHandler | undefined;
  onEditName?: () => void;
  onConfigureWiFi?: () => void;
  onConfigureBrightness?: () => void;
  onConfigureBedtime?: () => void;
  onConfigureWakeup?: () => void;
}

export function useKidooMenuItems({ kidoo, modelHandler, onEditName, onConfigureWiFi, onConfigureBrightness, onConfigureBedtime, onConfigureWakeup }: UseKidooMenuItemsParams): MenuListItem[] {
  const { t } = useTranslation();
  const { isDeveloper } = useAuth();

  return useMemo(() => {
    if (!kidoo) return [];

    // Items communs à tous les modèles
    const commonItems: MenuListItem[] = [
      {
        label: t('kidoos.name', { defaultValue: 'Nom de l\'appareil' }),
        value: kidoo.name,
        icon: 'pencil-outline',
        onPress: onEditName,
      },
      {
        label: t('kidoos.model', { defaultValue: 'Modèle' }),
        value: getKidooModelDisplayName(kidoo.model),
        icon: getKidooModelIcon(kidoo.model) as any,
        disabled: true,
      },
      {
        label: t('kidoos.status', { defaultValue: 'Statut' }),
        value: kidoo.isConnected 
          ? t('kidoos.online', { defaultValue: 'En ligne' })
          : kidoo.lastConnected 
            ? t('kidoos.lastSeen', { 
                time: moment(kidoo.lastConnected).fromNow(),
                defaultValue: 'Vu il y a {{time}}'
              })
            : t('kidoos.offline', { defaultValue: 'Hors ligne' }),
        icon: kidoo.isConnected ? 'checkmark-circle' : 'close-circle',
        disabled: true,
      },
      {
        label: t('kidoos.wifiConfig.title', { defaultValue: 'Configuration WiFi' }),
        value: t('kidoos.wifiConfig.requiresDirectConnection', { defaultValue: 'Connexion directe au Kidoo nécessaire' }),
        icon: 'wifi-outline',
        onPress: onConfigureWiFi,
      },
      {
        label: t('kidoos.brightness.title', { defaultValue: 'Luminosité' }),
        value: t('kidoos.brightness.description', { defaultValue: 'Régler la luminosité générale' }),
        icon: 'sunny-outline',
        onPress: onConfigureBrightness,
      },
    ];

    // Ajouter l'adresse MAC si disponible et en mode développeur
    if (isDeveloper && kidoo.macAddress) {
      commonItems.push({
        label: t('kidoos.macAddress', { defaultValue: 'Adresse MAC' }),
        value: kidoo.macAddress,
        icon: 'hardware-chip-outline',
        disabled: true,
      });
    }

    // Ajouter le Device ID si en mode développeur
    if (isDeveloper && kidoo.deviceId) {
      commonItems.push({
        label: t('kidoos.deviceId', { defaultValue: 'ID Appareil' }),
        value: kidoo.deviceId,
        icon: 'finger-print-outline',
        disabled: true,
      });
    }

    // Items spécifiques au modèle (via le handler)
    const modelSpecificItems = modelHandler 
      ? modelHandler.getMenuItems(kidoo, t, {
          onConfigureBedtime,
          onConfigureWakeup,
        })
      : [];

    // Fusionner les items communs et spécifiques
    return [...commonItems, ...modelSpecificItems];
  }, [kidoo, modelHandler, isDeveloper, onEditName, onConfigureWiFi, onConfigureBrightness, onConfigureBedtime, onConfigureWakeup, t]);
}
