import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import '@/i18n/config';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';
import { QueryProvider } from '@/providers/QueryProvider';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { NavigationProvider } from '@/contexts/NavigationContext';
import { BluetoothProvider } from '@/contexts/BluetoothContext';
import { NetworkErrorProvider } from '@/contexts/NetworkErrorContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const colorScheme = useColorScheme();
  const theme = useTheme();

  // Gérer la fermeture du splash screen
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let safetyTimeout: ReturnType<typeof setTimeout>;
    let hasHidden = false;
    
    const hideSplashScreen = async () => {
      if (hasHidden) {
        console.log('🔄 Splash screen déjà fermé, skip');
        return;
      }
      
      try {
        hasHidden = true;
        console.log('🔄 Tentative de fermeture du splash screen...');
        await SplashScreen.hideAsync();
        console.log('✅ Splash screen fermé avec succès');
      } catch (error) {
        console.error('❌ Erreur lors de la fermeture du splash screen:', error);
        hasHidden = false; // Réessayer si erreur
      }
    };

    console.log('🔄 [SplashScreen] isLoading:', isLoading);

    // Si le chargement est terminé, fermer le splash screen
    if (!isLoading) {
      console.log('🔄 [SplashScreen] Chargement terminé, fermeture dans 100ms...');
      // Petit délai pour s'assurer que tout est prêt
      timeoutId = setTimeout(() => {
        hideSplashScreen();
      }, 100);
    } else {
      console.log('🔄 [SplashScreen] En attente du chargement...');
    }

    // Timeout de sécurité : fermer le splash screen après 3 secondes maximum (plus court en dev)
    safetyTimeout = setTimeout(() => {
      if (!hasHidden) {
        console.warn('⚠️ [SplashScreen] Timeout de sécurité : fermeture après 3 secondes');
        hideSplashScreen();
      }
    }, 3000);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (safetyTimeout) clearTimeout(safetyTimeout);
    };
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Rediriger vers login si pas connecté
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Rediriger vers les tabs si connecté et sur auth
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments, router]);

  // Afficher un écran de chargement pendant la vérification de la session
  if (isLoading) {
    return (
      <View style={[theme.components.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.tint} />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="kidoo/[id]" options={{ presentation: 'modal', title: 'Détails du Kidoo' }} />
        <Stack.Screen name="kidoo/[id]/edit" options={{ presentation: 'modal', title: 'Modifier le Kidoo' }} />
        <Stack.Screen name="kidoo/[id]/tags" options={{ presentation: 'modal', title: 'Mes tags' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

// Styles supprimés - utilisent maintenant le thème

export default function RootLayout() {
  // Empêcher la fermeture automatique du splash screen
  useEffect(() => {
    console.log('🔄 [RootLayout] Initialisation du splash screen...');
    SplashScreen.preventAutoHideAsync()
      .then(() => {
        console.log('✅ [RootLayout] Splash screen configuré (preventAutoHideAsync)');
      })
      .catch((error) => {
        console.error('❌ [RootLayout] Erreur lors de la prévention de la fermeture automatique:', error);
      });
  }, []);

  // Configurer le gestionnaire d'erreur global pour capturer les crashes
  useEffect(() => {
    // Utiliser une approche simple compatible avec Expo
    // ErrorUtils est disponible globalement dans React Native mais pas via require
    try {
      // Accéder à ErrorUtils via le contexte global de React Native
      // @ts-ignore - ErrorUtils est disponible globalement
      const ErrorUtils = global.ErrorUtils || (global as any).ErrorUtils;
      
      if (ErrorUtils && typeof ErrorUtils.setGlobalHandler === 'function') {
        const originalHandler = ErrorUtils.getGlobalHandler?.();
        
        ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
          console.error('🚨 ========== ERREUR GLOBALE NON GÉRÉE ==========');
          console.error('🚨 Erreur:', error);
          console.error('🚨 Message:', error?.message || 'Pas de message');
          console.error('🚨 Stack:', error?.stack || 'Pas de stack');
          console.error('🚨 Fatal:', isFatal);
          console.error('🚨 Nom:', error?.name || 'Unknown');
          if (error && typeof error === 'object') {
            try {
              console.error('🚨 Erreur complète:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
            } catch {
              console.error('🚨 Impossible de sérialiser l\'erreur');
            }
          }
          console.error('🚨 ============================================');
          
          // Appeler le handler original
          if (originalHandler) {
            try {
              originalHandler(error, isFatal);
            } catch (handlerError) {
              console.error('🚨 Erreur dans le handler original:', handlerError);
            }
          }
        });
        
        return () => {
          if (originalHandler && ErrorUtils.setGlobalHandler) {
            try {
              ErrorUtils.setGlobalHandler(originalHandler);
            } catch {
              // Ignorer les erreurs de restauration
            }
          }
        };
      } else {
        console.warn('🚨 ErrorUtils non disponible via global, les erreurs seront loggées normalement');
      }
    } catch (setupError) {
      console.error('🚨 Erreur lors de la configuration du gestionnaire d\'erreur:', setupError);
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryProvider>
          <AuthProvider>
            <BluetoothProvider>
              <BottomSheetModalProvider>
                <NetworkErrorProvider>
                <NavigationProvider>
                  <RootLayoutNav />
                </NavigationProvider>
                </NetworkErrorProvider>
              </BottomSheetModalProvider>
            </BluetoothProvider>
          </AuthProvider>
        </QueryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
