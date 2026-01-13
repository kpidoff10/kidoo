/**
 * Écran de connexion
 */

import React, { useState } from 'react';
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
import type { LoginInput } from '@/services/authService';
import { loginSchema } from '@/types/shared';
import type { z } from 'zod';
import { AuthHeader, FormField, AuthButton, AuthLink } from '@/screens/auth';

export default function LoginScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const [formData, setFormData] = useState<LoginInput>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue: z.ZodIssue) => {
        const path = (issue.path[0] as string) || 'unknown';
        newErrors[path] = issue.message;
      });
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
      const result = await login(formData);
      if (result.success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert(
          t('common.error'),
          result.error || t('auth.login.errors.invalidCredentials')
        );
        if (result.field) {
          setErrors({ [result.field]: result.error || '' });
        }
      }
    } catch {
      Alert.alert(t('common.error'), t('auth.login.errors.invalidCredentials'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.email.length > 0 && formData.password.length > 0;

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
          title={t('auth.login.title')}
          subtitle={t('auth.login.subtitle')}
        />

        <View style={theme.components.authScreenForm}>
          <FormField
            label={t('auth.login.email')}
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
            label={t('auth.login.password')}
            value={formData.password}
            onChangeText={(text) => {
              setFormData({ ...formData, password: text });
              if (errors.password) setErrors({ ...errors, password: '' });
            }}
            placeholder="••••••••"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            error={errors.password}
          />

          <AuthButton
            label={t('auth.login.loginButton')}
            onPress={handleSubmit}
            disabled={!isFormValid}
            loading={isSubmitting || isLoading}
          />

          <AuthLink
            prompt={t('auth.login.noAccount')}
            linkText={t('auth.login.signUp')}
            onPress={() => router.push('/(auth)/register')}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Styles supprimés - utilisent maintenant le thème
