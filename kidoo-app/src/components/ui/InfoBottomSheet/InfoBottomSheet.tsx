/**
 * InfoBottomSheet Component
 * BottomSheet générique pour afficher des informations (error, info, warning)
 * Compatible avec useBottomSheet hook
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Typography/Text';
import { Title } from '@/components/ui/Typography/Title';
import { Button } from '@/components/ui/Button/Button';
import { useTheme } from '@/theme';
import { BottomSheet } from '../BottomSheet/BottomSheet';
import { UseBottomSheetReturn } from '@/hooks/useBottomSheet';

export type InfoBottomSheetType = 'error' | 'warning' | 'info';

export interface InfoBottomSheetAction {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  style?: any;
  textStyle?: any;
}

export interface InfoBottomSheetProps {
  /**
   * Hook useBottomSheet pour gérer l'ouverture/fermeture
   */
  bottomSheet: UseBottomSheetReturn;

  /**
   * Type de la bottom sheet (détermine l'icône et la couleur)
   */
  type?: InfoBottomSheetType;

  /**
   * Titre de la bottom sheet
   */
  title?: string;

  /**
   * Message/Description
   */
  message?: string;

  /**
   * Liste des actions (boutons) à afficher en bas
   */
  actions: InfoBottomSheetAction[];

  /**
   * Callback appelé lors de la fermeture
   */
  onDismiss?: () => void;
}

/**
 * Composant BottomSheet générique pour les informations
 * 
 * @example
 * ```tsx
 * const infoSheet = useBottomSheet();
 * 
 * <InfoBottomSheet
 *   bottomSheet={infoSheet}
 *   type="error"
 *   title="Supprimer le Kidoo"
 *   message="Êtes-vous sûr de vouloir supprimer ce Kidoo ?"
 *   actions={[
 *     { label: "Annuler", onPress: () => infoSheet.close(), variant: "outline" },
 *     { label: "Supprimer", onPress: handleDelete, variant: "primary" }
 *   ]}
 * />
 * ```
 */
export function InfoBottomSheet({
  bottomSheet,
  type = 'info',
  title,
  message,
  actions,
  onDismiss,
}: InfoBottomSheetProps) {
  const { colors, spacing } = useTheme();

  // Configuration selon le type
  const getTypeConfig = () => {
    switch (type) {
      case 'error':
        return {
          icon: 'alert-circle' as const,
          iconColor: colors.error,
          backgroundColor: colors.error + '15', // 15 = ~8% opacity en hex
        };
      case 'warning':
        return {
          icon: 'warning' as const,
          iconColor: colors.warning || '#FFA500',
          backgroundColor: (colors.warning || '#FFA500') + '15',
        };
      case 'info':
      default:
        return {
          icon: 'information-circle' as const,
          iconColor: colors.primary,
          backgroundColor: colors.primary + '15',
        };
    }
  };

  const typeConfig = getTypeConfig();

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <BottomSheet
      ref={bottomSheet.ref}
      name={bottomSheet.id}
      detents={['auto']}
      onDismiss={handleDismiss}
      onDidDismiss={bottomSheet.handleDidDismiss}
    >
      {/* Icône et titre */}
      <View style={styles.header}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: typeConfig.backgroundColor,
            },
          ]}
        >
          <Ionicons
            name={typeConfig.icon}
            size={32}
            color={typeConfig.iconColor}
          />
        </View>

        {title && (
          <Title
            level="h3"
            style={{ marginTop: spacing[4], textAlign: 'center' }}
          >
            {title}
          </Title>
        )}

        {message && (
          <Text
            color="secondary"
            style={{
              marginTop: spacing[3],
              textAlign: 'center',
            }}
          >
            {message}
          </Text>
        )}
      </View>

      {/* Actions */}
      <View style={[styles.actionsContainer, { marginTop: spacing[6] }]}>
        {actions.map((action, index) => {
          // Déterminer la variante par défaut selon le type et la position
          const defaultVariant =
            action.variant ||
            (type === 'error' && index === actions.length - 1
              ? 'primary'
              : 'outline');

          // Pour error type, le dernier bouton (généralement l'action destructive) utilise error color
          const isDestructive =
            type === 'error' && index === actions.length - 1;

          // Construire le style conditionnellement
          const buttonStyle = {
            flex: 1,
            ...(index < actions.length - 1 && { marginRight: spacing[3] }),
            // Pour le bouton destructif, utiliser la couleur du type comme fond
            ...(isDestructive && {
              backgroundColor: typeConfig.iconColor,
              borderColor: typeConfig.iconColor,
            }),
            ...action.style,
          };

          const buttonTextStyle = {
            // Pour le bouton destructif, texte blanc
            ...(isDestructive && { color: colors.textInverse }),
            ...action.textStyle,
          };

          return (
            <Button
              key={index}
              title={action.label}
              variant={isDestructive ? 'primary' : defaultVariant}
              onPress={action.onPress}
              style={buttonStyle}
              textStyle={buttonTextStyle}
            />
          );
        })}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },
});
