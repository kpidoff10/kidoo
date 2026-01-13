/**
 * Configuration de l'API
 * Utilise les variables d'environnement Expo
 */

export const API_CONFIG = {
  // URL de l'API (backend Next.js)
  // Exemple: https://api.kidoo.com ou http://localhost:3000
  baseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',

  // Endpoint NextAuth pour l'authentification
  authEndpoint: '/api/auth',

  // Endpoints API
  endpoints: {
    auth: {
      register: '/api/auth/register',
      login: '/api/auth/signin',
      logout: '/api/auth/signout',
      session: '/api/auth/session',
      checkEmail: '/api/auth/register/check-email',
    },
    kidoos: '/api/kidoos',
    users: '/api/users',
  },

  // Timeouts
  timeout: 10000, // 10 secondes

  // Retry configuration
  retry: {
    attempts: 3,
    delay: 1000, // 1 seconde entre les tentatives
  },
};

/**
 * Construit une URL complète pour un endpoint
 */
export const getApiUrl = (endpoint: string): string => {
  // Si l'endpoint commence déjà par http, retourner tel quel
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }

  // Sinon, construire l'URL complète
  const baseUrl = API_CONFIG.baseUrl.replace(/\/$/, ''); // Supprimer le slash final
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${path}`;
};
