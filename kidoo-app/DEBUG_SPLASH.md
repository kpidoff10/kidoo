# Guide de débogage - Splash Screen bloqué

## Problème résolu ✅

Le splash screen devrait maintenant se fermer automatiquement après le chargement de l'app. Les modifications apportées :

1. **Empêcher la fermeture automatique** : `SplashScreen.preventAutoHideAsync()`
2. **Attendre le chargement de l'authentification** : Le splash screen reste affiché jusqu'à ce que `AuthContext` ait fini de charger
3. **Timeout de sécurité** : Si le chargement prend plus de 5 secondes, le splash screen se ferme quand même
4. **Fermeture explicite** : `SplashScreen.hideAsync()` est appelé une fois que l'app est prête

## Si le problème persiste

### 1. Vérifier les logs Android

Connectez votre téléphone en USB et exécutez :

```bash
adb logcat | grep -E "(ReactNativeJS|Expo|SplashScreen|Error|Exception)"
```

Ou pour voir tous les logs :
```bash
adb logcat
```

### 2. Vérifier les erreurs JavaScript

Les erreurs JavaScript sont loggées avec le préfixe `🚨`. Recherchez dans les logs :
- `🚨 ERREUR GLOBALE NON GÉRÉE`
- `⚠️ Timeout lors du chargement`

### 3. Vérifier le chargement de l'authentification

Si `AuthContext` reste bloqué en `isLoading: true`, vérifiez :
- Les permissions de stockage (AsyncStorage)
- La connexion réseau (si l'app essaie de vérifier une session serveur)

### 4. Rebuild l'application

Si le problème persiste après les modifications :

```bash
cd kidoo-app
npm run android:clean
npm run run:android
```

Ou pour générer un nouvel APK :

```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

### 5. Vérifier la configuration du splash screen

Le splash screen est configuré dans `app.json` :
```json
{
  "plugins": [
    [
      "expo-splash-screen",
      {
        "image": "./assets/images/splash-icon.png",
        "imageWidth": 200,
        "resizeMode": "contain",
        "backgroundColor": "#ffffff"
      }
    ]
  ]
}
```

Vérifiez que l'image `./assets/images/splash-icon.png` existe.

### 6. Mode développement avec logs

Pour voir les logs en temps réel pendant le développement :

```bash
cd kidoo-app
npm start
# Dans un autre terminal
adb logcat | grep ReactNativeJS
```

## Points à vérifier

- ✅ Le splash screen se cache après max 5 secondes (timeout de sécurité)
- ✅ L'authentification se charge correctement depuis AsyncStorage
- ✅ Aucune erreur JavaScript qui bloque le rendu
- ✅ Les assets (images, fonts) sont chargés correctement
- ✅ Les providers (AuthProvider, QueryProvider, etc.) s'initialisent sans erreur

## Prochaines étapes

1. **Rebuild l'APK** avec les modifications
2. **Installer sur le téléphone**
3. **Vérifier les logs** si le problème persiste
4. **Partager les logs** pour un diagnostic plus approfondi
