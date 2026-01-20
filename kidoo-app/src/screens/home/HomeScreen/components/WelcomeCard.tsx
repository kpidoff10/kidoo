/**
 * Welcome Card Component
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Card, Title, Text, Avatar } from '@/components/ui';
import { useTheme } from '@/theme';

interface WelcomeCardProps {
  userName: string;
}

export function WelcomeCard({ userName }: WelcomeCardProps) {
  const { t } = useTranslation();
  const { spacing, colors } = useTheme();

  return (
    <Card
      variant="elevated"
      style={[styles.card, { backgroundColor: colors.primary }]}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={{ color: colors.textInverse, opacity: 0.9 }}>
            {t('home.welcome')}
          </Text>
          <Title level="h2" style={{ color: colors.textInverse, marginTop: spacing[1] }}>
            {userName} 👋
          </Title>
        </View>
        <Avatar name={userName} size="lg" />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {},
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
});
