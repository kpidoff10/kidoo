# Guide pour générer l'APK de production

## Méthode 1 : Build local avec Gradle (Recommandé si Android Studio est installé)

### Prérequis
- Android Studio installé avec le SDK Android
- Java JDK installé
- Variables d'environnement Android configurées (`ANDROID_HOME`, `JAVA_HOME`)

### Étapes

1. **Assurez-vous que le projet Android est à jour** :
   ```bash
   cd kidoo-app
   npm run prebuild
   ```

2. **Générez l'APK de production** :
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

   Ou sur Windows :
   ```bash
   cd android
   gradlew.bat assembleRelease
   ```

3. **L'APK sera généré dans** :
   ```
   kidoo-app/android/app/build/outputs/apk/release/app-release.apk
   ```

4. **Installez l'APK sur votre téléphone** :
   - Transférez le fichier `app-release.apk` sur votre téléphone
   - Activez "Sources inconnues" dans les paramètres Android
   - Ouvrez le fichier APK sur votre téléphone pour l'installer

---

## Méthode 2 : EAS Build (Recommandé par Expo - Build dans le cloud)

### Prérequis
- Compte Expo (gratuit) : https://expo.dev
- EAS CLI installé

### Installation EAS CLI
```bash
npm install -g eas-cli
```

### Configuration

1. **Connectez-vous à Expo** :
   ```bash
   eas login
   ```

2. **Configurez EAS Build** :
   ```bash
   eas build:configure
   ```

   Cela créera un fichier `eas.json` avec la configuration.

3. **Générez l'APK de production** :
   ```bash
   eas build --platform android --profile production
   ```

   Ou pour un build local avec EAS :
   ```bash
   eas build --platform android --profile production --local
   ```

4. **Téléchargez l'APK** :
   - Une fois le build terminé, vous recevrez un lien pour télécharger l'APK
   - Ou utilisez : `eas build:list` pour voir tous vos builds

---

## Configuration de l'URL API pour la production

Assurez-vous que votre fichier `.env` contient l'URL de production :

```env
EXPO_PUBLIC_API_URL=https://api.kidoo-box.com
```

Ou pour utiliser le domaine principal :
```env
EXPO_PUBLIC_API_URL=https://kidoo-box.com
```

---

## Signer l'APK (Optionnel mais recommandé pour la production)

Pour signer l'APK avec une clé de production :

1. **Générez une clé de signature** :
   ```bash
   cd android/app
   keytool -genkeypair -v -storetype PKCS12 -keystore kidoo-release-key.jks -alias kidoo-key -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Configurez la signature dans `android/app/build.gradle`** :
   ```gradle
   android {
       ...
       signingConfigs {
           release {
               storeFile file('kidoo-release-key.jks')
               storePassword 'votre-mot-de-passe'
               keyAlias 'kidoo-key'
               keyPassword 'votre-mot-de-passe'
           }
       }
       buildTypes {
           release {
               ...
               signingConfig signingConfigs.release
           }
       }
   }
   ```

3. **Générez l'APK signé** :
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

---

## Notes importantes

- **Version** : Assurez-vous d'incrémenter la version dans `app.json` avant chaque build de production
- **Variables d'environnement** : Les variables `EXPO_PUBLIC_*` sont intégrées au build
- **Taille de l'APK** : L'APK de production sera plus lourd que le debug (~20-50 MB)
- **Test** : Testez toujours l'APK sur un appareil réel avant de le distribuer
