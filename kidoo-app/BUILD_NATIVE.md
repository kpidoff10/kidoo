# Guide pour lancer un build natif

Pour utiliser le Bluetooth dans votre application, vous devez lancer un **build natif** car `react-native-ble-plx` nécessite des modules natifs qui ne sont pas disponibles dans Expo Go.

## Méthode 1 : Expo Run (Recommandée pour le développement)

Cette méthode génère les dossiers natifs localement et lance l'application directement sur un émulateur/appareil.

### Prérequis

#### Pour Android :
1. **Android Studio** installé avec :
   - Android SDK
   - Android SDK Platform-Tools
   - Un émulateur Android configuré OU un appareil Android connecté avec USB Debugging activé

2. **Variables d'environnement** :
   ```bash
   # Windows PowerShell
   $env:ANDROID_HOME = "C:\Users\VotreNom\AppData\Local\Android\Sdk"
   $env:PATH += ";$env:ANDROID_HOME\platform-tools"

   # Linux/Mac
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

#### Pour iOS (Mac uniquement) :
1. **Xcode** installé depuis l'App Store
2. **CocoaPods** installé :
   ```bash
   sudo gem install cocoapods
   ```
3. **Simulateur iOS** configuré OU un appareil iOS connecté

### Étapes

1. **Préparer le projet** (première fois uniquement) :
   ```bash
   cd kidoo-app
   npm run prebuild
   ```
   Cette commande génère les dossiers `android/` et `ios/` avec tous les modules natifs nécessaires.

2. **Lancer sur Android** :
   ```bash
   npm run run:android
   ```
   ou
   ```bash
   npx expo run:android
   ```

3. **Lancer sur iOS** :
   ```bash
   npm run run:ios
   ```
   ou
   ```bash
   npx expo run:ios
   ```

4. **Nettoyer et relancer** (si vous rencontrez des problèmes) :
   ```bash
   # Android
   npm run android:clean

   # iOS
   cd ios && pod install && cd .. && npm run run:ios
   ```

## Méthode 2 : EAS Build (Recommandée pour la production)

EAS Build permet de construire l'application dans le cloud sans configuration locale complexe.

### Prérequis

1. **Compte Expo** (gratuit) : https://expo.dev
2. **EAS CLI** installé :
   ```bash
   npm install -g eas-cli
   ```

### Étapes

1. **Se connecter à Expo** :
   ```bash
   eas login
   ```

2. **Configurer EAS** (première fois uniquement) :
   ```bash
   eas build:configure
   ```
   Cela crée un fichier `eas.json` à la racine du projet.

3. **Lancer un build Android** :
   ```bash
   eas build --platform android
   ```

4. **Lancer un build iOS** :
   ```bash
   eas build --platform ios
   ```

5. **Lancer un build pour les deux plateformes** :
   ```bash
   eas build --platform all
   ```

6. **Télécharger et installer** :
   - EAS vous fournira un lien pour suivre le build
   - Une fois terminé, vous pourrez télécharger l'APK (Android) ou l'IPA (iOS)
   - Installez-le sur votre appareil pour tester

## Méthode 3 : Development Build (Alternative)

Un Development Build est une version de l'application avec les modules natifs mais qui se connecte toujours au serveur de développement Expo.

1. **Créer un Development Build** :
   ```bash
   eas build --profile development --platform android
   ```

2. **Installer le build sur votre appareil**

3. **Lancer le serveur de développement** :
   ```bash
   npm start
   ```

4. **Ouvrir l'application** - elle se connectera automatiquement au serveur de développement

## Permissions Bluetooth

Les permissions Bluetooth ont été ajoutées dans `app.json` :
- **Android** : `BLUETOOTH`, `BLUETOOTH_SCAN`, `BLUETOOTH_CONNECT`, `ACCESS_FINE_LOCATION`
- **iOS** : `NSBluetoothAlwaysUsageDescription`, `NSBluetoothPeripheralUsageDescription`

Ces permissions seront automatiquement incluses lors du build natif.

## Dépannage

### Erreur "Gradle build failed" (Android)
```bash
cd android
./gradlew clean
cd ..
npm run run:android
```

### Erreur "Pod install failed" (iOS)
```bash
cd ios
pod deintegrate
pod install
cd ..
npm run run:ios
```

### Module BLE non disponible après le build
- Vérifiez que `react-native-ble-plx` est bien dans `package.json`
- Lancez `npm run prebuild` à nouveau
- Nettoyez et relancez le build

### L'application crash au démarrage
- Vérifiez les logs :
  ```bash
  # Android
  npx react-native log-android

  # iOS
  npx react-native log-ios
  ```

## Recommandation

- **Pour le développement quotidien** : Utilisez **Méthode 1 (Expo Run)**
- **Pour la production/les tests** : Utilisez **Méthode 2 (EAS Build)**
