/**
 * Composant FloatingActionButton
 * Bouton d'action flottant en bas à droite
 */

import { TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/use-theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: 'plus' | 'plus.circle.fill';
  size?: number;
}

export function FloatingActionButton({
  onPress,
  icon = 'plus',
  size = 56,
}: FloatingActionButtonProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <TouchableOpacity
      style={{
        position: 'absolute',
        bottom: insets.bottom + theme.spacing.lg - 40,
        right: theme.spacing.lg,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: theme.colors.tint,
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadows.lg,
        zIndex: 1000,
      }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <IconSymbol name={icon} size={theme.iconSize.md} color={theme.staticColors.white} />
    </TouchableOpacity>
  );
}
