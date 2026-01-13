import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import fr from './locales/fr.json';
import en from './locales/en.json';

// Les fichiers JSON contiennent déjà la clé "translation" pour i18n Ally
// On extrait la clé "translation" pour i18next
const resources = {
  fr: { translation: fr.translation },
  en: { translation: en.translation },
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources,
  lng: Localization.getLocales()[0]?.languageCode || 'fr',
  fallbackLng: 'fr',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
