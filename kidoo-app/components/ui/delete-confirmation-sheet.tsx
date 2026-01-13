/**
 * Composant générique pour les sheets de confirmation de suppression
 * Réutilisable pour toutes les confirmations de suppression dans l'application
 */

import React, { useState, useRef, useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { AlertMessage } from '@/components/ui/alert-message';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedTrueSheet, ThemedTrueSheetRef } from '@/components/ui/themed-true-sheet';

// Export du type pour utilisation externe
export type DeleteConfirmationSheetRef = ThemedTrueSheetRef;

export interface DeleteConfirmationSheetProps {
  /**
   * Titre de la confirmation
   */
  title: string;
  /**
   * Message de confirmation (peut inclure des variables avec {{variable}})
   */
  message: string;
  /**
   * Variables pour le message (optionnel)
   */
  messageVariables?: Record<string, string>;
  /**
   * Nom de l'icône SF Symbols à afficher
   * @default "xmark.circle.fill"
   */
  iconName?: string;
  /**
   * Taille de l'icône
   * @default theme.iconSize.xl
   */
  iconSize?: number;
  /**
   * Couleur de l'icône
   * @default theme.colors.error
   */
  iconColor?: string;
  /**
   * Libellé du bouton de confirmation
   * @default "Supprimer"
   */
  confirmLabel?: string;
  /**
   * Libellé du bouton d'annulation
   * @default "Annuler"
   */
  cancelLabel?: string;
  /**
   * Afficher le warning "Cette action est irréversible"
   * @default true
   */
  showIrreversibleWarning?: boolean;
  /**
   * Contenu personnalisé à afficher avant les boutons
   */
  customContent?: React.ReactNode;
  /**
   * Fonction appelée lors de la confirmation
   */
  onConfirm: () => Promise<void> | void;
  /**
   * Fonction appelée lors de l'annulation
   */
  onCancel: () => void;
  /**
   * Fonction appelée après une suppression réussie
   */
  onSuccess?: () => void;
  /**
   * Contrôle l'ouverture/fermeture du sheet
   */
  isOpen: boolean;
}

/**
 * Composant générique pour les confirmations de suppression
 */
export const DeleteConfirmationSheet = React.forwardRef<ThemedTrueSheetRef, DeleteConfirmationSheetProps>(
  ({
    title,
    message,
    messageVariables,
    iconName = 'xmark.circle.fill',
    iconSize,
    iconColor,
    confirmLabel,
    cancelLabel,
    showIrreversibleWarning = true,
    customContent,
    onConfirm,
    onCancel,
    onSuccess,
    isOpen,
  },
  ref
) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const internalRef = useRef<ThemedTrueSheetRef>(null);
  const sheetRef = (ref as React.MutableRefObject<ThemedTrueSheetRef | null>) || internalRef;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detents = useMemo(() => ['auto' as const], []);

  const finalIconSize = iconSize ?? theme.iconSize.xl;
  const finalIconColor = iconColor ?? theme.colors.error;
  const finalConfirmLabel = confirmLabel ?? t('common.delete', 'Supprimer');
  const finalCancelLabel = cancelLabel ?? t('common.cancel', 'Annuler');

  // Formater le message avec les variables
  const formattedMessage = useMemo(() => {
    if (!messageVariables) return message;
    let formatted = message;
    Object.entries(messageVariables).forEach(([key, value]) => {
      formatted = formatted.replace(`{{${key}}}`, value);
    });
    return formatted;
  }, [message, messageVariables]);

  React.useEffect(() => {
    if (isOpen) {
      setError(null);
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [isOpen, sheetRef]);

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await onConfirm();
      onSuccess?.();
      onCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error', 'Une erreur est survenue'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    setError(null);
    onCancel();
  };

  return (
    <ThemedTrueSheet
      ref={sheetRef}
      detents={detents}
      onDidDismiss={handleDismiss}
      dismissible={!isLoading}
      draggable={!isLoading}
      style={{
        marginHorizontal: theme.spacing.xl,
      }}
    >
      <View style={{ alignItems: 'center', marginBottom: theme.spacing.lg }}>
        <View style={[
          theme.components.iconContainerLarge,
          {
            backgroundColor: theme.colors.errorBackground,
            borderWidth: 2,
            borderColor: theme.colors.error,
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
          }
        ]}>
          <IconSymbol
            name={iconName}
            size={finalIconSize}
            color={finalIconColor}
          />
        </View>
      </View>

      <ThemedText type="title" style={{ marginBottom: theme.spacing.md, textAlign: 'center' }}>
        {title}
      </ThemedText>

      <ThemedText style={{ 
        marginBottom: theme.spacing.lg, 
        textAlign: 'center',
        opacity: 0.8,
      }}>
        {formattedMessage}
      </ThemedText>

      {showIrreversibleWarning && (
        <View style={{
          backgroundColor: theme.colors.errorBackground,
          borderRadius: theme.borderRadius.md,
          padding: theme.spacing.md,
          marginBottom: theme.spacing.lg,
        }}>
          <ThemedText style={{
            color: theme.colors.error,
            fontSize: theme.typography.fontSize.sm,
            textAlign: 'center',
            fontWeight: theme.typography.fontWeight.semibold,
          }}>
            {t('common.irreversible', 'Cette action est irréversible')}
          </ThemedText>
        </View>
      )}

      {customContent}

      {error && (
        <AlertMessage
          type="error"
          message={error}
          style={{ marginBottom: theme.spacing.md }}
        />
      )}

      <View style={{
        flexDirection: 'row',
        gap: theme.spacing.md,
        marginTop: theme.spacing.md,
      }}>
        <Button
          label={finalCancelLabel}
          variant="outline"
          onPress={handleDismiss}
          disabled={isLoading}
          style={{ flex: 1 }}
        />
        <Button
          label={finalConfirmLabel}
          variant="danger"
          onPress={handleConfirm}
          loading={isLoading}
          disabled={isLoading}
          style={{ flex: 1 }}
        />
      </View>
    </ThemedTrueSheet>
  );
});

DeleteConfirmationSheet.displayName = 'DeleteConfirmationSheet';
