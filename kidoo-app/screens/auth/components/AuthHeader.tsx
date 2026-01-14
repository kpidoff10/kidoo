/**
 * Composant d'en-tête pour les écrans d'authentification
 */

import { View, Text } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  const theme = useTheme();

  return (
    <View style={theme.components.authHeaderContainer}>
      <Text style={theme.components.authHeaderTitle}>{title}</Text>
      <Text style={theme.components.authHeaderSubtitle}>{subtitle}</Text>
    </View>
  );
}
