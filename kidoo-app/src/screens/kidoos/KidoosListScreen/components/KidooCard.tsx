/**
 * Kidoo Card Component
 */

import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Card, Text } from '@/components/ui';
import { useTheme } from '@/theme';
import { Kidoo } from '@/api';
import { getKidooModelDisplayName, getKidooModelIcon } from '@/config';
import moment from 'moment';

interface KidooCardProps {
  kidoo: Kidoo;
  onPress: () => void;
}

export function KidooCard({ kidoo, onPress }: KidooCardProps) {
  const { t } = useTranslation();
  const { colors, spacing } = useTheme();

  const getLastSeenText = () => {
    if (!kidoo.lastConnected) return null;
    return t('kidoos.lastSeen', { time: moment(kidoo.lastConnected).fromNow() });
  };

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: 'transparent' }}
      style={({ pressed }) => [
        { marginBottom: 12 },
        pressed && { opacity: 0.7 },
      ]}
    >
      <Card variant="elevated" style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={getKidooModelIcon(kidoo.model) as any}
              size={32}
              color={kidoo.isConnected ? colors.primary : colors.textTertiary}
            />
          </View>

          <View style={[styles.info, { marginLeft: spacing[3] }]}>
            <Text bold>{kidoo.name}</Text>
            <Text variant="caption" color="secondary">
              {t('kidoos.model')}: {getKidooModelDisplayName(kidoo.model)}
            </Text>
          </View>
        </View>

        {!kidoo.isConnected && kidoo.lastConnected && (
          <Text
            variant="caption"
            color="tertiary"
            style={{ marginTop: spacing[2] }}
          >
            {getLastSeenText()}
          </Text>
        )}
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
});
