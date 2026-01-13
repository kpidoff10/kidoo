/**
 * Contexte pour gérer les erreurs réseau de manière centralisée
 * Affiche automatiquement une modale lors d'erreurs de connexion au serveur
 */

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { setNetworkErrorCallback } from '@/services/api';

interface NetworkErrorContextType {
  showError: (error: NetworkError) => void;
  hideError: () => void;
  isVisible: boolean;
}

interface NetworkError {
  message: string;
  endpoint?: string;
  retry?: () => Promise<unknown>;
}

const NetworkErrorContext = createContext<NetworkErrorContextType | undefined>(undefined);

export function NetworkErrorProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<NetworkError | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const bottomSheetRef = useRef<React.ElementRef<typeof BottomSheet>>(null);
  const { t } = useTranslation();
  const theme = useTheme();

  const showError = useCallback((networkError: NetworkError) => {
    setError(networkError);
    setIsVisible(true);
    bottomSheetRef.current?.present();
  }, []);

  const hideError = useCallback(() => {
    setIsVisible(false);
    setError(null);
    bottomSheetRef.current?.dismiss();
  }, []);

  // Enregistrer le callback dans api.ts au montage du provider
  useEffect(() => {
    setNetworkErrorCallback(showError);
    return () => {
      setNetworkErrorCallback(null);
    };
  }, [showError]);

  const handleRetry = useCallback(async () => {
    if (error?.retry) {
      hideError();
      try {
        await error.retry();
      } catch {
        // Si le retry échoue, on réaffiche l'erreur
        showError({
          message: error.message,
          endpoint: error.endpoint,
          retry: error.retry,
        });
      }
    }
  }, [error, hideError, showError]);

  return (
    <NetworkErrorContext.Provider value={{ showError, hideError, isVisible }}>
      {children}
      <BottomSheet
        ref={bottomSheetRef}
        onDismiss={hideError}
        enablePanDownToClose={true}
      >
        <View style={styles.container}>
          <View style={styles.content}>
            <ThemedText style={[styles.title, { color: theme.colors.error }]}>
              {t('networkError.title', 'Erreur de connexion')}
            </ThemedText>
            <ThemedText style={styles.message}>
              {error?.message || t('networkError.message', 'Impossible de se connecter au serveur')}
            </ThemedText>
            {error?.endpoint && (
              <ThemedText style={[styles.endpoint, { color: theme.colors.textSecondary }]}>
                {t('networkError.endpoint', 'Endpoint')}: {error.endpoint}
              </ThemedText>
            )}
          </View>
          <View style={styles.actions}>
            {error?.retry && (
              <Button
                label={t('networkError.retry', 'Réessayer')}
                onPress={handleRetry}
                style={styles.retryButton}
              />
            )}
            <Button
              label={t('networkError.close', 'Fermer')}
              onPress={hideError}
              variant="outline"
              style={styles.closeButton}
            />
          </View>
        </View>
      </BottomSheet>
    </NetworkErrorContext.Provider>
  );
}

export function useNetworkError() {
  const context = useContext(NetworkErrorContext);
  if (context === undefined) {
    throw new Error('useNetworkError must be used within a NetworkErrorProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  content: {
    flex: 1,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 22,
  },
  endpoint: {
    fontSize: 12,
    marginTop: 8,
    fontFamily: 'monospace',
  },
  actions: {
    gap: 12,
  },
  retryButton: {
    marginBottom: 0,
  },
  closeButton: {
    marginBottom: 0,
  },
});
