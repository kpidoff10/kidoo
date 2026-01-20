/**
 * i18n Configuration
 * Internationalisation avec react-i18next et expo-localization
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import fr from './fr.json';
import en from './en.json';

const resources = {
  fr: { translation: fr },
  en: { translation: en },
};

// Détecte la langue du système
const getDeviceLanguage = (): string => {
  const locales = Localization.getLocales();
  const deviceLang = locales[0]?.languageCode || 'fr';
  
  // Si la langue n'est pas supportée, fallback sur français
  if (!['fr', 'en'].includes(deviceLang)) {
    return 'fr';
  }
  
  return deviceLang;
};

i18n.use(initReactI18next).init({
  resources,
  lng: getDeviceLanguage(),
  fallbackLng: 'fr',
  
  interpolation: {
    escapeValue: false, // React gère déjà l'échappement
  },
  
  react: {
    useSuspense: false, // Évite les problèmes avec React Native
  },
});

export default i18n;

// Hook personnalisé pour changer la langue
export const changeLanguage = (lang: 'fr' | 'en') => {
  i18n.changeLanguage(lang);
};

// Récupérer la langue actuelle
export const getCurrentLanguage = (): string => {
  return i18n.language;
};
