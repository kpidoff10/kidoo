/**
 * Plugin Expo pour gérer une icône de splash screen différente en mode sombre
 * 
 * Ce plugin copie l'icône sombre dans les dossiers drawable-night-*dpi
 * pour qu'Android l'utilise automatiquement en mode sombre.
 */

const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withDarkModeSplash = (config) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const darkSplashPath = path.join(projectRoot, 'assets', 'splash-icon-dark.png');
      const androidResPath = path.join(projectRoot, 'android', 'app', 'src', 'main', 'res');
      
      if (!fs.existsSync(darkSplashPath)) {
        console.warn('⚠️  splash-icon-dark.png non trouvé dans assets/.');
        console.warn('   Créez ce fichier pour activer l\'icône de splash screen en mode sombre.');
        return config;
      }

      // Dossiers drawable pour différentes densités
      const drawableDirs = ['drawable-hdpi', 'drawable-mdpi', 'drawable-xhdpi', 'drawable-xxhdpi', 'drawable-xxxhdpi'];
      
      // Créer les dossiers drawable-night-*dpi et copier l'icône sombre
      for (const drawableDir of drawableDirs) {
        const sourceDir = path.join(androidResPath, drawableDir);
        if (!fs.existsSync(sourceDir)) {
          continue; // Skip si le dossier source n'existe pas
        }

        // Créer le dossier drawable-night-*dpi
        const nightDir = drawableDir.replace('drawable-', 'drawable-night-');
        const nightDirPath = path.join(androidResPath, nightDir);
        
        if (!fs.existsSync(nightDirPath)) {
          fs.mkdirSync(nightDirPath, { recursive: true });
        }

        // Copier l'icône sombre dans le dossier night
        const targetPath = path.join(nightDirPath, 'splashscreen_logo.png');
        fs.copyFileSync(darkSplashPath, targetPath);
        console.log(`✓ Copié splash-icon-dark.png vers ${nightDir}/splashscreen_logo.png`);
      }

      // Créer aussi le dossier values-night/styles.xml si nécessaire
      const valuesNightPath = path.join(androidResPath, 'values-night');
      if (!fs.existsSync(valuesNightPath)) {
        fs.mkdirSync(valuesNightPath, { recursive: true });
      }

      const stylesNightPath = path.join(valuesNightPath, 'styles.xml');
      if (!fs.existsSync(stylesNightPath)) {
        const stylesNightContent = `<?xml version="1.0" encoding="utf-8"?>
<resources xmlns:tools="http://schemas.android.com/tools">
  <style name="Theme.App.SplashScreen" parent="Theme.SplashScreen">
    <item name="windowSplashScreenBackground">@color/splashscreen_background</item>
    <item name="windowSplashScreenAnimatedIcon">@drawable/splashscreen_logo</item>
    <item name="postSplashScreenTheme">@style/AppTheme</item>
    <item name="android:windowSplashScreenBehavior">icon_preferred</item>
  </style>
</resources>`;
        fs.writeFileSync(stylesNightPath, stylesNightContent);
        console.log('✓ Fichier styles.xml créé pour le mode sombre');
      }
      
      return config;
    },
  ]);
};

module.exports = withDarkModeSplash;
