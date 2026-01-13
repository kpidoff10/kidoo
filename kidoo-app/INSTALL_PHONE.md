# Guide d'installation sur téléphone

## Méthode 1 : Build local (Téléphone connecté en USB)

### Prérequis
1. **Android Studio** installé avec Android SDK
2. **Téléphone Android** connecté en USB avec :
   - **Débogage USB activé** (Paramètres > Options développeur > Débogage USB)
   - **Autoriser l'installation depuis cette source** activé

### Étapes

1. **Vérifier que votre téléphone est détecté** :
   ```bash
   cd kidoo-app
   adb devices
   ```
   Vous devriez voir votre appareil listé.

2. **Générer les fichiers natifs** (si pas déjà fait) :
   ```bash
   npm run prebuild
   ```

3. **Lancer le build et installer directement** :
   ```bash
   npm run run:android
   ```
   ou
   ```bash
   npx expo run:android
   ```
   
   L'app sera automatiquement installée sur votre téléphone connecté.

---

## Méthode 2 : Build APK (Fichier à installer manuellement)

### Option A : Build local APK

1. **Générer les fichiers natifs** :
   ```bash
   cd kidoo-app
   npm run prebuild
   ```

2. **Générer l'APK de debug** :
   ```bash
   cd android
   ./gradlew assembleDebug
   ```
   
   L'APK sera généré dans : `android/app/build/outputs/apk/debug/app-debug.apk`

3. **Transférer l'APK sur votre téléphone** :
   - Via USB : copiez le fichier `app-debug.apk` sur votre téléphone
   - Via email/cloud : envoyez-vous le fichier par email ou cloud
   
4. **Installer sur le téléphone** :
   - Ouvrez le fichier APK sur votre téléphone
   - Autorisez l'installation depuis des sources inconnues si demandé
   - Installez l'application

### Option B : EAS Build (Cloud - Recommandé)

1. **Installer EAS CLI** :
   ```bash
   npm install -g eas-cli
   ```

2. **Se connecter à Expo** :
   ```bash
   eas login
   ```
   (Créez un compte gratuit sur https://expo.dev si nécessaire)

3. **Configurer EAS** (première fois) :
   ```bash
   cd kidoo-app
   eas build:configure
   ```

4. **Lancer un build Android** :
   ```bash
   eas build --platform android --profile preview
   ```
   
   Ou pour un build de production :
   ```bash
   eas build --platform android
   ```

5. **Télécharger l'APK** :
   - EAS vous donnera un lien pour suivre le build
   - Une fois terminé, téléchargez l'APK depuis le dashboard Expo
   - Installez-le sur votre téléphone

---

## Méthode 3 : Development Build (Hot reload sur téléphone)

1. **Créer un Development Build** :
   ```bash
   eas build --profile development --platform android
   ```

2. **Installer le build sur votre téléphone** (via le lien fourni par EAS)

3. **Lancer le serveur de développement** :
   ```bash
   cd kidoo-app
   npm start
   ```

4. **Ouvrir l'app sur votre téléphone** - elle se connectera automatiquement au serveur de développement

---

## Recommandation rapide

**Pour tester rapidement** : Utilisez la **Méthode 1** si vous avez Android Studio et un câble USB.

**Pour partager avec d'autres** : Utilisez la **Méthode 2 - Option B (EAS Build)** pour générer un APK facilement partageable.

---

## Dépannage

### Le téléphone n'est pas détecté
```bash
# Vérifier la connexion
adb devices

# Si rien n'apparaît :
# 1. Vérifiez que le débogage USB est activé
# 2. Autorisez l'ordinateur sur votre téléphone (popup qui apparaît)
# 3. Réessayez : adb devices
```

### Erreur lors du build
```bash
# Nettoyer et réessayer
cd kidoo-app/android
./gradlew clean
cd ..
npm run run:android
```

### L'app crash au démarrage
- Vérifiez les logs : `adb logcat | grep ReactNativeJS`
- Assurez-vous que toutes les dépendances sont installées : `npm install`
