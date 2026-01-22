/**
 * App Navigator
 * Navigation principale avec Bottom Tabs
 */

import React, { useCallback } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme';
import { HomeScreen, KidoosListScreen, ProfileSheet } from '@/screens';
import { Avatar } from '@/components/ui';
import { useBottomSheet } from '@/hooks/useBottomSheet';
import { useProfile } from '@/hooks/useProfile';
import { MainTabsParamList } from './types';

const Tab = createBottomTabNavigator<MainTabsParamList>();

export function AppNavigator() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { data: user } = useProfile();
  const profileSheet = useBottomSheet();

  const openProfileSheet = useCallback(() => {
    profileSheet.open();
  }, [profileSheet]);

  const closeProfileSheet = useCallback(() => {
    profileSheet.close();
  }, [profileSheet]);

  const ProfileButton = useCallback(
    () => (
      <TouchableOpacity
        onPress={openProfileSheet}
        style={styles.profileButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Avatar name={user?.name || ''} size="sm" />
      </TouchableOpacity>
    ),
    [user?.name, openProfileSheet]
  );

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerRight: ProfileButton,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textTertiary,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: t('home.title'),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Kidoos"
          component={KidoosListScreen}
          options={{
            title: t('kidoos.title'),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cube-outline" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>

      <ProfileSheet bottomSheet={profileSheet} onClose={closeProfileSheet} />
    </>
  );
}

const styles = StyleSheet.create({
  profileButton: {
    marginRight: 16,
  },
});
