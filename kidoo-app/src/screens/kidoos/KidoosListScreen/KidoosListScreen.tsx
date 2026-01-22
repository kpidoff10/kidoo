/**
 * Kidoos List Screen
 */

import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Text, ScreenLoader } from '@/components/ui';
import { useTheme } from '@/theme';
import { useKidoos } from '@/hooks';
import { useBluetooth } from '@/contexts';
import { Kidoo } from '@/api';
import { KidooCard } from './components/KidooCard';

export function KidoosListScreen() {
  const { t } = useTranslation();
  const { colors, spacing } = useTheme();
  const { data: kidoos, isLoading, refetch, isRefetching } = useKidoos();
  const { startScan } = useBluetooth();

  const handleKidooPress = (kidoo: Kidoo) => {
    // TODO: Navigate to detail or open modal
    console.log('Kidoo pressed:', kidoo.id);
  };

  const handleFloatingButtonPress = useCallback(() => {
    startScan();
  }, [startScan]);

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
          { padding: spacing[4], paddingBottom: spacing[20] }, // Espace pour le FAB
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

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={handleFloatingButtonPress}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={colors.textInverse} />
      </TouchableOpacity>
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
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
