/**
 * Composant FloatingActionButton générique
 * Bouton d'action flottant en bas à droite
 */

import { TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/use-theme';
import { IconSymbol } from './icon-symbol';

export interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: 'plus' | 'plus.circle.fill';
  size?: number;
  bottom?: number;
  right?: number;
}

export function FloatingActionButton({
  onPress,
  icon = 'plus',
  size = 56,
  bottom,
  right,
}: FloatingActionButtonProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const bottomPosition = bottom !== undefined 
    ? bottom 
    : insets.bottom + theme.spacing.lg - 40;
  
  const rightPosition = right !== undefined 
    ? right 
    : theme.spacing.lg;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          bottom: bottomPosition,
          right: rightPosition,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.colors.tint,
          ...theme.shadows.lg,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <IconSymbol name={icon} size={theme.iconSize.md} color={theme.staticColors.white} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
});
