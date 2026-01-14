/**
 * Modale de détails pour le modèle Classic
 */

import { useState } from 'react';
import { View, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { MenuList, type MenuItem } from '@/components/ui/menu-list';
import { BottomSheet, useBottomSheet } from '@/components/ui/bottom-sheet';
import { DeleteConfirmationSheet } from '@/components/ui/delete-confirmation-sheet';
import { AlertMessage } from '@/components/ui/alert-message';
import { useAuth } from '@/contexts/AuthContext';
import { updateKidoo, deleteKidoo } from '@/services/kidooService';
import { KidooEditBluetoothProvider, useKidooEditBluetooth } from '../../kidoo-edit-bluetooth-context';
import { StorageInfo, WifiConfigSheet } from '../../components';
import type { Kidoo } from '@/services/kidooService';

interface ClassicDetailModalProps {
  kidoo: Kidoo;
  onEdit?: () => void;
  onViewInfo?: () => void;
  onKidooUpdated?: (updatedKidoo: Kidoo | null) => void;
}

function ClassicDetailContent({
  kidoo,
  onEdit,
  onViewInfo,
  onKidooUpdated,
}: ClassicDetailModalProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const [newName, setNewName] = useState(kidoo.name);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameError, setRenameError] = useState<string | null>(null);
  const renameSheet = useBottomSheet();
  const wifiSheet = useBottomSheet();
  const deleteSheet = useBottomSheet();
  
  // Utiliser le contexte Bluetooth pour la connexion automatique
  useKidooEditBluetooth();

  const handleRename = async () => {
    if (!newName.trim()) {
      setRenameError(t('kidoos.detail.rename.errorEmpty', 'Le nom ne peut pas être vide'));
      return;
    }

    if (!user?.id) {
      setRenameError(t('kidoos.detail.rename.error', 'Erreur lors du renommage'));
      return;
    }

    setIsRenaming(true);
    setRenameError(null);

    try {
      const result = await updateKidoo(kidoo.id, { name: newName.trim() }, user.id);
      if (result.success && result.data) {
        renameSheet.dismiss();
        onKidooUpdated?.(result.data);
      } else {
        setRenameError((result as { success: false; error: string }).error || t('kidoos.detail.rename.error', 'Erreur lors du renommage'));
      }
    } catch {
      setRenameError(t('kidoos.detail.rename.error', 'Erreur lors du renommage'));
    } finally {
      setIsRenaming(false);
    }
  };

  const handleDelete = async () => {
    if (!user?.id) return;

    try {
      const result = await deleteKidoo(kidoo.id, user.id);
      if (result.success) {
        deleteSheet.dismiss();
        onKidooUpdated?.(null);
      }
    } catch {
      console.error('Erreur lors de la suppression');
    }
  };

  const menuItems: MenuItem[] = [
    {
      id: 'rename',
      title: t('kidoos.detail.actions.rename', 'Renommer'),
      subtitle: t('kidoos.detail.actions.renameSubtitle', 'Modifier le nom du Kidoo'),
      icon: 'person.fill',
      onPress: () => {
        setNewName(kidoo.name);
        setRenameError(null);
        renameSheet.present();
      },
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
      id: 'tags',
      title: t('kidoos.detail.actions.tags', 'Mes tags'),
      subtitle: t('kidoos.detail.actions.tagsSubtitle', 'Gérer les tags NFC'),
      icon: 'tag.fill',
      onPress: () => {
        router.push(`/kidoo/${kidoo.id}/tags`);
      },
    },
    {
      id: 'delete',
      title: t('kidoos.detail.actions.delete', 'Supprimer'),
      subtitle: t('kidoos.detail.actions.deleteSubtitle', 'Retirer ce Kidoo de votre compte'),
      icon: 'xmark.circle.fill',
      destructive: true,
      onPress: () => {
        deleteSheet.present();
      },
    },
  ].filter((item) => item.onPress !== undefined) as MenuItem[];

  return (
    <>
      {/* Badge du modèle */}
      <View style={{
        backgroundColor: theme.colors.tint + '20',
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        alignSelf: 'flex-start',
        marginBottom: theme.spacing.md,
      }}>
        <ThemedText style={{
          fontSize: theme.typography.fontSize.xs,
          fontWeight: theme.typography.fontWeight.semibold,
          color: theme.colors.tint,
          textTransform: 'uppercase',
        }}>
          {t('kidoos.models.classic', 'Classic')}
        </ThemedText>
      </View>

      <StorageInfo kidoo={kidoo} />
      <MenuList items={menuItems} showDividers={true} />
      <MenuList
        items={[
          {
            id: 'wifi',
            title: t('kidoos.detail.actions.wifi', 'Configurer le WiFi'),
            subtitle: t('kidoos.detail.actions.wifiSubtitle', 'Changer le réseau WiFi'),
            icon: 'wifi',
            onPress: () => wifiSheet.present(),
          },
          {
            id: 'tags',
            title: t('kidoos.detail.actions.tags', 'Mes tags'),
            subtitle: t('kidoos.detail.actions.tagsSubtitle', 'Gérer les tags NFC'),
            icon: 'tag.fill',
            onPress: () => {
              router.push(`/kidoo/${kidoo.id}/tags`);
            },
          },
        ]}
        showDividers={true}
      />

      {/* Sheet de renommage */}
      <BottomSheet
        ref={renameSheet.ref}
        onDismiss={() => {
          setNewName(kidoo.name);
          setRenameError(null);
        }}
      >
        <View style={{ padding: theme.spacing.lg }}>
          <ThemedText type="title" style={{ marginBottom: theme.spacing.md }}>
            {t('kidoos.detail.rename.title', 'Renommer le Kidoo')}
          </ThemedText>

          <ThemedText style={{ marginBottom: theme.spacing.sm }}>
            {t('kidoos.detail.rename.nameLabel', 'Nom du Kidoo')}
          </ThemedText>

          <TextInput
            value={newName}
            onChangeText={(text) => {
              setNewName(text);
              setRenameError(null);
            }}
            placeholder={t('kidoos.detail.rename.namePlaceholder', 'Mon Kidoo')}
            style={{
              backgroundColor: theme.colors.surfaceSecondary,
              borderRadius: theme.borderRadius.md,
              padding: theme.spacing.md,
              fontSize: theme.typography.fontSize.md,
              color: theme.colors.text,
              marginBottom: theme.spacing.md,
            }}
            autoFocus
          />

          {renameError && (
            <AlertMessage
              type="error"
              message={renameError}
              style={{ marginBottom: theme.spacing.md }}
            />
          )}

          <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
            <Button
              label={t('common.cancel', 'Annuler')}
              variant="outline"
              onPress={() => renameSheet.dismiss()}
              style={{ flex: 1 }}
            />
            <Button
              label={t('common.save', 'Enregistrer')}
              variant="primary"
              onPress={handleRename}
              style={{ flex: 1 }}
              loading={isRenaming}
              disabled={isRenaming || !newName.trim()}
            />
          </View>
        </View>
      </BottomSheet>

      {/* Sheet de configuration WiFi */}
      <WifiConfigSheet
        ref={wifiSheet.ref}
        kidoo={kidoo}
      />

      {/* Sheet de confirmation de suppression */}
      <DeleteConfirmationSheet
        ref={deleteSheet.ref}
        title={t('kidoos.detail.delete.title', 'Supprimer le Kidoo')}
        message={t('kidoos.detail.delete.message', 'Êtes-vous sûr de vouloir supprimer "{{name}}" ?')}
        messageVariables={{ name: kidoo.name }}
        onConfirm={handleDelete}
        onCancel={() => deleteSheet.dismiss()}
        onSuccess={() => {
          // Géré par onKidooUpdated
        }}
        isOpen={false}
      />
    </>
  );
}

export function ClassicDetailModal(props: ClassicDetailModalProps) {
  // Envelopper le composant dans le provider Bluetooth pour activer la connexion automatique
  return (
    <KidooEditBluetoothProvider kidoo={props.kidoo} autoConnect={true}>
      <ClassicDetailContent {...props} />
    </KidooEditBluetoothProvider>
  );
}
