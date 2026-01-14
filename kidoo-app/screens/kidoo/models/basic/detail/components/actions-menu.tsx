/**
 * Composant pour le menu d'actions d'un Kidoo Basic
 */

import { useTranslation } from 'react-i18next';
import { MenuList, type MenuItem } from '@/components/ui/menu-list';
import type { Kidoo } from '@/services/kidooService';

interface ActionsMenuProps {
  kidoo: Kidoo;
  onRename: () => void;
  onEdit?: () => void;
  onViewInfo?: () => void;
  onWifiConfig?: () => void;
  onTags?: () => void;
  onDelete: () => void;
}

export function ActionsMenu({
  kidoo,
  onRename,
  onEdit,
  onViewInfo,
  onWifiConfig,
  onTags,
  onDelete,
}: ActionsMenuProps) {
  const { t } = useTranslation();

  const menuItems: MenuItem[] = [
    {
      id: 'rename',
      title: t('kidoos.detail.actions.rename', 'Renommer'),
      subtitle: t('kidoos.detail.actions.renameSubtitle', 'Modifier le nom du Kidoo'),
      icon: 'person.fill',
      onPress: onRename,
    },
    {
      id: 'edit',
      title: t('kidoos.detail.actions.edit', 'Modifier'),
      subtitle: t('kidoos.detail.actions.editSubtitle', 'Modifier les paramètres'),
      icon: 'plus.circle.fill',
      onPress: onEdit,
    },
    {
      id: 'info',
      title: t('kidoos.detail.actions.info', 'Informations'),
      subtitle: kidoo.firmwareVersion
        ? t('kidoos.detail.actions.infoSubtitle', 'Version {{version}}', { version: kidoo.firmwareVersion })
        : t('kidoos.detail.actions.infoSubtitleNoVersion', 'Voir les détails'),
      icon: 'gearshape.fill',
      onPress: onViewInfo,
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
