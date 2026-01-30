/**
 * Utilitaires Sentry
 * Fonctions helper pour capturer les erreurs et les événements
 */

import * as Sentry from '@sentry/react-native';

/**
 * Capture une erreur dans Sentry
 */
export function captureError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    extra: context,
  });
}

/**
 * Capture un message dans Sentry
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  Sentry.captureMessage(message, level);
}

/**
 * Ajoute du contexte utilisateur à Sentry
 */
export function setUser(user: { id?: string; email?: string; username?: string }) {
  Sentry.setUser(user);
}

/**
 * Ajoute du contexte supplémentaire à Sentry
 */
export function setContext(key: string, context: Record<string, any>) {
  Sentry.setContext(key, context);
}

/**
 * Ajoute des tags à Sentry
 */
export function setTag(key: string, value: string) {
  Sentry.setTag(key, value);
}

/**
 * Ajoute du breadcrumb (trace d'événements)
 */
export function addBreadcrumb(breadcrumb: Sentry.Breadcrumb) {
  Sentry.addBreadcrumb(breadcrumb);
}
