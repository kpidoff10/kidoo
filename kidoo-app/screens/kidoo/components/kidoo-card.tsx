/**
 * Composant KidooCard
 * Affiche une carte pour un appareil Kidoo
 */

import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { Kidoo } from '@/types/shared';

interface KidooCardProps {
  kidoo: Kidoo;
  onPress?: () => void;
}

export function KidooCard({ kidoo, onPress }: KidooCardProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[theme.components.card, { marginBottom: theme.spacing.md }]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={theme.components.kidooCardHeader}>
        <View style={[
          theme.components.iconContainerLarge,
          { backgroundColor: kidoo.isConnected ? theme.colors.successBackground : theme.colors.surfaceSecondary }
        ]}>
          <IconSymbol
            name="cube.fill"
            size={theme.iconSize.md}
            color={kidoo.isConnected ? theme.colors.tint : theme.colors.icon}
          />
        </View>
        <View style={theme.components.kidooCardNameContainer}>
          <ThemedText type="defaultSemiBold" style={theme.components.kidooCardName}>
            {kidoo.name}
          </ThemedText>
          <ThemedText style={theme.components.kidooCardStatus}>
            {kidoo.isConnected ? t('kidoos.status.connected') : t('kidoos.status.disconnected')}
          </ThemedText>
        </View>
        {kidoo.isConnected && <View style={theme.components.kidooCardStatusDot} />}
      </View>
      {kidoo.macAddress && (
        <View style={theme.components.kidooCardInfo}>
          <ThemedText style={theme.components.kidooCardInfoText}>{kidoo.macAddress}</ThemedText>
        </View>
      )}
    </TouchableOpacity>
  );
}
