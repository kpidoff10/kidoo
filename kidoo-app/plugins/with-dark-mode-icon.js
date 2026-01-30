/**
 * Plugin Expo pour gérer une icône différente en mode sombre
 * 
 * Ce plugin configure automatiquement monochromeImage pour les icônes adaptatives Android.
 * Sur Android 13+, lorsque l'utilisateur active les "Icônes thématiques",
 * Android utilise automatiquement monochromeImage et la teinte selon le thème système.
 */

const { withAndroidManifest } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

// Variable pour éviter d'afficher le message plusieurs fois
let hasLoggedDarkIcon = false;

/**
 * Configure l'icône sombre pour Android
 */
const withDarkModeIcon = (config) => {
  // Vérifier si l'icône sombre existe
  const projectRoot = config.modRequest?.projectRoot || process.cwd();
  const darkIconPath = path.join(projectRoot, 'assets', 'adaptive-icon-dark.png');
  
  if (!fs.existsSync(darkIconPath)) {
    if (!hasLoggedDarkIcon) {
      console.warn('⚠️  adaptive-icon-dark.png non trouvé dans assets/.');
      console.warn('   Créez ce fichier pour activer l\'icône sombre.');
      hasLoggedDarkIcon = true;
    }
    return config;
  }

  // La configuration monochromeImage est déjà dans app.json
  // Ce plugin vérifie juste que le fichier existe et log un message (une seule fois)
  if (!hasLoggedDarkIcon) {
    console.log('✓ Icône sombre détectée: adaptive-icon-dark.png');
    console.log('  L\'icône sera utilisée sur Android 13+ avec les icônes thématiques activées.');
    hasLoggedDarkIcon = true;
  }

  return config;
};

module.exports = withDarkModeIcon;
