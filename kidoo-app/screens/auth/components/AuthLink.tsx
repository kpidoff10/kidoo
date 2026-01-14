/**
 * Composant de lien pour naviguer entre les écrans d'authentification
 */

import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

interface AuthLinkProps {
  prompt: string;
  linkText: string;
  onPress: () => void;
}

export function AuthLink({ prompt, linkText, onPress }: AuthLinkProps) {
  const theme = useTheme();

  return (
    <View style={theme.components.authLinkContainer}>
      <Text style={theme.components.authLinkPrompt}>{prompt}</Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={theme.components.authLinkText}>{linkText}</Text>
      </TouchableOpacity>
    </View>
  );
}
