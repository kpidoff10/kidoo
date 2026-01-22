/**
 * BottomSheetActions Component
 * BottomSheet avec actions pré-configurées (error, warning, info)
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { TrueSheet } from '@lodev09/react-native-true-sheet';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Typography/Text';
import { Title } from '@/components/ui/Typography/Title';
import { Button } from '@/components/ui/Button/Button';
import { useTheme } from '@/theme';
import { BottomSheet } from '../BottomSheet/BottomSheet';

export type ActionSheetType = 'error' | 'warning' | 'info';

export interface ActionButton {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  style?: ViewStyle;
  textStyle?: ViewStyle;
}

export interface BottomSheetActionsProps {
  /**
   * Type de la bottom sheet (détermine l'icône et la couleur)
   */
  type?: ActionSheetType;
  
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
  actions: ActionButton[];
  
  /**
   * Padding minimum à appliquer
   * Par défaut: utilise le spacing[6] du thème
   */
  minPadding?: number;

  /**
   * Callback appelé lors de la fermeture
   */
  onDismiss?: () => void;
}

/**
 * Composant BottomSheet avec actions pré-configurées
 * 
 * @example
 * ```tsx
 * <BottomSheetActions
 *   ref={sheetRef}
 *   type="error"
 *   title="Supprimer le compte"
 *   message="Êtes-vous sûr de vouloir supprimer votre compte ?"
 *   actions={[
 *     { label: "Annuler", onPress: () => {}, variant: "outline" },
 *     { label: "Supprimer", onPress: () => {}, variant: "primary" }
 *   ]}
 * />
 * ```
 */
export const BottomSheetActions = React.forwardRef<
  TrueSheet,
  BottomSheetActionsProps
>(({ type = 'info', title, message, actions, minPadding, onDismiss }, ref) => {
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

  return (
    <BottomSheet ref={ref} detents={['auto']} onDismiss={onDismiss}>
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
            const buttonStyle: ViewStyle = {
              ...(index < actions.length - 1 && { marginBottom: spacing[3] }),
              // Pour le bouton destructif, utiliser la couleur du type comme fond
              ...(isDestructive && {
                backgroundColor: typeConfig.iconColor,
                borderColor: typeConfig.iconColor,
              }),
              ...action.style,
            };

            const buttonTextStyle: TextStyle = {
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
                fullWidth
                style={buttonStyle}
                textStyle={buttonTextStyle}
              />
            );
          })}
        </View>
    </BottomSheet>
  );
});

BottomSheetActions.displayName = 'BottomSheetActions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  },
});
