/**
 * Login Form Component
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { TextInput, PasswordInput, Button, Text } from '@/components/ui';
import { useTheme } from '@/theme';

const loginSchema = z.object({
  email: z.string().email('auth.errors.emailInvalid').min(1, 'auth.errors.emailRequired'),
  password: z.string().min(1, 'auth.errors.passwordRequired'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  onRegisterPress: () => void;
  isLoading: boolean;
}

export function LoginForm({ onSubmit, onRegisterPress, isLoading }: LoginFormProps) {
  const { t } = useTranslation();
  const { spacing } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <View style={styles.form}>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label={t('auth.login.email')}
            placeholder={t('auth.login.emailPlaceholder')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.email ? t(errors.email.message as string) : undefined}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            containerStyle={{ marginBottom: spacing[4] }}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <PasswordInput
            label={t('auth.login.password')}
            placeholder={t('auth.login.passwordPlaceholder')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.password ? t(errors.password.message as string) : undefined}
            containerStyle={{ marginBottom: spacing[6] }}
          />
        )}
      />

      <Button
        title={t('auth.login.submit')}
        onPress={handleSubmit(onSubmit)}
        loading={isLoading}
        disabled={isLoading}
        fullWidth
      />

      <View style={[styles.footer, { marginTop: spacing[6] }]}>
        <Text color="secondary">{t('auth.login.noAccount')}</Text>
        <TouchableOpacity onPress={onRegisterPress}>
          <Text color="primary" bold style={{ marginLeft: spacing[1] }}>
            {t('auth.login.createAccount')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
