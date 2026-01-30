/**
 * Kidoo App - Main Entry Point
 */

import React from 'react';
import { StatusBar, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TrueSheetProvider } from '@lodev09/react-native-true-sheet';
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
import { ErrorBoundary, OfflineBanner } from '@/components';
import { createToastConfig } from '@/components/ui';

// Navigation
import { RootNavigator } from '@/navigation';

// Prevent splash screen from auto hiding
SplashScreen.preventAutoHideAsync();

// i18n - Import après les autres pour éviter les problèmes d'initialisation
import '@/i18n';

function AppContent() {
  const { colors, isDark } = useTheme();

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
        <TrueSheetProvider>
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
        </TrueSheetProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
