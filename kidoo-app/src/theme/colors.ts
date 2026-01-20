/**
 * Palette de couleurs Kidoo
 * Light et Dark mode
 */

export const lightColors = {
  // Primary
  primary: '#6366F1',
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',

  // Background
  background: '#FFFFFF',
  backgroundSecondary: '#F9FAFB',
  backgroundTertiary: '#F3F4F6',

  // Surface (cards, modals)
  surface: '#FFFFFF',
  surfaceSecondary: '#F9FAFB',

  // Text
  text: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',

  // Border
  border: '#E5E7EB',
  borderLight: '#F3F4F6',

  // Status
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  // Online/Offline
  online: '#10B981',
  offline: '#9CA3AF',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',

  // Shadow
  shadow: '#000000',
};

export const darkColors = {
  // Primary
  primary: '#818CF8',
  primaryLight: '#A5B4FC',
  primaryDark: '#6366F1',

  // Background
  background: '#111827',
  backgroundSecondary: '#1F2937',
  backgroundTertiary: '#374151',

  // Surface (cards, modals)
  surface: '#1F2937',
  surfaceSecondary: '#374151',

  // Text
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textTertiary: '#9CA3AF',
  textInverse: '#111827',

  // Border
  border: '#374151',
  borderLight: '#4B5563',

  // Status
  success: '#34D399',
  successLight: '#064E3B',
  warning: '#FBBF24',
  warningLight: '#78350F',
  error: '#F87171',
  errorLight: '#7F1D1D',
  info: '#60A5FA',
  infoLight: '#1E3A8A',

  // Online/Offline
  online: '#34D399',
  offline: '#6B7280',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.7)',

  // Shadow
  shadow: '#000000',
};

export type Colors = typeof lightColors;
