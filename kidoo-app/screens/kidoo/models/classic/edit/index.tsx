/**
 * Modale d'édition pour le modèle Classic
 * Utilise le contexte Bluetooth pour gérer la connexion automatique
 */

import React from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { AlertMessage } from '@/components/ui/alert-message';
import { useKidooEditBluetooth } from '../../kidoo-edit-bluetooth-context';
import type { Kidoo } from '@/services/kidooService';

interface ClassicEditModalProps {
  kidoo: Kidoo;
  onClose: () => void;
  onSave: (updatedKidoo: Kidoo) => void;
}

export function ClassicEditModal({
  kidoo,
  onClose,
  onSave,
}: ClassicEditModalProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { isConnected, isConnecting, error: bluetoothError, connect } = useKidooEditBluetooth();

  const handleSave = () => {
    // Pour l'instant, on sauvegarde sans modification
    // Vous pouvez ajouter ici la logique spécifique au modèle Classic
    onSave(kidoo);
  };

  return (
    <ScrollView
      style={theme.components.setupStepContent}
      contentContainerStyle={theme.components.setupStepContentScroll}
      showsVerticalScrollIndicator={false}
    >
      <ThemedText type="title" style={{ marginBottom: theme.spacing.lg }}>
        {t('kidoos.edit.classic.title', 'Modifier le Kidoo Classic')}
      </ThemedText>

      <ThemedText style={{ marginBottom: theme.spacing.xl, opacity: 0.8 }}>
        {t('kidoos.edit.classic.description', 'Paramètres spécifiques au modèle Classic')}
      </ThemedText>

      {/* État de connexion Bluetooth */}
      {isConnecting && (
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.colors.surfaceSecondary,
          borderRadius: theme.borderRadius.md,
          padding: theme.spacing.md,
          marginBottom: theme.spacing.lg,
        }}>
          <ActivityIndicator size="small" color={theme.colors.tint} style={{ marginRight: theme.spacing.sm }} />
          <ThemedText>
            {t('kidoos.edit.classic.connecting', 'Connexion au Kidoo en cours...')}
          </ThemedText>
        </View>
      )}

      {!isConnecting && !isConnected && (
        <View style={{ marginBottom: theme.spacing.lg }}>
          <AlertMessage
            type="warning"
            message={t('kidoos.edit.classic.notConnected', 'Le Kidoo n\'est pas connecté.')}
          />
          <Button
            label={t('kidoos.edit.classic.reconnect', 'Reconnecter')}
            variant="outline"
            onPress={connect}
            style={{ marginTop: theme.spacing.sm }}
          />
        </View>
      )}

      {isConnected && (
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.colors.success + '20',
          borderRadius: theme.borderRadius.md,
          padding: theme.spacing.md,
          marginBottom: theme.spacing.lg,
        }}>
          <ThemedText style={{ color: theme.colors.success }}>
            {t('kidoos.edit.classic.connected', '✓ Kidoo connecté')}
          </ThemedText>
        </View>
      )}

      {/* Erreur Bluetooth */}
      {bluetoothError && (
        <AlertMessage
          type="error"
          message={bluetoothError}
          style={{ marginBottom: theme.spacing.lg }}
        />
      )}

      {/* Ajoutez ici les champs spécifiques au modèle Classic */}
      <View style={{
        backgroundColor: theme.colors.surfaceSecondary,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
      }}>
        <ThemedText type="defaultSemiBold" style={{ marginBottom: theme.spacing.sm }}>
          {t('kidoos.edit.classic.settings', 'Paramètres')}
        </ThemedText>
        <ThemedText style={{ opacity: 0.8 }}>
          {t('kidoos.edit.classic.comingSoon', 'Les paramètres d\'édition seront disponibles prochainement')}
        </ThemedText>
      </View>

      <View style={{
        flexDirection: 'row',
        gap: theme.spacing.md,
        marginTop: theme.spacing.md,
      }}>
        <Button
          label={t('common.cancel', 'Annuler')}
          variant="outline"
          onPress={onClose}
          style={{ flex: 1 }}
        />
        <Button
          label={t('common.save', 'Enregistrer')}
          variant="primary"
          onPress={handleSave}
          style={{ flex: 1 }}
          disabled={isConnecting}
        />
      </View>
    </ScrollView>
  );
}
