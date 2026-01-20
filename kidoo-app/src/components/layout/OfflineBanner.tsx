/**
 * Offline Banner Component
 * Affiché quand l'utilisateur est hors ligne
 */

import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui';
import { useTheme } from '@/theme';
import { useNetwork } from '@/contexts';

export function OfflineBanner() {
  const { t } = useTranslation();
  const { colors, spacing } = useTheme();
  const { isConnected } = useNetwork();
  const insets = useSafeAreaInsets();

  if (isConnected) {
    return null;
  }

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: colors.warning,
          paddingTop: insets.top + spacing[2],
          paddingBottom: spacing[2],
          paddingHorizontal: spacing[4],
        },
      ]}
    >
      <Ionicons name="cloud-offline-outline" size={18} color={colors.textInverse} />
      <Text style={{ color: colors.textInverse, marginLeft: spacing[2] }}>
        {t('common.offline')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
