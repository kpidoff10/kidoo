/**
 * Composant AlertCard
 * Carte d'alerte réutilisable avec différents types (error, warning, info, success)
 * Le mode warning utilise une couleur orange
 */

import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from './icon-symbol';

export type AlertCardType = 'error' | 'warning' | 'info' | 'success';

interface AlertCardProps {
  /** Type d'alerte */
  type?: AlertCardType;
  /** Titre de l'alerte (optionnel) */
  title?: string;
  /** Message de l'alerte (optionnel si children ou items sont fournis) */
  message?: string;
  /** Liste de messages à afficher (optionnel, pour les listes à puces) */
  items?: string[];
  /** Afficher une icône (optionnel) */
  showIcon?: boolean;
  /** Style personnalisé pour le conteneur */
  style?: object;
  /** Contenu personnalisé (optionnel, remplace message et items) */
  children?: React.ReactNode;
}

/**
 * Composant de carte d'alerte réutilisable
 */
export function AlertCard({
  type = 'warning',
  title,
  message,
  items,
  showIcon = false,
  style,
  children,
}: AlertCardProps) {
  const theme = useTheme();

  // Couleurs et icônes selon le type
  const typeConfig = {
    error: {
      backgroundColor: theme.colors.errorBackground,
      borderColor: theme.colors.error,
      textColor: theme.colors.error,
      icon: 'xmark.circle.fill' as const,
    },
    warning: {
      backgroundColor: theme.colors.warningBackground,
      borderColor: theme.colors.warning,
      textColor: theme.colors.warning,
      icon: 'exclamationmark.triangle.fill' as const,
    },
    info: {
      backgroundColor: theme.colors.infoBackground,
      borderColor: theme.colors.info,
      textColor: theme.colors.info,
      icon: 'info.circle.fill' as const,
    },
    success: {
      backgroundColor: theme.colors.successBackgroundSolid,
      borderColor: theme.colors.success,
      textColor: theme.colors.success,
      icon: 'checkmark.circle.fill' as const,
    },
  };

  const config = typeConfig[type];

  return (
    <ThemedView
      style={[
        styles.card,
        {
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
          borderWidth: 1,
          padding: theme.spacing.lg,
          borderRadius: theme.spacing.md,
          gap: theme.spacing.md,
        },
        style,
      ]}
    >
      {/* En-tête avec icône et titre */}
      {(showIcon || title) && (
        <View style={styles.header}>
          {showIcon && (
            <IconSymbol
              name={config.icon}
              size={20}
              color={config.textColor}
              style={{ marginRight: theme.spacing.xs }}
            />
          )}
          {title && (
            <ThemedText
              style={[
                styles.title,
                {
                  color: config.textColor,
                  fontSize: theme.typography.fontSize.md,
                  fontWeight: theme.typography.fontWeight.semibold,
                },
              ]}
            >
              {title}
            </ThemedText>
          )}
        </View>
      )}

      {/* Contenu */}
      <View style={{ gap: theme.spacing.sm }}>
        {message && (
          <ThemedText
            style={[
              styles.message,
              {
                color: config.textColor,
                fontSize: theme.typography.fontSize.sm,
                lineHeight: theme.typography.fontSize.sm * 1.5,
              },
            ]}
          >
            {message}
          </ThemedText>
        )}

        {/* Liste d'items avec puces */}
        {items && items.length > 0 && (
          <View style={{ gap: theme.spacing.xs, paddingLeft: theme.spacing.sm }}>
            {items.map((item, index) => (
              <ThemedText
                key={index}
                style={[
                  styles.item,
                  {
                    color: config.textColor,
                    fontSize: theme.typography.fontSize.sm,
                    opacity: 0.9,
                    lineHeight: theme.typography.fontSize.sm * 1.4,
                  },
                ]}
              >
                • {item}
              </ThemedText>
            ))}
          </View>
        )}

        {/* Contenu personnalisé (children) */}
        {children}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
  },
  message: {
    lineHeight: 20,
  },
  item: {
    lineHeight: 18,
  },
});
