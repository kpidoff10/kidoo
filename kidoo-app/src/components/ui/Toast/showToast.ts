/**
 * Toast Helper
 * Fonctions utilitaires pour afficher les toasts
 */

import Toast from 'react-native-toast-message';

interface ToastOptions {
  title: string;
  message?: string;
  duration?: number;
}

export const showToast = {
  success: ({ title, message, duration = 3000 }: ToastOptions) => {
    Toast.show({
      type: 'success',
      text1: title,
      text2: message,
      visibilityTime: duration,
    });
  },

  error: ({ title, message, duration = 4000 }: ToastOptions) => {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message,
      visibilityTime: duration,
    });
  },

  warning: ({ title, message, duration = 3500 }: ToastOptions) => {
    Toast.show({
      type: 'warning',
      text1: title,
      text2: message,
      visibilityTime: duration,
    });
  },

  info: ({ title, message, duration = 3000 }: ToastOptions) => {
    Toast.show({
      type: 'info',
      text1: title,
      text2: message,
      visibilityTime: duration,
    });
  },

  hide: () => {
    Toast.hide();
  },
};
