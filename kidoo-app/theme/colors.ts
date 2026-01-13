/**
 * Couleurs du thème de l'application
 * Toutes les couleurs utilisées dans l'application sont définies ici
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const themeColors = {
  light: {
    // Couleurs de base
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,

    // Couleurs de surface
    surface: '#ffffff',
    surfaceSecondary: '#f5f5f5',
    surfaceTertiary: '#f0f0f0',

    // Couleurs de carte/container
    card: '#ffffff',
    cardSecondary: '#f5f5f5',

    // Couleurs de bordure
    border: 'rgba(0, 0, 0, 0.1)',
    borderLight: 'rgba(0, 0, 0, 0.05)',

    // Couleurs d'état
    success: '#4caf50',
    successBackground: 'rgba(76, 175, 80, 0.1)',
    successBackgroundSolid: '#e8f5e9',
    warning: '#ff9800',
    warningBackground: '#fff3e0',
    error: '#ef4444',
    errorBackground: '#ffebee',
    errorDark: '#c62828',
    info: '#1565c0',
    infoBackground: '#e3f2fd',

    // Couleurs de texte secondaire
    textSecondary: '#687076',
    textTertiary: 'rgba(0, 0, 0, 0.6)',
    textDisabled: 'rgba(0, 0, 0, 0.4)',
  },
  dark: {
    // Couleurs de base
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,

    // Couleurs de surface
    surface: '#1a1a1a',
    surfaceSecondary: '#2a2a2a',
    surfaceTertiary: '#1f1f1f',

    // Couleurs de carte/container
    card: '#2a2a2a',
    cardSecondary: '#1a1a1a',

    // Couleurs de bordure
    border: 'rgba(255, 255, 255, 0.1)',
    borderLight: 'rgba(255, 255, 255, 0.05)',

    // Couleurs d'état
    success: '#81c784',
    successBackground: 'rgba(76, 175, 80, 0.2)',
    successBackgroundSolid: '#1f3d1f',
    warning: '#ffa726',
    warningBackground: '#3d2f1f',
    error: '#ff6b6b',
    errorBackground: '#3d1f1f',
    errorDark: '#ff6b6b',
    info: '#64b5f6',
    infoBackground: '#1f3d3d',

    // Couleurs de texte secondaire
    textSecondary: '#9BA1A6',
    textTertiary: 'rgba(255, 255, 255, 0.7)',
    textDisabled: 'rgba(255, 255, 255, 0.4)',
  },
} as const;

// Couleurs statiques (ne changent pas selon le thème)
export const staticColors = {
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
  
  // RSSI colors
  rssiExcellent: '#4caf50',
  rssiGood: '#ff9800',
  rssiPoor: '#f44336',
  
  // Success/Error states
  successGreen: '#4caf50',
  errorRed: '#ef4444',
  warningOrange: '#ff9800',
  infoBlue: '#1565c0',
} as const;

export type ThemeColors = typeof themeColors.light;
