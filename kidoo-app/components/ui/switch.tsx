/**
 * Composant Switch réutilisable avec variantes de style
 * Supporte les types: default, info, warning, error
 */

import { Switch as RNSwitch } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

export type SwitchType = 'default' | 'info' | 'warning' | 'error';

export interface SwitchProps {
  /** Valeur du switch */
  value: boolean;
  /** Callback quand la valeur change */
  onValueChange: (value: boolean) => void;
  /** Type de switch (détermine la couleur) */
  type?: SwitchType;
  /** Désactiver le switch */
  disabled?: boolean;
  /** Style personnalisé */
  style?: object;
}

/**
 * Convertit une couleur hex en rgba avec opacité
 * Gère les formats hex (#RRGGBB) et retourne rgba pour compatibilité
 */
const colorWithOpacity = (color: string, opacity: number): string => {
  // Si c'est déjà en rgba, extraire les valeurs RGB
  if (color.startsWith('rgba')) {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${opacity})`;
    }
  }
  
  // Retirer le # si présent
  const cleanHex = color.replace('#', '');
  
  // Vérifier que c'est bien un hex valide (6 caractères)
  if (cleanHex.length !== 6) {
    // Si ce n'est pas un hex valide, retourner la couleur originale
    return color;
  }
  
  // Convertir en RGB
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  
  // Retourner en rgba pour meilleure compatibilité
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * Composant Switch stylisé avec variantes
 */
export function Switch({ value, onValueChange, type = 'default', disabled = false, style }: SwitchProps) {
  const theme = useTheme();

  // Couleurs selon le type
  // Pour trackColorFalse, on utilise la couleur du type avec une opacité réduite (30%)
  // Pour thumbColor, on utilise background (blanc) quand false, et la couleur du type quand true
  const typeConfig = {
    default: {
      trackColorTrue: theme.colors.tint,
      trackColorFalse: colorWithOpacity(theme.colors.tint, 0.3),
      thumbColorTrue: theme.colors.tint,
      thumbColorFalse: theme.colors.background,
    },
    info: {
      trackColorTrue: theme.colors.info,
      trackColorFalse: colorWithOpacity(theme.colors.info, 0.3),
      thumbColorTrue: theme.colors.info,
      thumbColorFalse: theme.colors.background,
    },
    warning: {
      trackColorTrue: theme.colors.warning,
      trackColorFalse: colorWithOpacity(theme.colors.warning, 0.3),
      thumbColorTrue: theme.colors.warning,
      thumbColorFalse: theme.colors.background,
    },
    error: {
      trackColorTrue: theme.colors.error,
      trackColorFalse: colorWithOpacity(theme.colors.error, 0.3),
      thumbColorTrue: theme.colors.error,
      thumbColorFalse: theme.colors.background,
    },
  };

  const config = typeConfig[type];

  return (
    <RNSwitch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{
        false: config.trackColorFalse,
        true: config.trackColorTrue,
      }}
      thumbColor={value ? config.thumbColorTrue : config.thumbColorFalse}
      ios_backgroundColor={config.trackColorFalse}
      style={style}
    />
  );
}
