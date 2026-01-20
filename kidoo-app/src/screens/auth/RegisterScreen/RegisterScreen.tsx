/**
 * Register Screen
 */

import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Title, Text } from '@/components/ui';
import { useTheme } from '@/theme';
import { useAuth } from '@/contexts';
import { RegisterForm } from './RegisterForm';

export function RegisterScreen() {
  const { t } = useTranslation();
  const { colors, spacing } = useTheme();
  const navigation = useNavigation();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (data: { name: string; email: string; password: string }) => {
    setIsLoading(true);
    try {
      await register(data);
    } catch (error) {
      // Error handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginPress = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { padding: spacing[6] }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Title level="h1" center>
            {t('auth.register.title')}
          </Title>
          <Text color="secondary" center style={{ marginTop: spacing[2] }}>
            {t('auth.register.subtitle')}
          </Text>
        </View>

        <View style={[styles.formContainer, { marginTop: spacing[8] }]}>
          <RegisterForm
            onSubmit={handleRegister}
            onLoginPress={handleLoginPress}
            isLoading={isLoading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
  },
  formContainer: {
    width: '100%',
  },
});
