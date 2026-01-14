/**
 * Écran d'inscription
 */

import { useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/contexts/AuthContext';
import type { RegisterInput } from '@/services/authService';
import { registerSchema } from '@/types/shared';
import type { z } from 'zod';
import { AuthHeader, FormField, AuthButton, AuthLink } from '@/screens/auth';

export default function RegisterScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const { register, isLoading } = useAuth();

  const [formData, setFormData] = useState<RegisterInput & { confirmPassword: string }>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    // Validation avec Zod
    const result = registerSchema.safeParse({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    const newErrors: Record<string, string> = {};

    if (!result.success) {
      result.error.issues.forEach((issue: z.ZodIssue) => {
        const path = (issue.path[0] as string) || 'unknown';
        newErrors[path] = issue.message;
      });
    }

    // Vérifier la confirmation du mot de passe
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.register.errors.passwordsNotMatch');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        Alert.alert(t('auth.register.success'), '', [
          {
            text: t('common.close'),
            onPress: () => router.replace('/(tabs)'),
          },
        ]);
      } else {
        Alert.alert(
          t('common.error'),
          result.error || t('auth.register.errors.emailExists')
        );
        if (result.field) {
          setErrors({ [result.field]: result.error || '' });
        }
      }
    } catch {
      Alert.alert(t('common.error'), t('auth.register.errors.emailExists'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.name.length > 0 &&
    formData.email.length > 0 &&
    formData.password.length > 0 &&
    formData.confirmPassword.length > 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[theme.components.screenContainer, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={theme.components.authScreenScrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <AuthHeader
          title={t('auth.register.title')}
          subtitle={t('auth.register.subtitle')}
        />

        <View style={theme.components.authScreenForm}>
          <FormField
            label={t('auth.register.name')}
            value={formData.name}
            onChangeText={(text) => {
              setFormData({ ...formData, name: text });
              if (errors.name) setErrors({ ...errors, name: '' });
            }}
            placeholder="Jean Dupont"
            autoCapitalize="words"
            autoComplete="name"
            error={errors.name}
          />

          <FormField
            label={t('auth.register.email')}
            value={formData.email}
            onChangeText={(text) => {
              setFormData({ ...formData, email: text });
              if (errors.email) setErrors({ ...errors, email: '' });
            }}
            placeholder="exemple@email.com"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            error={errors.email}
          />

          <FormField
            label={t('auth.register.password')}
            value={formData.password}
            onChangeText={(text) => {
              setFormData({ ...formData, password: text });
              if (errors.password) setErrors({ ...errors, password: '' });
              if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
            }}
            placeholder="••••••••"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password-new"
            error={errors.password}
          />

          <FormField
            label={t('auth.register.confirmPassword')}
            value={formData.confirmPassword}
            onChangeText={(text) => {
              setFormData({ ...formData, confirmPassword: text });
              if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
            }}
            placeholder="••••••••"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password-new"
            error={errors.confirmPassword}
          />

          <AuthButton
            label={t('auth.register.registerButton')}
            onPress={handleSubmit}
            disabled={!isFormValid}
            loading={isSubmitting || isLoading}
          />

          <AuthLink
            prompt={t('auth.register.haveAccount')}
            linkText={t('auth.register.signIn')}
            onPress={() => router.push('/(auth)/login')}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Styles supprimés - utilisent maintenant le thème
