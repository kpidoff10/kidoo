/**
 * Kidoos List Screen
 */

import React from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text, ScreenLoader } from '@/components/ui';
import { useTheme } from '@/theme';
import { useKidoos } from '@/hooks';
import { Kidoo } from '@/api';
import { KidooCard } from './components/KidooCard';

export function KidoosListScreen() {
  const { t } = useTranslation();
  const { colors, spacing } = useTheme();
  const { data: kidoos, isLoading, refetch, isRefetching } = useKidoos();

  const handleKidooPress = (kidoo: Kidoo) => {
    // TODO: Navigate to detail or open modal
    console.log('Kidoo pressed:', kidoo.id);
  };

  const renderItem = ({ item }: { item: Kidoo }) => (
    <KidooCard kidoo={item} onPress={() => handleKidooPress(item)} />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text color="secondary" center>
        {t('kidoos.empty')}
      </Text>
      <Text variant="caption" color="tertiary" center style={{ marginTop: spacing[2] }}>
        {t('kidoos.emptyDescription')}
      </Text>
    </View>
  );

  if (isLoading) {
    return <ScreenLoader />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={kidoos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { padding: spacing[4] },
          (!kidoos || kidoos.length === 0) && styles.emptyList,
        ]}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
  },
  emptyList: {
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
});
