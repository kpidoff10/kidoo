/**
 * ContentScrollView Component
 * ScrollView réutilisable avec gestion automatique du contentContainerStyle
 * Prend toute la hauteur disponible et gère le padding
 */

import React from 'react';
import { View, ScrollView, ScrollViewProps, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '@/theme';

export interface ContentScrollViewProps extends ScrollViewProps {
  /**
   * Padding du contenu (par défaut: 16)
   */
  contentPadding?: number;
  
  /**
   * Si true, le contenu prend toute la hauteur disponible (flexGrow: 1)
   * Par défaut: true
   */
  fillHeight?: boolean;
  
  /**
   * Style personnalisé pour le contentContainerStyle
   */
  contentStyle?: ViewStyle;
}

/**
 * Composant ScrollView avec gestion automatique du contentContainerStyle
 * 
 * @example
 * ```tsx
 * <ContentScrollView>
 *   <Text>Contenu</Text>
 * </ContentScrollView>
 * ```
 * 
 * @example Avec padding personnalisé
 * ```tsx
 * <ContentScrollView contentPadding={24}>
 *   <Text>Contenu</Text>
 * </ContentScrollView>
 * ```
 * 
 * @example Sans fillHeight
 * ```tsx
 * <ContentScrollView fillHeight={false}>
 *   <Text>Contenu</Text>
 * </ContentScrollView>
 * ```
 */
export function ContentScrollView({
  contentPadding,
  fillHeight = true,
  contentStyle,
  style,
  contentContainerStyle,
  ...props
}: ContentScrollViewProps) {
  const { spacing, colors } = useTheme();
  
  // Utiliser le padding fourni ou le spacing par défaut
  const padding = contentPadding ?? spacing[4];
  
  // Combiner les styles du contentContainer
  const combinedContentStyle: StyleProp<ViewStyle> = [
    fillHeight ? styles.fillHeight : null,
    {
      padding,
    },
    contentStyle,
    contentContainerStyle,
  ].filter(Boolean) as StyleProp<ViewStyle>;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
    <ScrollView
      style={[styles.container, style]}
      contentContainerStyle={combinedContentStyle}
      showsVerticalScrollIndicator={false}
      {...props}
    />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fillHeight: {
    flexGrow: 1,
  },
});
