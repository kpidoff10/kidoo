/**
 * Home Screen
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Title, Text, Card } from '@/components/ui';
import { useTheme } from '@/theme';
import { useKidoos, useProfile } from '@/hooks';
import { WelcomeCard } from './components/WelcomeCard';

export function HomeScreen() {
  const { t } = useTranslation();
  const { colors, spacing } = useTheme();
  const { data: user } = useProfile();
  const { data: kidoos } = useKidoos();

  const kidoosList = Array.isArray(kidoos) ? kidoos : [];
  const onlineKidoos = kidoosList.filter((k) => k.isConnected).length;
  const totalKidoos = kidoosList.length;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { padding: spacing[4] }]}
    >
      <WelcomeCard userName={user?.name || ''} />

      <View style={{ marginTop: spacing[6] }}>
        <Title level="h3">{t('kidoos.title')}</Title>

        <View style={[styles.statsContainer, { marginTop: spacing[4], gap: spacing[4] }]}>
          <Card style={styles.statCard} variant="elevated">
            <Text variant="caption" color="secondary">
              Total
            </Text>
            <Title level="h2">{totalKidoos}</Title>
          </Card>

          <Card style={styles.statCard} variant="elevated">
            <Text variant="caption" color="secondary">
              {t('kidoos.online')}
            </Text>
            <Title level="h2" style={{ color: colors.success }}>
              {onlineKidoos}
            </Title>
          </Card>
        </View>
      </View>

      {totalKidoos === 0 && (
        <Card style={{ marginTop: spacing[6] }}>
          <Text color="secondary" center>
            {t('home.noKidoos')}
          </Text>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  statsContainer: {
    flexDirection: 'row',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
});
