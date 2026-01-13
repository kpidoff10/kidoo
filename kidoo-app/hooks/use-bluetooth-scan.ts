/**
 * Hook pour gérer le scan Bluetooth des appareils Kidoo
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { Platform, PermissionsAndroid, Alert } from 'react-native';

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

// Noms de périphériques Kidoo à rechercher
const KIDOO_DEVICE_NAMES = ['Kidoo', 'Kidoo mini', 'KIDOO', 'KIDOO MINI'];

interface ScannedDevice {
  id: string;
  name: string | null;
  rssi: number | null;
  isConnectable: boolean | null;
  device: any;
}

export function useBluetoothScan() {
  const [manager, setManager] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedDevices, setScannedDevices] = useState<ScannedDevice[]>([]);
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);
  const [error, setError] = useState<string | null>(
    bluetoothModuleAvailable
      ? null
      : 'Le Bluetooth nécessite un build natif. Assurez-vous d\'avoir lancé "npm run android" et non Expo Go.'
  );
  const scanTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const devicesMapRef = useRef<Map<string, ScannedDevice>>(new Map());

  // Initialiser le manager si disponible
  useEffect(() => {
    if (bluetoothModuleAvailable && BleManager) {
      const bleManager = new BleManager();
      setManager(bleManager);

      return () => {
        try {
          bleManager.destroy();
        } catch (error) {
          console.error('Erreur lors de la destruction du manager:', error);
        }
      };
    }
  }, []);

  // Vérifier l'état du Bluetooth
  useEffect(() => {
    if (!manager || !bluetoothModuleAvailable) {
      return;
    }

    let subscription: any = null;

    try {
      subscription = manager.onStateChange((state: any) => {
        setIsBluetoothEnabled(state === State.PoweredOn);
      }, true); // true pour recevoir l'état actuel immédiatement
    } catch (error) {
      console.error('Erreur lors de la configuration de l\'état Bluetooth:', error);
    }

    return () => {
      if (subscription) {
        try {
          subscription.remove();
        } catch (error) {
          console.error('Erreur lors de la suppression du listener:', error);
        }
      }
    };
  }, [manager]);

  // Demander les permissions Android
  const requestPermissions = useCallback(async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      return true; // iOS gère les permissions automatiquement
    }

    try {
      if (Platform.Version >= 31) {
        // Android 12+ (API 31+)
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        const scanGranted =
          granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] ===
          PermissionsAndroid.RESULTS.GRANTED;
        const connectGranted =
          granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] ===
          PermissionsAndroid.RESULTS.GRANTED;

        return scanGranted && connectGranted;
      } else {
        // Android < 12
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (error) {
      console.error('Erreur lors de la demande de permissions:', error);
      return false;
    }
  }, []);

  // Vérifier si le nom du device correspond à un Kidoo
  const isKidooDevice = useCallback((deviceName: string | null): boolean => {
    if (!deviceName) return false;
    return KIDOO_DEVICE_NAMES.some((name) =>
      deviceName.toLowerCase().includes(name.toLowerCase())
    );
  }, []);

  // Arrêter le scan
  const stopScan = useCallback(() => {
    if (!isScanning || !manager || !bluetoothModuleAvailable) {
      return;
    }

    try {
      manager.stopDeviceScan();
    } catch (error) {
      console.error('Erreur lors de l\'arrêt du scan:', error);
    }

    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
      scanTimeoutRef.current = null;
    }

    setIsScanning(false);
  }, [manager, isScanning]);

  // Démarrer le scan
  const startScan = useCallback(
    async (duration: number = 10000) => {
      if (!manager || !bluetoothModuleAvailable) {
        setError('Le Bluetooth nécessite un build natif. Assurez-vous d\'avoir lancé "npm run android" et non Expo Go.');
        Alert.alert(
          'Bluetooth non disponible',
          'Le Bluetooth nécessite un build natif. Assurez-vous d\'avoir lancé "npm run android" et non Expo Go.'
        );
        return;
      }

      if (isScanning) {
        return;
      }

      try {
        // Vérifier l'état du Bluetooth
        const state = await manager.state();
        if (state !== State.PoweredOn) {
          setError('Veuillez activer le Bluetooth');
          Alert.alert(
            'Bluetooth désactivé',
            'Veuillez activer le Bluetooth dans les paramètres de votre appareil.'
          );
          return;
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'état Bluetooth:', error);
        setError('Impossible de vérifier l\'état du Bluetooth');
        return;
      }

      // Demander les permissions
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) {
        setError('Permissions Bluetooth requises');
        Alert.alert(
          'Permissions requises',
          'Les permissions Bluetooth sont nécessaires pour scanner les appareils.'
        );
        return;
      }

      setIsScanning(true);
      setError(null);
      setScannedDevices([]);
      devicesMapRef.current.clear();

      // Arrêter le scan après la durée spécifiée
      scanTimeoutRef.current = setTimeout(() => {
        stopScan();
      }, duration);

      try {
        const scanOptions =
          Platform.OS === 'android' && Platform.Version >= 31
            ? { allowDuplicates: false, scanMode: 2 }
            : { allowDuplicates: false };

        manager.startDeviceScan(null, scanOptions, (scanError: any, device: any) => {
          if (scanError) {
            // Ignorer certaines erreurs "normales" qui peuvent survenir
            const errorMessage = scanError.message || '';
            const errorReason = scanError.reason || '';
            
            // Erreurs non critiques à ignorer
            const ignorableErrors = [
              'Unknown error occurred',
              'Scan has been stopped',
              'Operation cancelled',
            ];
            
            const isIgnorable = ignorableErrors.some(
              (ignorable) => errorMessage.includes(ignorable) || errorReason.includes(ignorable)
            );
            
            if (!isIgnorable) {
              console.error('Erreur de scan Bluetooth:', {
                message: errorMessage,
                reason: errorReason,
                error: scanError,
              });
              setError(errorReason || errorMessage || 'Erreur lors du scan');
              stopScan();
            } else {
              // Erreur ignorable, juste logger en debug
              console.debug('Erreur de scan ignorée (normale):', errorMessage || errorReason);
            }
            return;
          }

          if (device) {
            const deviceName = device.name;
            // Filtrer uniquement les appareils Kidoo
            if (isKidooDevice(deviceName)) {
              const scannedDevice: ScannedDevice = {
                id: device.id,
                name: deviceName || 'Kidoo inconnu',
                rssi: device.rssi,
                isConnectable: device.isConnectable,
                device,
              };

              // Utiliser une Map pour éviter les doublons
              devicesMapRef.current.set(device.id, scannedDevice);
              setScannedDevices(Array.from(devicesMapRef.current.values()));
            }
          }
        });
      } catch (scanError) {
        console.error('Erreur lors du démarrage du scan:', scanError);
        setError('Impossible de démarrer le scan');
        setIsScanning(false);
        if (scanTimeoutRef.current) {
          clearTimeout(scanTimeoutRef.current);
          scanTimeoutRef.current = null;
        }
      }
    },
    [manager, isScanning, requestPermissions, isKidooDevice, stopScan]
  );

  // Réinitialiser la liste
  const resetDevices = useCallback(() => {
    setScannedDevices([]);
    devicesMapRef.current.clear();
  }, []);

  return {
    isScanning,
    scannedDevices,
    isBluetoothEnabled: bluetoothModuleAvailable ? isBluetoothEnabled : false,
    error,
    startScan,
    stopScan,
    resetDevices,
    isAvailable: bluetoothModuleAvailable,
  };
}
