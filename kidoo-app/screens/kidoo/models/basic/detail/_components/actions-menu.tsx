/**
 * Composant pour le menu d'actions d'un Kidoo Basic
 */

import { useTranslation } from 'react-i18next';
import { MenuList, type MenuItem } from '@/components/ui/menu-list';
import { useKidoo } from '@/contexts/KidooContext';

interface ActionsMenuProps {
  onRename: () => void;
  onBrightness?: () => void;
  onSleep?: () => void;
  onWifiConfig?: () => void;
  onTags?: () => void;
  onDelete: () => void;
}

export function ActionsMenu({
  onRename,
  onBrightness,
  onSleep,
  onWifiConfig,
  onTags,
  onDelete,
}: ActionsMenuProps) {
  const { t } = useTranslation();
  const { kidoo } = useKidoo();

  const menuItems: MenuItem[] = [
    {
      id: 'rename',
      title: t('kidoos.detail.actions.rename', 'Renommer'),
      subtitle: t('kidoos.detail.actions.renameSubtitle', 'Modifier le nom du Kidoo'),
      icon: 'person.fill',
      onPress: onRename,
    },
    {
      id: 'brightness',
      title: t('kidoos.edit.basic.menu.brightness.title', 'Luminosité'),
      subtitle: t('kidoos.edit.basic.menu.brightness.subtitle', 'Ajuster la luminosité des LEDs'),
      icon: 'sun.max.fill',
      onPress: onBrightness,
    },
    {
      id: 'sleep',
      title: t('kidoos.edit.basic.menu.sleep.title', 'Mise en veille du Kidoo'),
      subtitle: t('kidoos.edit.basic.menu.sleep.subtitle', 'Configurer le mode sommeil'),
      icon: 'moon.fill',
      onPress: onSleep,
    },
    {
      id: 'info',
      title: t('kidoos.detail.actions.info', 'Informations'),
      subtitle: kidoo.firmwareVersion
        ? t('kidoos.detail.actions.infoSubtitle', 'Version {{version}}', { version: kidoo.firmwareVersion })
        : t('kidoos.detail.actions.infoSubtitleNoVersion', 'Voir les détails'),
      icon: 'gearshape.fill',
    },
    {
      id: 'wifi',
      title: t('kidoos.detail.actions.wifi', 'Configurer le WiFi'),
      subtitle: t('kidoos.detail.actions.wifiSubtitle', 'Changer le réseau WiFi'),
      icon: 'wifi',
      onPress: onWifiConfig,
    },
    {
      id: 'tags',
      title: t('kidoos.detail.actions.tags', 'Mes tags'),
      subtitle: t('kidoos.detail.actions.tagsSubtitle', 'Gérer les tags NFC'),
      icon: 'tag.fill',
      onPress: onTags,
    },
    {
      id: 'delete',
      title: t('kidoos.detail.actions.delete', 'Supprimer'),
      subtitle: t('kidoos.detail.actions.deleteSubtitle', 'Retirer ce Kidoo de votre compte'),
      icon: 'xmark.circle.fill',
      destructive: true,
      onPress: onDelete,
    },
  ].filter((item) => item.onPress !== undefined) as MenuItem[];

  return <MenuList items={menuItems} showDividers={true} />;
}
