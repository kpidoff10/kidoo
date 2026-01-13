# Fix erreur CMake/Ninja Android

## Problème
```
C/C++:   CMakeLists.txt:31 (include)
C/C++: ninja: error: rebuilding 'build.ninja': subcommand failed
> Task :app:externalNativeBuildCleanDebug FAILED
```

Cette erreur indique un problème avec la compilation native (C/C++) lors du build Android.

## Solutions

### Solution 1 : Nettoyage complet (Recommandé)

```bash
cd kidoo-app/android

# Nettoyer les caches Gradle
./gradlew clean

# Supprimer les dossiers de build
Remove-Item -Recurse -Force app\.cxx -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force app\build -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .gradle -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force build -ErrorAction SilentlyContinue

# Rebuild
cd ..
npm run prebuild
cd android
./gradlew assembleDebug
```

### Solution 2 : Nettoyer via PowerShell

```powershell
cd kidoo-app/android

# Nettoyer Gradle
.\gradlew clean

# Supprimer les dossiers problématiques
if (Test-Path "app\.cxx") { Remove-Item -Recurse -Force "app\.cxx" }
if (Test-Path "app\build") { Remove-Item -Recurse -Force "app\build" }
if (Test-Path ".gradle") { Remove-Item -Recurse -Force ".gradle" }
if (Test-Path "build") { Remove-Item -Recurse -Force "build" }

# Rebuild
cd ..
npm run prebuild
cd android
.\gradlew assembleDebug
```

### Solution 3 : Vérifier CMake et NDK

Assurez-vous que CMake et NDK sont installés dans Android Studio :

1. Ouvrez Android Studio
2. Tools > SDK Manager
3. Onglet "SDK Tools"
4. Vérifiez que sont cochés :
   - CMake
   - NDK (Side by side)
   - Android SDK Build-Tools

### Solution 4 : Désactiver temporairement la nouvelle architecture

Si le problème persiste, essayez de désactiver la nouvelle architecture dans `android/gradle.properties` :

```properties
# Commenter cette ligne temporairement
# newArchEnabled=true
newArchEnabled=false
```

Puis rebuild :
```bash
cd kidoo-app/android
./gradlew clean
./gradlew assembleDebug
```

### Solution 5 : Vérifier les modules natifs

Les modules suivants utilisent du code natif et peuvent causer des problèmes :
- `react-native-ble-plx`
- `react-native-reanimated`
- `react-native-worklets`

Vérifiez qu'ils sont correctement installés :

```bash
cd kidoo-app
npm install
npm run prebuild
```

### Solution 6 : Rebuild complet depuis zéro

```bash
cd kidoo-app

# Supprimer node_modules et rebuild
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force android -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force ios -ErrorAction SilentlyContinue

# Réinstaller les dépendances
npm install

# Rebuild les fichiers natifs
npm run prebuild

# Build Android
cd android
./gradlew assembleDebug
```

## Vérification

Après le nettoyage, vérifiez que le build fonctionne :

```bash
cd kidoo-app/android
./gradlew assembleDebug --info
```

Les logs `--info` vous donneront plus de détails sur ce qui se passe.

## Si le problème persiste

1. Vérifiez les logs complets : `./gradlew assembleDebug --stacktrace`
2. Vérifiez que CMake est installé : `cmake --version`
3. Vérifiez que NDK est installé dans Android Studio
4. Partagez les logs complets pour un diagnostic approfondi
