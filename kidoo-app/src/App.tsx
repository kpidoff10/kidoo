/**
 * Kidoo App - Main Entry Point
 */

import React, { useEffect } from 'react';
import { StatusBar, useColorScheme, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import Toast from 'react-native-toast-message';
import * as SplashScreen from 'expo-splash-screen';

// Providers
import { ThemeProvider, useTheme } from '@/theme';
import { AuthProvider, NetworkProvider } from '@/contexts';
import { AppReadyProvider } from '@/contexts/AppReadyContext';
import { queryClient, asyncStoragePersister, persistOptions } from '@/lib/queryClient';

// Components
import { ErrorBoundary, OfflineBanner, createToastConfig } from '@/components';

// Navigation
import { RootNavigator } from '@/navigation';

// i18n
import '@/i18n';

// Prevent splash screen from auto hiding
SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { colors, isDark } = useTheme();
  const colorScheme = useColorScheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <OfflineBanner />
      <RootNavigator />
      <Toast config={createToastConfig(isDark)} />
    </View>
  );
}

export function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ErrorBoundary>
            <PersistQueryClientProvider
              client={queryClient}
              persistOptions={persistOptions}
            >
              <AppReadyProvider>
                <NetworkProvider>
                  <AuthProvider>
                    <AppContent />
                  </AuthProvider>
                </NetworkProvider>
              </AppReadyProvider>
            </PersistQueryClientProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
