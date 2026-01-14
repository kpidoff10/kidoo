/**
 * Composant AlertMessage
 * Composant générique pour afficher des messages d'alerte (erreur, avertissement, info, succès)
 */

import { View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';

export type AlertType = 'error' | 'warning' | 'info' | 'success';

interface AlertMessageProps {
  message: string;
  type?: AlertType;
  visible?: boolean;
  style?: object;
}

/**
 * Composant générique pour afficher des messages d'alerte
 */
export function AlertMessage({
  message,
  type = 'error',
  visible = true,
  style,
}: AlertMessageProps) {
  const theme = useTheme();

  if (!visible || !message) {
    return null;
  }

  const alertStyles = {
    error: theme.components.alertError,
    warning: theme.components.alertWarning,
    info: theme.components.alertInfo,
    success: theme.components.alertSuccess,
  };

  const textStyles = {
    error: { color: theme.colors.error },
    warning: { color: theme.colors.warning },
    info: { color: theme.colors.info },
    success: { color: theme.colors.success },
  };

  const containerStyle = [
    theme.components.alertContainer,
    alertStyles[type],
    style,
  ];

  const textStyle = [
    { fontSize: theme.typography.fontSize.sm },
    textStyles[type],
  ];

  return (
    <View style={containerStyle}>
      <ThemedText style={textStyle}>{message}</ThemedText>
    </View>
  );
}
