/**
 * MenuList Component
 * Liste de menu réutilisable avec items cliquables/non-cliquables
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Typography/Text';
import { useTheme } from '@/theme';

export interface MenuListItem {
  /**
   * Label/Description de l'item
   */
  label: string;
  
  /**
   * Valeur à afficher
   */
  value: string;
  
  /**
   * Nom de l'icône Ionicons
   */
  icon?: keyof typeof Ionicons.glyphMap;
  
  /**
   * Si true, l'item est cliquable (affiche un chevron)
   */
  onPress?: () => void;
  
  /**
   * Si true, l'item est désactivé/grisé (non cliquable)
   */
  disabled?: boolean;
  
  /**
   * Style personnalisé pour l'item
   */
  style?: ViewStyle;
}

export interface MenuListProps {
  /**
   * Liste des items à afficher
   */
  items: MenuListItem[];
  
  /**
   * Style personnalisé pour le conteneur
   */
  style?: ViewStyle;
}

/**
 * Composant de liste de menu réutilisable
 * 
 * @example
 * ```tsx
 * <MenuList
 *   items={[
 *     {
 *       label: "Nom",
 *       value: "John Doe",
 *       icon: "person-outline",
 *       onPress: () => console.log("Modifier le nom")
 *     },
 *     {
 *       label: "Email",
 *       value: "john@example.com",
 *       icon: "mail-outline",
 *       disabled: true
 *     }
 *   ]}
 * />
 * ```
 */
export function MenuList({ items, style }: MenuListProps) {
  const { colors, spacing } = useTheme();

  const renderItem = (item: MenuListItem, index: number) => {
    const isLast = index === items.length - 1;
    const isClickable = !!item.onPress && !item.disabled;
    const iconColor = item.disabled ? colors.textTertiary : colors.text;

    const ItemWrapper = isClickable ? TouchableOpacity : View;

    return (
      <ItemWrapper
        key={index}
        style={[
          styles.listItem,
          { borderBottomColor: colors.border },
          isLast && styles.lastItem,
          item.style,
        ]}
        onPress={isClickable ? item.onPress : undefined}
        activeOpacity={isClickable ? 0.7 : 1}
        disabled={!isClickable}
      >
        <View style={styles.listItemContent}>
          <View style={styles.listItemLeft}>
            {item.icon && (
              <Ionicons name={item.icon} size={22} color={iconColor} />
            )}
            <View style={{ marginLeft: item.icon ? spacing[3] : 0 }}>
              <Text
                variant="caption"
                color="secondary"
                style={{ marginBottom: spacing[1] }}
              >
                {item.label}
              </Text>
              <Text color={item.disabled ? 'tertiary' : undefined}>
                {item.value}
              </Text>
            </View>
          </View>
          {isClickable && (
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textTertiary}
            />
          )}
        </View>
      </ItemWrapper>
    );
  };

  return (
    <View style={[styles.listContainer, { backgroundColor: colors.surface }, style]}>
      {items.map((item, index) => renderItem(item, index))}
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  listItem: {
    borderBottomWidth: 1,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
});
