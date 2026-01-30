# Configuration du Splash Screen en Mode Sombre

## Problème
Le splash screen utilise toujours la même icône même en mode sombre.

## Solution

### 1. Créer l'icône sombre

Créez un fichier `splash-icon-dark.png` dans le dossier `assets/` :
- **Taille** : 1024x1024px (recommandé)
- **Format** : PNG avec transparence
- **Style** : Version adaptée au mode sombre de votre icône de splash screen

### 2. Exécuter le script de configuration

Après avoir créé `splash-icon-dark.png`, exécutez :

```bash
# Option 1 : Script automatique (recommandé)
npm run prebuild:android

# Option 2 : Manuellement
npx expo prebuild --platform android --clean
npm run setup:dark-splash
```

### 3. Reconstruire l'application

```bash
npm run android
```

## Comment ça fonctionne

Le script `scripts/setup-dark-splash.js` :
1. Vérifie que `splash-icon-dark.png` existe
2. Crée les dossiers `drawable-night-*dpi` (hdpi, mdpi, xhdpi, xxhdpi, xxxhdpi)
3. Copie l'icône sombre dans chaque dossier avec le nom `splashscreen_logo.png`

Android utilisera automatiquement ces ressources en mode sombre grâce au qualificateur `-night`.

## Vérification

Pour vérifier que ça fonctionne :
1. Les dossiers `drawable-night-*dpi` doivent exister dans `android/app/src/main/res/`
2. Chaque dossier doit contenir `splashscreen_logo.png`
3. Reconstruisez l'app et testez en mode sombre

## Note importante

⚠️ **Le script doit être exécuté APRÈS `expo prebuild`** car Expo génère les dossiers `drawable-*dpi` pendant le prebuild.

Si vous modifiez `splash-icon-dark.png` après le prebuild, réexécutez simplement :
```bash
npm run setup:dark-splash
```
