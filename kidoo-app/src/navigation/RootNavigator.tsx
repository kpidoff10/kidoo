/**
 * Root Navigator
 * Gère l'authentification et la navigation principale
 */

import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@/theme';
import { useAuth, BluetoothProvider, KidooProvider } from '@/contexts';
import { BluetoothSheets } from '@/contexts/bluetooth/BluetoothSheets';
import { ScreenLoader } from '@/components/ui';
import { LoginScreen, RegisterScreen, EditProfileScreen, KidooDetailScreen, BedtimeConfigScreen, WakeupConfigScreen } from '@/screens';
import { AppNavigator } from './AppNavigator';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { colors, isDark } = useTheme();
  const { isAuthenticated, isLoading } = useAuth();

  // Afficher un loader pendant la vérification de l'auth
  if (isLoading) {
    return <ScreenLoader />;
  }

  const navigationTheme = {
    ...DefaultTheme,
    dark: isDark,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.error,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      {isAuthenticated ? (
        // User connecté → App avec providers
        <BluetoothProvider>
          <KidooProvider>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="MainTabs" component={AppNavigator} />
              <Stack.Screen
                name="EditProfile"
                component={EditProfileScreen}
                options={({ navigation }) => ({
                  headerShown: true,
                  title: '',
                  headerBackTitle: '',
                  headerTintColor: colors.text,
                  headerStyle: {
                    backgroundColor: colors.background,
                  },
                })}
              />
              <Stack.Screen
                name="KidooDetail"
                component={KidooDetailScreen}
                options={({ route, navigation }) => {
                  // Récupérer le kidooId depuis les params
                  const { kidooId } = (route.params as { kidooId?: string }) || {};
                  // Le titre sera géré dans le composant via useLayoutEffect
                  return {
                    headerShown: true,
                    title: '',
                    headerBackTitle: '',
                    headerTintColor: colors.text,
                    headerStyle: {
                      backgroundColor: colors.background,
                    },
                  };
                }}
              />
              <Stack.Screen
                name="BedtimeConfig"
                component={BedtimeConfigScreen}
                options={({ navigation }) => ({
                  headerShown: true,
                  title: '',
                  headerBackTitle: '',
                  headerTintColor: colors.text,
                  headerStyle: {
                    backgroundColor: colors.background,
                  },
                })}
              />
              <Stack.Screen
                name="WakeupConfig"
                component={WakeupConfigScreen}
                options={({ navigation }) => ({
                  headerShown: true,
                  title: '',
                  headerBackTitle: '',
                  headerTintColor: colors.text,
                  headerStyle: {
                    backgroundColor: colors.background,
                  },
                })}
              />
            </Stack.Navigator>
            <BluetoothSheets />
          </KidooProvider>
        </BluetoothProvider>
      ) : (
        // User non connecté → Auth
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
              headerShown: true,
              headerTitle: '',
              headerBackTitle: '',
              headerTransparent: true,
              headerTintColor: colors.text,
            }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
