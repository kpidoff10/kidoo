/**
 * Register Form Component
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { TextInput, PasswordInput, Button, Text } from '@/components/ui';
import { useTheme } from '@/theme';

const registerSchema = z
  .object({
    name: z.string().min(1, 'auth.errors.nameRequired'),
    email: z.string().email('auth.errors.emailInvalid').min(1, 'auth.errors.emailRequired'),
    password: z.string().min(8, 'auth.errors.passwordTooShort'),
    confirmPassword: z.string().min(1, 'auth.errors.passwordRequired'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'auth.errors.passwordMismatch',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSubmit: (data: { name: string; email: string; password: string }) => Promise<void>;
  onLoginPress: () => void;
  isLoading: boolean;
}

export function RegisterForm({ onSubmit, onLoginPress, isLoading }: RegisterFormProps) {
  const { t } = useTranslation();
  const { spacing } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleFormSubmit = (data: RegisterFormData) => {
    const { confirmPassword, ...submitData } = data;
    return onSubmit(submitData);
  };

  return (
    <View style={styles.form}>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label={t('auth.register.name')}
            placeholder={t('auth.register.namePlaceholder')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.name ? t(errors.name.message as string) : undefined}
            autoCapitalize="words"
            containerStyle={{ marginBottom: spacing[4] }}
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label={t('auth.register.email')}
            placeholder={t('auth.register.emailPlaceholder')}
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
            label={t('auth.register.password')}
            placeholder={t('auth.register.passwordPlaceholder')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.password ? t(errors.password.message as string) : undefined}
            containerStyle={{ marginBottom: spacing[4] }}
          />
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <PasswordInput
            label={t('auth.register.confirmPassword')}
            placeholder={t('auth.register.confirmPasswordPlaceholder')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.confirmPassword ? t(errors.confirmPassword.message as string) : undefined}
            containerStyle={{ marginBottom: spacing[6] }}
          />
        )}
      />

      <Button
        title={t('auth.register.submit')}
        onPress={handleSubmit(handleFormSubmit)}
        loading={isLoading}
        disabled={isLoading}
        fullWidth
      />

      <View style={[styles.footer, { marginTop: spacing[6] }]}>
        <Text color="secondary">{t('auth.register.hasAccount')}</Text>
        <TouchableOpacity onPress={onLoginPress}>
          <Text color="primary" bold style={{ marginLeft: spacing[1] }}>
            {t('auth.register.login')}
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
