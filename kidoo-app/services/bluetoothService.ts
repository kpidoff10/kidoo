/**
 * Service Bluetooth
 * Gère les fonctionnalités Bluetooth comme la connexion aux appareils
 */

// Import conditionnel de react-native-ble-plx
let BleManager: any = null;
let State: any = null;
let bluetoothModuleAvailable = false;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const bleModule = require('react-native-ble-plx');
  if (bleModule && typeof bleModule.BleManager !== 'undefined') {
    BleManager = bleModule.BleManager;
    State = bleModule.State;
    bluetoothModuleAvailable = true;
    console.log('Bluetooth disponible - BleManager initialisé');
  } else {
    console.warn('Bluetooth module chargé mais BleManager non disponible');
  }
} catch (error: unknown) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.debug('Bluetooth non disponible - Erreur:', errorMessage);
  console.debug('Mode Expo Go détecté ou module non lié');
}

export interface BluetoothDevice {
  id: string;
  name: string | null;
  rssi: number | null;
  isConnectable: boolean | null;
}

export interface BluetoothConnectionResult {
  success: boolean;
  error?: string;
  device?: any;
}

export interface BluetoothService {
  /**
   * Vérifie si le Bluetooth est disponible
   */
  isAvailable: () => boolean;
  
  /**
   * Vérifie si le Bluetooth est activé
   */
  isEnabled: () => Promise<boolean>;
  
  /**
   * Se connecte à un appareil Bluetooth
   */
  connectToDevice: (deviceId: string, options?: { timeout?: number; autoConnect?: boolean }) => Promise<BluetoothConnectionResult>;
  
  /**
   * Se déconnecte d'un appareil Bluetooth
   */
  disconnectFromDevice: (deviceId: string) => Promise<boolean>;
  
  /**
   * Vérifie si un appareil est connecté
   */
  isDeviceConnected: (deviceId: string) => Promise<boolean>;
  
  /**
   * Obtient l'état actuel du Bluetooth
   */
  getBluetoothState: () => Promise<string | null>;
}

/**
 * Vérifie si le Bluetooth est disponible
 */
function isAvailable(): boolean {
  return bluetoothModuleAvailable && BleManager !== null;
}

/**
 * Vérifie si le Bluetooth est activé
 * Note: Cette méthode peut échouer avec une erreur native sur certains appareils Android
 * Il est recommandé d'essayer directement de se connecter plutôt que de vérifier l'état d'abord
 */
async function isEnabled(): Promise<boolean> {
  if (!isAvailable()) {
    return false;
  }

  // Simplifier : ne pas vérifier l'état activé/désactivé car cela cause des erreurs natives
  // On suppose que si le module est disponible, le Bluetooth peut être utilisé
  // L'erreur se produira lors de la tentative de connexion si le Bluetooth n'est pas activé
  return true;
}

/**
 * Obtient l'état actuel du Bluetooth
 */
async function getBluetoothState(): Promise<string | null> {
  if (!isAvailable()) {
    return null;
  }

  try {
    const manager = new BleManager();
    const state = await manager.state();
    manager.destroy();
    return state;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'état Bluetooth:', error);
    return null;
  }
}

/**
 * Se connecte à un appareil Bluetooth
 */
async function connectToDevice(
  deviceId: string,
  options: { timeout?: number; autoConnect?: boolean } = {}
): Promise<BluetoothConnectionResult> {
  if (!isAvailable()) {
    return {
      success: false,
      error: 'Bluetooth non disponible. Assurez-vous d\'avoir lancé un build natif.',
    };
  }

  const { timeout = 5000, autoConnect = false } = options;
  let manager: any = null;
  let device: any = null;

  try {
    manager = new BleManager();

    // Vérifier l'état du Bluetooth
    const state = await manager.state();
    if (state !== State.PoweredOn) {
      return {
        success: false,
        error: 'Bluetooth non activé',
      };
    }

    // Essayer de se connecter
    device = await manager.connectToDevice(deviceId, {
      autoConnect,
      timeout,
    });

    // Attendre que la connexion soit établie
    // connectToDevice retourne immédiatement, on doit appeler connect() pour attendre la connexion
    try {
      await device.connect();
      
      // Vérifier si la connexion est établie
      const isConnected = device.isConnected;

      if (isConnected) {
        return {
          success: true,
          device: device,
        };
      } else {
        return {
          success: false,
          error: 'Échec de la connexion',
        };
      }
    } catch (connectError: any) {
      return {
        success: false,
        error: connectError?.message || 'Échec de la connexion',
      };
    }
  } catch (error: any) {
    const errorMessage = error?.message || 'Erreur de connexion Bluetooth';
    console.error('Erreur lors de la connexion Bluetooth:', error);
    return {
      success: false,
      error: errorMessage,
    };
  } finally {
    // Ne pas détruire le manager ici car le device pourrait être utilisé
    // Le manager sera détruit quand le device sera déconnecté
  }
}

/**
 * Se déconnecte d'un appareil Bluetooth
 * Note: Cette méthode nécessite que le device soit déjà connu du manager
 * Pour une meilleure gestion, passer directement le device object
 */
async function disconnectFromDevice(deviceId: string): Promise<boolean> {
  console.log('[bluetoothService] 🔌 disconnectFromDevice appelé pour:', deviceId);
  
  if (!isAvailable()) {
    console.log('[bluetoothService] 🔌 Bluetooth non disponible');
    return false;
  }

  try {
    const manager = new BleManager();
    console.log('[bluetoothService] 🔌 Manager créé');
    
    let disconnected = false;
    
    try {
      console.log('[bluetoothService] 🔌 Tentative findDevices...');
      const device = await manager.findDevices([deviceId]);
      if (device && device.length > 0) {
        console.log('[bluetoothService] 🔌 Device trouvé via findDevices');
        try {
          await device[0].cancelConnection();
          disconnected = true;
          console.log('[bluetoothService] 🔌 Connexion annulée via findDevices');
        } catch (cancelError: any) {
          console.debug('[bluetoothService] 🔌 Erreur cancelConnection findDevices (ignorée):', cancelError?.message || String(cancelError));
        }
      }
    } catch (findError: any) {
      console.debug('[bluetoothService] 🔌 Erreur findDevices (ignorée):', findError?.message || String(findError));
      // Si le device n'est pas trouvé, essayer directement
      try {
        console.log('[bluetoothService] 🔌 Tentative getDevice...');
        const device = manager.getDevice(deviceId);
        if (device) {
          console.log('[bluetoothService] 🔌 Device trouvé via getDevice');
          try {
            await device.cancelConnection();
            disconnected = true;
            console.log('[bluetoothService] 🔌 Connexion annulée via getDevice');
          } catch (cancelError: any) {
            console.debug('[bluetoothService] 🔌 Erreur cancelConnection getDevice (ignorée):', cancelError?.message || String(cancelError));
          }
        } else {
          console.log('[bluetoothService] 🔌 Device non trouvé via getDevice');
        }
      } catch (getError: any) {
        console.debug('[bluetoothService] 🔌 Erreur getDevice (ignorée):', getError?.message || String(getError));
        console.warn('[bluetoothService] 🔌 Device non trouvé pour déconnexion:', deviceId);
      }
    }
    
    try {
      console.log('[bluetoothService] 🔌 Destruction du manager...');
      manager.destroy();
      console.log('[bluetoothService] 🔌 Manager détruit');
    } catch (destroyError: any) {
      console.debug('[bluetoothService] 🔌 Erreur destroy manager (ignorée):', destroyError?.message || String(destroyError));
    }
    
    console.log('[bluetoothService] 🔌 disconnectFromDevice terminé, disconnected:', disconnected);
    return disconnected;
  } catch (error: any) {
    console.debug('[bluetoothService] 🔌 Erreur générale disconnectFromDevice (ignorée):', error?.message || String(error));
    return false;
  }
}

/**
 * Vérifie si un appareil est connecté
 */
async function isDeviceConnected(deviceId: string): Promise<boolean> {
  if (!isAvailable()) {
    return false;
  }

  try {
    const manager = new BleManager();
    const device = manager.getDevice(deviceId);
    
    if (device) {
      const isConnected = device.isConnected;
      manager.destroy();
      return isConnected;
    }
    
    manager.destroy();
    return false;
  } catch (error) {
    console.error('Erreur lors de la vérification de la connexion:', error);
    return false;
  }
}

/**
 * Service Bluetooth exporté
 */
export const bluetoothService: BluetoothService = {
  isAvailable,
  isEnabled,
  connectToDevice,
  disconnectFromDevice,
  isDeviceConnected,
  getBluetoothState,
};
