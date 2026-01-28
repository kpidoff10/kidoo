/**
 * Accordion Component
 * Composant accordéon pour afficher/masquer du contenu
 */

import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme';
import { Text } from '../Typography';

export interface AccordionProps {
  /**
   * Titre de l'accordéon (optionnel si renderHeader est fourni)
   */
  title?: string;
  
  /**
   * Contenu à afficher quand l'accordéon est ouvert
   */
  children: React.ReactNode;
  
  /**
   * Si l'accordéon est ouvert par défaut
   */
  defaultOpen?: boolean;
  
  /**
   * Callback appelé quand l'état change
   */
  onToggle?: (isOpen: boolean) => void;
  
  /**
   * Style personnalisé pour le conteneur
   */
  style?: View['props']['style'];
  
  /**
   * Header personnalisé (si fourni, remplace le header par défaut avec titre)
   */
  renderHeader?: (isOpen: boolean, toggle: () => void) => React.ReactNode;
  
  /**
   * Référence pour contrôler l'accordéon depuis l'extérieur
   */
  onRef?: (ref: { toggle: () => void; isOpen: boolean }) => void;
}

export function Accordion({ 
  title, 
  children, 
  defaultOpen = false,
  onToggle,
  style,
  renderHeader,
  onRef
}: AccordionProps) {
  const { colors, spacing } = useTheme();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const rotateAnim = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current;
  const heightAnim = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current;

  const handleToggle = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    onToggle?.(newIsOpen);

    // Animation de rotation de la flèche
    Animated.timing(rotateAnim, {
      toValue: newIsOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Animation de hauteur seulement si on a mesuré la hauteur
    if (contentHeight !== null) {
      Animated.timing(heightAnim, {
        toValue: newIsOpen ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  // Exposer l'API pour contrôler l'accordéon depuis l'extérieur
  React.useEffect(() => {
    if (onRef) {
      onRef({
        toggle: handleToggle,
        isOpen,
      });
    }
  }, [isOpen, onRef]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const heightInterpolate = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight || 1],
  });

  const handleContentLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    if (contentHeight === null && height > 0) {
      setContentHeight(height);
      // Si ouvert par défaut, initialiser l'animation à la hauteur complète
      if (defaultOpen) {
        heightAnim.setValue(1);
      }
    }
  };

  return (
    <View style={[styles.container, style]}>
      {renderHeader ? (
        renderHeader(isOpen, handleToggle)
      ) : title ? (
        <TouchableOpacity
          onPress={handleToggle}
          activeOpacity={0.7}
          style={styles.header}
        >
          <Text style={styles.title} variant="body2" color="secondary">
            {title}
          </Text>
          <Animated.View
            style={{
              transform: [{ rotate: rotateInterpolate }],
            }}
          >
            <Ionicons
              name="chevron-down"
              size={18}
              color={colors.textSecondary}
            />
          </Animated.View>
        </TouchableOpacity>
      ) : null}

      <Animated.View
        style={[
          styles.contentWrapper,
          {
            height: contentHeight !== null ? heightInterpolate : undefined,
            opacity: contentHeight !== null ? heightAnim : (isOpen ? 1 : 0),
          },
        ]}
      >
        <View
          onLayout={handleContentLayout}
          style={[styles.content, { paddingTop: spacing[2] }]}
          collapsable={false}
        >
          {children}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  title: {
    flex: 1,
  },
  contentWrapper: {
    overflow: 'hidden',
  },
  content: {
    width: '100%',
  },
});
