# Workaround pour le crash BLE après setup

## Problème connu

L'application crash après le setup d'un Kidoo avec l'erreur :
```
java.lang.NullPointerException: Parameter specified as non-null is null: 
method com.facebook.react.bridge.PromiseImpl.reject, parameter code
```

## Cause

C'est un **bug connu de `react-native-ble-plx`** :
- Issue GitHub : https://github.com/dotintent/react-native-ble-plx/issues/1303
- Le problème : La bibliothèque native essaie de rejeter une Promise avec un code `null` lors de la déconnexion BLE
- Cela se produit quand `cancelConnection()` est appelé alors que le device est déjà en train de se déconnecter automatiquement

## Solution appliquée

### 1. Ne PAS déconnecter manuellement après le setup

**Dans `Step3Finalization.tsx`** :
- ❌ **AVANT** : On appelait `disconnectDevice()` après le setup réussi
- ✅ **MAINTENANT** : On laisse l'ESP32 se déconnecter automatiquement
- Le callback `onDisconnected()` gère la déconnexion proprement

### 2. Vérifier `isConnected()` avant `cancelConnection()`

**Dans `BluetoothContext.tsx`** :
- Toujours vérifier `isConnected()` avant d'appeler `cancelConnection()`
- Utiliser un timeout court (500ms-1s) pour éviter les blocages
- Ignorer silencieusement les erreurs de `cancelConnection()`

### 3. Protéger le callback `onDisconnected()`

- Le callback est déjà protégé avec try-catch
- Vérification que le device déconnecté correspond au device connecté
- Délai de 100ms avant la mise à jour du state pour éviter les conflits

### 4. Ne pas appeler `cancelConnection()` dans le cleanup

**Dans le `useEffect` cleanup** :
- ❌ **AVANT** : On appelait `cancelConnection()` dans le cleanup
- ✅ **MAINTENANT** : On réinitialise seulement la référence
- Le callback `onDisconnected()` gérera la déconnexion automatiquement

## Code modifié

### Step3Finalization.tsx
```typescript
// AVANT (causait le crash)
await disconnectDevice();

// MAINTENANT (workaround)
// Ne pas déconnecter - laisser l'ESP32 se déconnecter automatiquement
// Le callback onDisconnected() gérera la déconnexion
```

### BluetoothContext.tsx - disconnectDevice()
```typescript
// Vérifier isConnected() avant cancelConnection()
const isStillConnected = await deviceToDisconnect.isConnected().catch(() => false);
if (isStillConnected) {
  await Promise.race([
    deviceToDisconnect.cancelConnection(),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 500)),
  ]).catch(() => {
    // Ignorer - le callback onDisconnected() gérera la déconnexion
  });
}
```

## Références

- Issue GitHub : https://github.com/dotintent/react-native-ble-plx/issues/1303
- Documentation : https://dotintent.github.io/react-native-ble-plx/
- Stack Overflow : https://stackoverflow.com/questions/66422542/

## Notes importantes

1. **Ce bug est dans la bibliothèque native** - on ne peut pas le corriger complètement
2. **Le workaround fonctionne** en évitant d'appeler `cancelConnection()` quand le device se déconnecte automatiquement
3. **Le callback `onDisconnected()` est fiable** - il gère correctement les déconnexions automatiques
4. **Les erreurs sont capturées dans Sentry** pour faciliter le debug si le problème persiste

## Test

Après ces modifications, le setup d'un Kidoo devrait fonctionner sans crash. Si le problème persiste, vérifiez dans Sentry les erreurs capturées.
