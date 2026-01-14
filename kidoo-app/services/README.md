# Services

Services réutilisables pour l'application Kidoo.

## Structure

```
services/
├── api.ts                 # Service API générique (requêtes HTTP)
├── authService.ts         # Service d'authentification
├── wifiService.ts         # Service WiFi (récupération SSID, etc.)
├── bte/                   # Services BTE (Bluetooth Low Energy)
│   ├── bleManager.ts     # Manager BLE avec état persistant (connexion, commandes, monitoring)
│   ├── bteService.ts     # Service BLE bas niveau (stateless, connexion/déconnexion)
│   └── index.ts          # Point d'entrée pour les services BTE
├── kidooActionsService.ts # Service pour les actions sur les Kidoos (BLE)
├── kidoo-actions/        # Actions spécifiques par modèle
│   ├── types.ts          # Types partagés pour les actions
│   ├── common.ts         # Actions communes à tous les modèles
│   ├── basic/            # Actions pour le modèle Basic
│   │   └── index.ts
│   └── index.ts          # Export des actions
└── README.md              # Ce fichier
```

## Services

### `api.ts`

Service API générique pour effectuer des requêtes HTTP vers le serveur.

**Exports :**
- `apiGet<T>(endpoint, options?)` - Requête GET
- `apiPost<T>(endpoint, data, options?)` - Requête POST
- `apiPut<T>(endpoint, data, options?)` - Requête PUT
- `apiDelete<T>(endpoint, options?)` - Requête DELETE
- `ApiResponse<T>` - Type de réponse API
- `ApiException` - Classe d'erreur API

**Exemple :**
```typescript
import { apiGet } from '@/services/api';

const data = await apiGet<User>('/users/me');
```

### `authService.ts`

Service d'authentification pour gérer la connexion et l'inscription.

**Exports :**
- `loginUser(credentials)` - Se connecter
- `registerUser(data)` - S'inscrire
- `logoutUser()` - Se déconnecter

**Exemple :**
```typescript
import { loginUser } from '@/services/authService';

const result = await loginUser({ email, password });
```

### `wifiService.ts`

Service WiFi pour gérer les fonctionnalités WiFi, notamment la récupération du SSID du réseau actuel.

**Exports :**
- `wifiService.getCurrentSSID()` - Récupère le SSID du réseau WiFi actuel
- `wifiService.getWifiInfo()` - Récupère les informations complètes du WiFi
- `wifiService.isConnectedToWifi()` - Vérifie si connecté au WiFi
- `wifiService.addWifiListener(callback)` - Écoute les changements WiFi

**Note :** Nécessite `@react-native-community/netinfo`

**Exemple :**
```typescript
import { wifiService } from '@/services/wifiService';

// Récupérer le SSID actuel
const ssid = await wifiService.getCurrentSSID();

// Récupérer les informations complètes
const wifiInfo = await wifiService.getWifiInfo();

// Écouter les changements
const unsubscribe = wifiService.addWifiListener((info) => {
  console.log('WiFi changé:', info.ssid);
});
```

### `bte/` - Services BTE (Bluetooth Low Energy)

Dossier contenant tous les services liés au Bluetooth Low Energy.

#### `bte/bleManager.ts` - Manager BLE avec état persistant

Manager haut niveau pour gérer les opérations BLE avec état persistant. Utilisé pour toutes les opérations de communication avec les Kidoos.

**Exports :**
- `bleManager` - Instance singleton du manager
- `bleManager.connect(device)` - Se connecter à un device (démarre le monitoring automatiquement)
- `bleManager.disconnect()` - Se déconnecter du device
- `bleManager.isConnected()` - Vérifier si un device est connecté
- `bleManager.sendCommand(command)` - Envoyer une commande bas niveau
- `bleManager.sendCommandAndWait(command, options?)` - Envoyer une commande typée et attendre la réponse
- `bleManager.configureWiFi(ssid, password?, options?)` - Configurer le WiFi (fonction utilitaire)
- `bleManager.writeNFCTag(blockNumber, data, options?)` - Écrire un tag NFC (fonction utilitaire)
- `bleManager.readNFCTag(blockNumber, options?)` - Lire un tag NFC (fonction utilitaire)
- `bleManager.waitForResponse(options)` - Attendre une réponse spécifique
- Types : `BLEDevice`, `BluetoothConnectionResult`, `BLEManagerCallbacks`, `WaitForResponseOptions`

**Exemple :**
```typescript
import { bleManager } from '@/services/bte';

// Se connecter à un device
const result = await bleManager.connect({
  id: 'device-id',
  name: 'Kidoo',
  deviceId: 'device-id',
});

if (result.success) {
  // Configurer le WiFi
  await bleManager.configureWiFi('MonWiFi', 'password123');
  
  // Écrire un tag NFC
  await bleManager.writeNFCTag(4, [1, 2, 3, 4]);
}
```

#### `bte/bteService.ts` - Service BLE bas niveau (stateless)

Service bas niveau pour les opérations BLE sans état. Utilisé principalement dans `BluetoothContext` pour vérifier la disponibilité.

**Exports :**
- `bteService.isAvailable()` - Vérifie si le Bluetooth est disponible
- `bteService.isEnabled()` - Vérifie si le Bluetooth est activé
- `bteService.connectToDevice(deviceId, options?)` - Se connecte à un appareil (stateless)
- `bteService.disconnectFromDevice(deviceId)` - Se déconnecte d'un appareil
- `bteService.isDeviceConnected(deviceId)` - Vérifie si un appareil est connecté
- `bteService.getBluetoothState()` - Obtient l'état actuel du Bluetooth
- Types : `BluetoothDevice`, `BluetoothService`, `BluetoothConnectionResult`

**Note :** Nécessite `react-native-ble-plx` (inclus dans le projet)

**Exemple :**
```typescript
import { bteService } from '@/services/bte';

// Vérifier si le Bluetooth est disponible
const available = bteService.isAvailable();

// Se connecter à un appareil (stateless)
const result = await bteService.connectToDevice(deviceId, {
  timeout: 5000,
  autoConnect: false,
});
```

**Recommandation :** Utilisez `bleManager` pour toutes les opérations de communication avec les Kidoos. Utilisez `bteService` uniquement pour vérifier la disponibilité du Bluetooth.

## Installation des dépendances

Pour utiliser `wifiService`, installez la dépendance :

```bash
npm install @react-native-community/netinfo
```

Pour utiliser les services BTE (`bte/`), la dépendance `react-native-ble-plx` est déjà incluse dans le projet.

### `kidooActionsService.ts`

Service pour gérer les actions sur les Kidoos via Bluetooth. Actions spécifiques à chaque modèle (Basic, Classic, etc.).

**Structure :**
Les actions sont organisées par modèle dans le dossier `kidoo-actions/` :
- `kidoo-actions/types.ts` - Types partagés (KidooActionResult, BrightnessOptions, etc.)
- `kidoo-actions/common.ts` - Actions communes à tous les modèles (sendCommand, checkConnection, etc.)
- `kidoo-actions/basic/index.ts` - Actions spécifiques au modèle Basic (hérite de CommonKidooActions)
- `kidoo-actions/index.ts` - Export centralisé des actions

**Actions communes :**
La classe `CommonKidooActions` fournit des méthodes communes utilisables par tous les modèles :
- `checkConnection()` - Vérifier si le Kidoo est connecté
- `sendCommand(command)` - Envoyer une commande JSON au Kidoo
- `sendCommandWithValidation(command, validator)` - Envoyer une commande avec validation personnalisée

**Exports :**
- `kidooActionsService.forKidoo(kidoo)` - Obtenir les actions pour un Kidoo spécifique
- `BasicKidooActions` - Classe d'actions pour le modèle Basic
- `getKidooActions(kidoo)` - Factory pour obtenir les actions selon le modèle
- Types : `KidooActionResult`, `BrightnessOptions`, `EffectOptions`, `SleepModeOptions`, `ColorOptions`

**Actions disponibles pour Basic :**
- `setBrightness(options)` - Définir la luminosité (0-100%)
- `setEffect(options)` - Définir un effet LED (rainbow, pulse, glossy, manual)
- `configureSleepMode(options)` - Configurer le mode sommeil
- `setColor(options)` - Définir une couleur RGB

**Commandes globales (disponibles via `bleManager`) :**
- `bleManager.getSystemInfo()` - Obtenir les informations système (version, modèle, etc.)
- `bleManager.reset()` - Réinitialiser les paramètres par défaut

**Exemple :**
```typescript
import { kidooActionsService } from '@/services/kidooActionsService';
import { bleManager } from '@/services/bte';

// Obtenir les actions pour un Kidoo
const actions = kidooActionsService.forKidoo(kidoo);

// Définir la luminosité
const result = await actions.setBrightness({ percent: 50 });
if (result.success) {
  console.log('Luminosité définie avec succès');
} else {
  console.error('Erreur:', result.error);
}

// Définir un effet
await actions.setEffect({ effect: 'rainbow' });

// Configurer le mode sommeil
await actions.configureSleepMode({ 
  timeoutMs: 10000, 
  transitionMs: 8000 
});

// Définir une couleur
await actions.setColor({ r: 255, g: 0, b: 0 });

// Obtenir les informations système (via bleManager)
try {
  const systemInfo = await bleManager.getSystemInfo();
  console.log('Version:', systemInfo.firmwareVersion);
  console.log('Modèle:', systemInfo.model);
} catch (error) {
  console.error('Erreur:', error);
}

// Réinitialiser (via bleManager)
await bleManager.reset();
```

**Note :** Nécessite que le Kidoo soit connecté via Bluetooth (utilise `bleManager`).
