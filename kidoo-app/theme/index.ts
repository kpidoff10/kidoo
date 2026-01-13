/**
 * Export centralisé du système de thème
 */

export * from './colors';
export * from './spacing';
export * from './shadows';
export * from './typography';
export * from './components';

// Réexport pour compatibilité avec l'ancien système
export { themeColors as Colors } from './colors';
export { typography as Fonts } from './typography';
