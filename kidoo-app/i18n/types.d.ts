// Types pour i18n - Améliore l'autocomplétion dans l'IDE
import 'react-i18next';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: typeof import('./locales/fr.json');
    };
  }
}
