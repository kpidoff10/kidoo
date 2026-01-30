/**
 * Kidoo App - Entry Point
 */

import * as Sentry from '@sentry/react-native';
import { registerRootComponent } from 'expo';
import { App } from './src/App.tsx';

// Initialiser Sentry AVANT tout le reste
// Le DSN sera configuré via EXPO_PUBLIC_SENTRY_DSN ou SENTRY_DSN
const sentryDsn = process.env.EXPO_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;

if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    enableInExpoDevelopment: true, // Activer pour tester en dev
    debug: __DEV__, // Activer le debug uniquement en développement
    environment: __DEV__ ? 'development' : 'production',
    // Options supplémentaires
    tracesSampleRate: __DEV__ ? 1.0 : 0.1, // 100% en dev, 10% en prod pour les performances
    enableAutoSessionTracking: true,
    enableNativeCrashHandling: true,
    // Capturer toutes les erreurs non catchées
    beforeSend(event, hint) {
      // Toujours envoyer l'événement
      return event;
    },
    // Capturer les erreurs de promesses non gérées
    enableCaptureFailedRequests: true,
  });
  
  // Capturer les erreurs globales non catchées
  if (typeof ErrorUtils !== 'undefined') {
    const originalHandler = ErrorUtils.getGlobalHandler();
    ErrorUtils.setGlobalHandler((error, isFatal) => {
      Sentry.captureException(error, {
        tags: {
          isFatal: String(isFatal),
          unhandled: 'true',
        },
      });
      if (originalHandler) {
        originalHandler(error, isFatal);
      }
    });
  }
}

registerRootComponent(App);
