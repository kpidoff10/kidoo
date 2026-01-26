/**
 * Kidoo Not Found Component
 * Affiche un message d'erreur quand le Kidoo n'est pas trouvé
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Button, ContentScrollView } from '@/components/ui';
import { useTheme } from '@/theme';

export function KidooNotFound() {
  const { t } = useTranslation();
  const { colors, spacing } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ContentScrollView>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
          <Button
            title={t('common.back', { defaultValue: 'Retour' })}
            onPress={() => navigation.goBack()}
            style={{ marginTop: spacing[4] }}
          />
        </View>
      </ContentScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
});
