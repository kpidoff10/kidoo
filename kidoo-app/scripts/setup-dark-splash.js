/**
 * Script pour configurer l'icône de splash screen en mode sombre
 * 
 * À exécuter après: npx expo prebuild --platform android
 */

const fs = require('fs');
const path = require('path');

const projectRoot = __dirname.replace(/[\\/]scripts$/, '');
const darkSplashPath = path.join(projectRoot, 'assets', 'splash-icon-dark.png');
const androidResPath = path.join(projectRoot, 'android', 'app', 'src', 'main', 'res');

console.log('🔧 Configuration de l\'icône de splash screen en mode sombre...\n');

if (!fs.existsSync(darkSplashPath)) {
  console.error('❌ ERREUR: splash-icon-dark.png non trouvé dans assets/');
  console.error('   Créez ce fichier pour activer l\'icône de splash screen en mode sombre.');
  process.exit(1);
}

if (!fs.existsSync(androidResPath)) {
  console.error('❌ ERREUR: Dossier android/app/src/main/res non trouvé.');
  console.error('   Exécutez d\'abord: npx expo prebuild --platform android');
  process.exit(1);
}

// Dossiers drawable pour différentes densités
const drawableDirs = ['drawable-hdpi', 'drawable-mdpi', 'drawable-xhdpi', 'drawable-xxhdpi', 'drawable-xxxhdpi'];

let copiedCount = 0;

// Créer les dossiers drawable-night-*dpi et copier l'icône sombre
for (const drawableDir of drawableDirs) {
  const sourceDir = path.join(androidResPath, drawableDir);
  if (!fs.existsSync(sourceDir)) {
    console.warn(`⚠️  ${drawableDir} n'existe pas, ignoré`);
    continue;
  }

  // Créer le dossier drawable-night-*dpi
  const nightDir = drawableDir.replace('drawable-', 'drawable-night-');
  const nightDirPath = path.join(androidResPath, nightDir);
  
  if (!fs.existsSync(nightDirPath)) {
    fs.mkdirSync(nightDirPath, { recursive: true });
    console.log(`✓ Créé ${nightDir}/`);
  }

  // Copier l'icône sombre dans le dossier night
  const targetPath = path.join(nightDirPath, 'splashscreen_logo.png');
  fs.copyFileSync(darkSplashPath, targetPath);
  console.log(`✓ Copié splash-icon-dark.png → ${nightDir}/splashscreen_logo.png`);
  copiedCount++;
}

if (copiedCount === 0) {
  console.error('❌ Aucun fichier copié. Vérifiez que les dossiers drawable-*dpi existent.');
  process.exit(1);
}

console.log(`\n✅ ${copiedCount} icône(s) copiée(s) avec succès!`);
console.log('\n📱 Prochaines étapes:');
console.log('   1. Reconstruire l\'app: npm run android');
console.log('   2. Tester en mode sombre sur votre appareil');
