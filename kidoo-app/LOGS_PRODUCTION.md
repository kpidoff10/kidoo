# Logs avec l'APK de Production

## 1. Logs Android avec ADB (Android Debug Bridge)

### Prérequis
- Android SDK installé (via Android Studio)
- USB Debugging activé sur votre téléphone
- Téléphone connecté en USB

### Voir tous les logs
```bash
adb logcat
```

### Filtrer les logs de votre app

#### Sur Windows PowerShell
```powershell
# Par nom de package
adb logcat | Select-String "com.kidooapp"

# Par tag React Native
adb logcat | Select-String "ReactNativeJS"

# Par tag Sentry
adb logcat | Select-String "Sentry"

# Combinaison (plusieurs patterns)
adb logcat | Select-String -Pattern "com.kidooapp|ReactNativeJS|Sentry"

# Alternative avec findstr (plus rapide)
adb logcat | findstr "com.kidooapp"
```

#### Sur Linux/Mac (bash)
```bash
# Par nom de package
adb logcat | grep "com.kidooapp"

# Par tag React Native
adb logcat | grep "ReactNativeJS"

# Par tag Sentry
adb logcat | grep "Sentry"

# Combinaison
adb logcat | grep -E "com.kidooapp|ReactNativeJS|Sentry"
```

### Logs avec couleurs et filtres
```bash
# Installer logcat-color (optionnel mais utile)
npm install -g logcat-color

# Utiliser avec filtres (Linux/Mac)
adb logcat | logcat-color | grep -E "com.kidooapp|ReactNativeJS"

# Windows PowerShell
adb logcat | Select-String -Pattern "com.kidooapp|ReactNativeJS"
```

### Sauvegarder les logs dans un fichier

#### Windows PowerShell
```powershell
adb logcat > logs.txt
# Ou avec filtres
adb logcat | Select-String "com.kidooapp" > app-logs.txt
```

#### Linux/Mac
```bash
adb logcat > logs.txt
# Ou avec filtres
adb logcat | grep "com.kidooapp" > app-logs.txt
```

## 2. Logs Sentry en Production

Sentry capture automatiquement les erreurs en production, même sans logs locaux.

### Configuration actuelle
Dans `index.tsx`, Sentry est configuré pour :
- ✅ **Production** : `debug: false` (pas de logs verbeux)
- ✅ **Production** : `environment: 'production'`
- ✅ Les erreurs sont automatiquement envoyées à Sentry

### Voir les erreurs dans Sentry
1. Allez sur [sentry.io](https://sentry.io)
2. Ouvrez votre projet
3. Allez dans **Issues** → Filtrez par **"production"**
4. Toutes les erreurs de production apparaîtront ici

### Activer les logs Sentry en production (pour debug)

Si vous voulez voir les logs Sentry même en production, modifiez `index.tsx` :

```typescript
Sentry.init({
  dsn: sentryDsn,
  debug: true, // Activer les logs même en production
  environment: 'production',
  // ...
});
```

⚠️ **Attention** : Les logs Sentry peuvent être verbeux. Ne les activez que temporairement pour le debug.

## 3. Logs React Native en Production

### Activer les logs React Native

Par défaut, les `console.log()` sont désactivés en production. Pour les activer :

#### Option 1 : Via Metro (développement)
```bash
npx react-native log-android
```

#### Option 2 : Modifier le code pour toujours logger

Dans votre code, utilisez un système de logging conditionnel :

```typescript
// src/utils/logger.ts
const isDev = __DEV__;
const FORCE_LOGS = false; // Mettre à true pour forcer les logs en prod

export const logger = {
  log: (...args: any[]) => {
    if (isDev || FORCE_LOGS) {
      console.log(...args);
    }
  },
  error: (...args: any[]) => {
    // Les erreurs sont toujours loggées
    console.error(...args);
  },
  warn: (...args: any[]) => {
    if (isDev || FORCE_LOGS) {
      console.warn(...args);
    }
  },
};
```

## 4. Vérifier que Sentry fonctionne en production

### Test rapide
1. Build l'APK de production :
   ```bash
   npm run android:release
   ```

2. Installez l'APK sur votre téléphone

3. Connectez le téléphone en USB et lancez :
   ```powershell
   # Windows PowerShell
   adb logcat | Select-String "Sentry"
   
   # Ou Linux/Mac
   adb logcat | grep "Sentry"
   ```

4. Déclenchez une erreur dans l'app (bouton de test)

5. Vérifiez dans Sentry → Issues → Filtre "production"

### Vérifier les requêtes réseau

Si vous avez accès au réseau du téléphone :
1. Connectez le téléphone au même WiFi que votre ordinateur
2. Utilisez un proxy (comme Charles Proxy ou mitmproxy)
3. Filtrez les requêtes vers `ingest.de.sentry.io`
4. Vous verrez les événements envoyés à Sentry

## 5. Debug à distance avec React Native Debugger

### Activer le debugger
1. Secouez le téléphone (ou `adb shell input keyevent 82`)
2. Sélectionnez "Debug"
3. Ouvrez Chrome → `chrome://inspect`
4. Cliquez sur "inspect" sous votre appareil

### Voir les console.log dans Chrome DevTools
- Ouvrez la console Chrome
- Tous les `console.log()` de votre app apparaîtront ici

## 6. Logs spécifiques à votre app

Pour ajouter des logs personnalisés qui fonctionnent en production :

```typescript
// src/utils/logger.ts
import * as Sentry from '@sentry/react-native';

export const logger = {
  log: (message: string, data?: any) => {
    if (__DEV__) {
      console.log(`[App] ${message}`, data);
    }
    // Toujours envoyer à Sentry en production pour les logs importants
    if (!__DEV__ && data?.level === 'error') {
      Sentry.captureMessage(message, {
        level: 'info',
        extra: data,
      });
    }
  },
  
  error: (message: string, error?: Error) => {
    console.error(`[App] ${message}`, error);
    // Toujours envoyer les erreurs à Sentry
    if (error) {
      Sentry.captureException(error);
    } else {
      Sentry.captureMessage(message, 'error');
    }
  },
};
```

## Résumé

✅ **Logs Android (Windows)** : `adb logcat | Select-String "com.kidooapp"`  
✅ **Logs Android (Linux/Mac)** : `adb logcat | grep "com.kidooapp"`  
✅ **Sentry** : Automatique en production, visible sur sentry.io  
✅ **React Native Debugger** : Via Chrome DevTools  
✅ **Console.log** : Désactivé en production par défaut (sauf erreurs)

Pour le debug en production, **Sentry est votre meilleur ami** car il capture automatiquement toutes les erreurs sans avoir besoin de logs locaux.
