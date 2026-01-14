/**
 * Composant de champ de formulaire réutilisable
 */

import { View, Text, TextInput, TextInputProps } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

interface FormFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string;
  value: string;
  onChangeText: (text: string) => void;
}

export function FormField({
  label,
  error,
  value,
  onChangeText,
  ...textInputProps
}: FormFieldProps) {
  const theme = useTheme();

  return (
    <View style={[{ width: '100%' }, theme.components.formFieldContainer]}>
      <Text style={theme.components.formFieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={theme.colors.icon}
        style={[
          theme.components.formFieldInput,
          error && theme.components.formFieldInputError,
        ]}
        {...textInputProps}
      />
      {error && <Text style={theme.components.formFieldError}>{error}</Text>}
    </View>
  );
}
