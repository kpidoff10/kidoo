/**
 * ModelIcon Component
 * Affiche l'icône d'un modèle Kidoo (SVG ou Ionicons)
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DreamIcon from '@/assets/dream.svg';
import { useTheme } from '@/theme';

export interface ModelIconProps {
  /**
   * Modèle Kidoo ('BASIC', 'DREAM', 'Kidoo-Basic', 'Kidoo-Dream')
   */
  model: string;
  
  /**
   * Taille de l'icône
   */
  size?: number;
  
  /**
   * Couleur de l'icône (pour Ionicons et SVG)
   */
  color?: string;
  
  /**
   * Style personnalisé pour le conteneur
   */
  style?: ViewStyle;
}

/**
 * Composant pour afficher l'icône d'un modèle Kidoo
 * Utilise un SVG pour Dream, Ionicons pour les autres modèles
 */
export function ModelIcon({ model, size = 32, color, style }: ModelIconProps) {
  const { colors, isDark } = useTheme();
  const normalizedModel = model.toLowerCase();
  
  // Pour le modèle Dream, utiliser le SVG avec couleur selon le thème
  if (normalizedModel.includes('dream')) {
    // Blanc en mode sombre, noir en mode clair
    const dreamIconColor = color || (isDark ? '#FFFFFF' : '#000000');
    
    return (
      <View style={[styles.container, { width: size, height: size }, style]}>
        <DreamIcon 
          width={size} 
          height={size} 
          fill={dreamIconColor}
          color={dreamIconColor}
        />
      </View>
    );
  }
  
  // Pour les autres modèles, utiliser Ionicons
  const iconColor = color || colors.primary;
  
  // Pour les autres modèles, utiliser Ionicons
  const iconName = normalizedModel.includes('basic') ? 'cube-outline' : 'cube-outline';
  
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Ionicons name={iconName as any} size={size} color={iconColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
