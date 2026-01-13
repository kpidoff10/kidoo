/**
 * Composant MenuList générique
 * Affiche une liste d'items de menu avec support pour icônes, sous-titres et actions
 * 
 * @example
 * ```tsx
 * <MenuList
 *   items={[
 *     {
 *       id: 'profile',
 *       title: 'Mon profil',
 *       subtitle: 'Gérer mes informations',
 *       icon: 'person.fill',
 *       onPress: () => navigate('/profile'),
 *     },
 *     {
 *       id: 'settings',
 *       title: 'Paramètres',
 *       icon: 'gearshape.fill',
 *       onPress: () => navigate('/settings'),
 *     },
 *     {
 *       id: 'logout',
 *       title: 'Déconnexion',
 *       icon: 'xmark.circle.fill',
 *       destructive: true,
 *       onPress: handleLogout,
 *     },
 *   ]}
 *   showDividers={true}
 * />
 * ```
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from './icon-symbol';

export interface MenuItem {
  /**
   * Identifiant unique de l'item (optionnel mais recommandé)
   */
  id?: string;
  
  /**
   * Titre de l'item (requis)
   */
  title: string;
  
  /**
   * Sous-titre optionnel affiché sous le titre
   */
  subtitle?: string;
  
  /**
   * Nom de l'icône SF Symbols (optionnel)
   */
  icon?: string;
  
  /**
   * Couleur de l'icône (optionnel, utilise la couleur du thème par défaut)
   */
  iconColor?: string;
  
  /**
   * Callback appelé lors du clic sur l'item
   */
  onPress?: () => void;
  
  /**
   * Si true, l'item est affiché en rouge (pour actions dangereuses)
   */
  destructive?: boolean;
  
  /**
   * Si true, l'item est désactivé
   */
  disabled?: boolean;
  
  /**
   * Élément à afficher à droite (badge, chevron, etc.)
   */
  rightElement?: React.ReactNode;
  
  /**
   * Style personnalisé pour l'item
   */
  style?: ViewStyle;
}

export interface MenuListProps {
  /**
   * Liste des items à afficher
   */
  items: MenuItem[];
  
  /**
   * Si true, affiche un séparateur entre chaque item
   */
  showDividers?: boolean;
  
  /**
   * Style personnalisé pour le conteneur
   */
  style?: ViewStyle;
  
  /**
   * Espacement vertical entre les items (par défaut: spacing.lg)
   */
  itemSpacing?: number;
  
  /**
   * Variante d'affichage du menu
   * - 'default': Style par défaut avec espacement normal
   * - 'dense': Style condensé comme les paramètres iOS/Android (espacement réduit)
   */
  variant?: 'default' | 'dense';
}

export function MenuList({
  items,
  showDividers = false,
  style,
  itemSpacing,
  variant = 'default',
}: MenuListProps) {
  const theme = useTheme();
  
  // Espacement selon la variante - encore plus réduit en mode dense (pas d'icônes)
  const defaultSpacing = variant === 'dense' ? theme.spacing.xs : theme.spacing.lg;
  const spacing = itemSpacing ?? defaultSpacing;

  return (
    <View style={style}>
      {items.map((item, index) => (
        <React.Fragment key={item.id || index}>
          <MenuItemComponent
            item={item}
            spacing={spacing}
            theme={theme}
            variant={variant}
          />
          {showDividers && index < items.length - 1 && (
            <View style={theme.components.dividerThin} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

interface MenuItemComponentProps {
  item: MenuItem;
  spacing: number;
  theme: ReturnType<typeof useTheme>;
  variant: 'default' | 'dense';
}

function MenuItemComponent({ item, spacing, theme, variant }: MenuItemComponentProps) {
  const {
    title,
    subtitle,
    icon,
    iconColor,
    onPress,
    destructive = false,
    disabled = false,
    rightElement,
    style: itemStyle,
  } = item;

  const isDisabled = disabled || !onPress;
  const isDense = variant === 'dense';
  const showIcon = icon && !isDense; // Masquer les icônes en mode dense

  const handlePress = () => {
    if (!isDisabled && onPress) {
      onPress();
    }
  };

  const textStyle = destructive
    ? theme.components.menuItemTextDanger
    : theme.components.menuItemText;

  const iconColorFinal = iconColor || (destructive ? theme.colors.error : theme.colors.tint);

  return (
    <TouchableOpacity
      style={[
        styles.menuItemContainer,
        { paddingVertical: spacing },
        isDisabled && { opacity: 0.5 },
        itemStyle,
      ]}
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      <View style={styles.itemContent}>
        {showIcon && (
          <View style={theme.components.iconContainer}>
            <IconSymbol
              name={icon}
              size={theme.iconSize.md}
              color={isDisabled ? theme.colors.textDisabled : iconColorFinal}
            />
          </View>
        )}
        <View style={[styles.itemTextContainer, showIcon && styles.itemTextContainerWithIcon]}>
          <ThemedText style={[
            textStyle,
            isDisabled && { color: theme.colors.textDisabled },
            isDense && { fontSize: theme.typography.fontSize.md }, // Texte légèrement plus petit en mode dense
          ]}>
            {title}
          </ThemedText>
          {subtitle && (
            <ThemedText
              style={[
                styles.subtitle,
                { color: theme.colors.textSecondary },
                isDisabled && { color: theme.colors.textDisabled },
                isDense && { fontSize: theme.typography.fontSize.sm, marginTop: 2 }, // Sous-titre plus petit en mode dense
              ]}
            >
              {subtitle}
            </ThemedText>
          )}
        </View>
        {rightElement && <View style={styles.rightElement}>{rightElement}</View>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  menuItemContainer: {
    width: '100%',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  itemTextContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  itemTextContainerWithIcon: {
    marginLeft: 12,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  rightElement: {
    marginLeft: 12,
  },
});
