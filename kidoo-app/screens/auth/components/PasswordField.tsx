/**
 * Composant de champ de mot de passe avec icône pour afficher/masquer
 */

import { useState } from 'react';
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface PasswordFieldProps extends Omit<TextInputProps, 'style' | 'secureTextEntry'> {
  label: string;
  error?: string;
  value: string;
  onChangeText: (text: string) => void;
}

export function PasswordField({
  label,
  error,
  value,
  onChangeText,
  ...textInputProps
}: PasswordFieldProps) {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <View style={[{ width: '100%' }, theme.components.formFieldContainer]}>
      <Text style={theme.components.formFieldLabel}>{label}</Text>
      <View style={{ position: 'relative' }}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={theme.colors.icon}
          secureTextEntry={!isVisible}
          style={[
            theme.components.formFieldInput,
            error && theme.components.formFieldInputError,
            { paddingRight: 48 }, // Espace pour l'icône
          ]}
          {...textInputProps}
        />
        <TouchableOpacity
          onPress={toggleVisibility}
          style={{
            position: 'absolute',
            right: theme.spacing.md,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: theme.spacing.xs,
          }}
          activeOpacity={0.7}
        >
          <IconSymbol
            name={isVisible ? 'eye.slash.fill' : 'eye.fill'}
            size={theme.iconSize.sm}
            color={theme.colors.icon}
          />
        </TouchableOpacity>
      </View>
      {error && <Text style={theme.components.formFieldError}>{error}</Text>}
    </View>
  );
}
