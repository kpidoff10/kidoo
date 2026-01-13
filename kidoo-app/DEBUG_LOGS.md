# Guide de débogage avec adb logcat

## Commandes pour filtrer les logs

### 1. Voir uniquement les erreurs critiques
```bash
adb logcat *:E
```

### 2. Voir les erreurs React Native et Expo
```bash
adb logcat | grep -E "(ReactNativeJS|Expo|Error|Exception|FATAL)"
```

### 3. Voir les logs du splash screen
```bash
adb logcat | grep -i "splash"
```

### 4. Voir les erreurs JavaScript
```bash
adb logcat | grep -E "(ReactNativeJS|JS|JavaScript)"
```

### 5. Voir toutes les erreurs et warnings
```bash
adb logcat *:E *:W
```

### 6. Voir les logs depuis le démarrage de l'app
```bash
# D'abord, effacer les logs
adb logcat -c

# Ensuite, lancer l'app et voir les nouveaux logs
adb logcat | grep -E "(ReactNativeJS|Expo|Error|Exception|FATAL|kidoo)"
```

### 7. Sauvegarder les logs dans un fichier
```bash
adb logcat > logs.txt
# Puis filtrer le fichier
grep -E "(ReactNativeJS|Expo|Error|Exception|FATAL)" logs.txt
```

## Erreurs courantes à chercher

1. **Erreur de module manquant** : `ModuleNotFoundError` ou `Cannot find module`
2. **Erreur de réseau** : `Network request failed` ou `ECONNREFUSED`
3. **Erreur d'authentification** : `AuthContext` ou `AsyncStorage`
4. **Erreur de splash screen** : `SplashScreen` ou `hideAsync`
5. **Erreur de rendu** : `Invariant Violation` ou `Cannot read property`

## Commandes PowerShell (Windows)

### Filtrer les erreurs
```powershell
adb logcat | Select-String -Pattern "(ReactNativeJS|Expo|Error|Exception|FATAL)"
```

### Voir uniquement les erreurs
```powershell
adb logcat *:E
```

### Sauvegarder et filtrer
```powershell
adb logcat > logs.txt
Select-String -Path logs.txt -Pattern "(ReactNativeJS|Expo|Error|Exception|FATAL)"
```
