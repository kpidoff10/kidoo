// app.config.js - Configuration dynamique Expo
// Permet d'utiliser les variables d'environnement

export default ({ config }) => {
  return {
    ...config,
    extra: {
      // URL de l'API - utilise la variable d'env ou une valeur par défaut
      apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
    },
  };
};
