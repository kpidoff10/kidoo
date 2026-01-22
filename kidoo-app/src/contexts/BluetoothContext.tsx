/**
 * Bluetooth Context
 * Gestion du Bluetooth Low Energy (BLE)
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BleManager, Device, State } from 'react-native-ble-plx';
import { showToast } from '@/components/ui/Toast';
import { KIDOO_MODELS, isValidKidooModel } from '@/config';
import { useBottomSheet, UseBottomSheetReturn } from '@/hooks/useBottomSheet';
import { useKidoos } from '@/hooks/useKidoos';
import { useCreateKidoo } from '@/hooks/useKidoos';
import { AddKidooSheet } from '@/screens/kidoos/KidoosListScreen/components/AddKidooSheet';
import { AddDeviceSheet } from '@/components/AddDeviceSheet';
import { useAppReady } from '@/contexts/AppReadyContext';

// Types pour les appareils BLE
export interface BLEDevice {
  id: string;
  name: string | null;
  rssi: number | null;
  isConnectable?: boolean;
  serviceUUIDs?: string[];
  manufacturerData?: string;
}

export interface BluetoothState {
  isAvailable: boolean;
  isEnabled: boolean;
  isScanning: boolean;
  isConnected: boolean;
  connectedDevice: BLEDevice | null;
  scannedDevices: BLEDevice[];
  kidooDevices: BLEDevice[]; // Appareils Kidoo détectés
  pendingKidooDevice: BLEDevice | null; // Kidoo détecté en attente d'ajout
}

interface BluetoothContextType extends BluetoothState {
  requestPermissions: () => Promise<boolean>;
  startScan: () => Promise<void>;
  stopScan: () => void;
  connectToDevice: (deviceId: string) => Promise<void>;
  disconnectDevice: () => Promise<void>;
  sendCommand: (command: string, data?: Record<string, unknown>) => Promise<void>;
  clearScannedDevices: () => void;
  clearPendingKidoo: () => void;
  isKidooDevice: (device: BLEDevice) => boolean;
  addKidooSheet: UseBottomSheetReturn; // Bottom sheet intégré pour ajouter un Kidoo
  openAddDeviceSheet: () => void; // Ouvrir AddDeviceSheet
}

const BluetoothContext = createContext<BluetoothContextType | undefined>(undefined);

interface BluetoothProviderProps {
  children: React.ReactNode;
}

export function BluetoothProvider({ children }: BluetoothProviderProps) {
  const { t } = useTranslation();
  const managerRef = useRef<BleManager | null>(null);
  const addKidooSheet = useBottomSheet(); // Bottom sheet intégré
  const addDeviceSheet = useBottomSheet(); // Bottom sheet pour AddDeviceSheet
  const { data: kidoos } = useKidoos(); // Liste des Kidoos pour vérifier si déjà lié
  const createKidoo = useCreateKidoo();
  const { isAppReady } = useAppReady(); // Vérifier si l'app est prête (splash screen caché)
  const [pendingDeviceForAddSheet, setPendingDeviceForAddSheet] = useState<{ device: BLEDevice; detectedModel: string } | null>(null);
  
  const [state, setState] = useState<BluetoothState>({
    isAvailable: false,
    isEnabled: false,
    isScanning: false,
    isConnected: false,
    connectedDevice: null,
    scannedDevices: [],
    kidooDevices: [],
    pendingKidooDevice: null,
  });

  // Initialiser le BLE Manager
  useEffect(() => {
    if (!managerRef.current) {
      managerRef.current = new BleManager();
    }

    // Écouter les changements d'état du Bluetooth
    const subscription = managerRef.current.onStateChange((state) => {
      if (state === State.PoweredOn) {
        setState((prev) => ({
          ...prev,
          isAvailable: true,
          isEnabled: true,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          isAvailable: state !== State.Unsupported,
          isEnabled: false,
        }));
      }
    }, true); // true pour obtenir l'état initial immédiatement

    checkBluetoothAvailability();

    return () => {
      subscription.remove();
      managerRef.current?.destroy();
    };
  }, []);

  const checkBluetoothAvailability = useCallback(async () => {
    try {
      if (!managerRef.current) {
        return;
      }

      const state = await managerRef.current.state();
      const isAvailable = state !== State.Unsupported;
      const isEnabled = state === State.PoweredOn;

      setState((prev) => ({
        ...prev,
        isAvailable,
        isEnabled,
      }));
    } catch (error) {
      console.error('Erreur lors de la vérification du Bluetooth:', error);
      setState((prev) => ({
        ...prev,
        isAvailable: false,
        isEnabled: false,
      }));
    }
  }, []);

  const requestPermissions = useCallback(async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'android') {
        // Demander les permissions Android pour le Bluetooth
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        const allGranted = Object.values(granted).every(
          (status) => status === PermissionsAndroid.RESULTS.GRANTED
        );

        if (!allGranted) {
          showToast.error({
            title: t('toast.error'),
            message: t('bluetooth.errors.permissionsDenied', {
              defaultValue: 'Les permissions Bluetooth sont requises',
            }),
          });
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la demande de permissions:', error);
      showToast.error({
        title: t('toast.error'),
        message: t('bluetooth.errors.permissionsError', {
          defaultValue: 'Erreur lors de la demande de permissions',
        }),
      });
      return false;
    }
  }, [t]);

  // Fonction pour convertir un Device BLE en BLEDevice
  const convertDeviceToBLEDevice = useCallback((device: Device): BLEDevice => {
    let manufacturerDataStr: string | undefined = undefined;
    
    if (device.manufacturerData) {
      if (typeof device.manufacturerData === 'string') {
        manufacturerDataStr = device.manufacturerData;
      } else {
        // TypeScript peut avoir des problèmes avec le type, on utilise any pour contourner
        const data = device.manufacturerData as any;
        if (data && typeof data === 'object' && 'base64' in data) {
          manufacturerDataStr = data.base64;
        }
      }
    }
    
    return {
      id: device.id,
      name: device.name,
      rssi: device.rssi,
      isConnectable: device.isConnectable ?? undefined,
      serviceUUIDs: device.serviceUUIDs || undefined,
      manufacturerData: manufacturerDataStr,
    };
  }, []);

  // Fonction pour vérifier si un appareil est un Kidoo
  const isKidooDevice = useCallback((device: BLEDevice): boolean => {
    if (!device.name) {
      return false;
    }
    // Normaliser le nom en minuscules pour la comparaison (insensible à la casse)
    const normalizedName = device.name.toLowerCase();
    
    // Vérifier si le nom correspond à un modèle Kidoo
    // Le firmware diffuse "KIDOO-Basic" ou "KIDOO-Dream" (tout en majuscules pour KIDOO)
    // On accepte aussi "Kidoo-Basic", "KIDOO-Basic", etc.
    return KIDOO_MODELS.some((model) => {
      const normalizedModel = model.toLowerCase();
      // Chercher "kidoo-basic" ou "kidoo-dream" dans le nom (insensible à la casse)
      return normalizedName.includes(normalizedModel) || normalizedName === normalizedModel;
    });
  }, []);

  const startScan = useCallback(async () => {
    try {
      if (!managerRef.current) {
        return;
      }

      // Vérifier les permissions
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) {
        return;
      }

      // Vérifier que le Bluetooth est disponible
      const currentState = await managerRef.current.state();
      if (currentState !== State.PoweredOn) {
        showToast.error({
          title: t('toast.error'),
          message: t('bluetooth.errors.notEnabled', {
            defaultValue: 'Le Bluetooth n\'est pas activé',
          }),
        });
        return;
      }

      setState((prev) => ({
        ...prev,
        isScanning: true,
        scannedDevices: [], // Réinitialiser la liste
        kidooDevices: [], // Réinitialiser la liste des Kidoos
      }));

      // Démarrer le scan
      managerRef.current.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.error('Erreur de scan:', error);
          setState((prev) => ({
            ...prev,
            isScanning: false,
          }));
          return;
        }

        if (device) {
          const bleDevice = convertDeviceToBLEDevice(device);
          
          setState((prev) => {
            // Éviter les doublons
            const existingIndex = prev.scannedDevices.findIndex((d) => d.id === device.id);
            if (existingIndex >= 0) {
              // Mettre à jour l'appareil existant (RSSI peut changer)
              const updatedDevices = [...prev.scannedDevices];
              updatedDevices[existingIndex] = bleDevice;
              
              return {
                ...prev,
                scannedDevices: updatedDevices,
              };
            }

            // Nouvel appareil
            const newScannedDevices = [...prev.scannedDevices, bleDevice];
            
            // Vérifier si c'est un Kidoo
            const isKidoo = isKidooDevice(bleDevice);
            let newKidooDevices = prev.kidooDevices;
            
            if (isKidoo) {
              // Éviter les doublons dans la liste des Kidoos
              const existingKidooIndex = prev.kidooDevices.findIndex((d) => d.id === device.id);
              if (existingKidooIndex < 0) {
                newKidooDevices = [...prev.kidooDevices, bleDevice];
                
                // Si aucun Kidoo n'est en attente, définir celui-ci comme pending
                if (!prev.pendingKidooDevice) {
                  return {
                    ...prev,
                    scannedDevices: newScannedDevices,
                    kidooDevices: newKidooDevices,
                    pendingKidooDevice: bleDevice,
                  };
                }
              }
            }

            return {
              ...prev,
              scannedDevices: newScannedDevices,
              kidooDevices: newKidooDevices,
            };
          });
        }
      });

      // Toast de succès retiré - le scan démarre automatiquement en arrière-plan
    } catch (error) {
      console.error('Erreur lors du démarrage du scan:', error);
      setState((prev) => ({
        ...prev,
        isScanning: false,
      }));
      showToast.error({
        title: t('toast.error'),
        message: t('bluetooth.errors.scanError', {
          defaultValue: 'Erreur lors du démarrage du scan',
        }),
      });
    }
  }, [requestPermissions, t, convertDeviceToBLEDevice, isKidooDevice]);

  const stopScan = useCallback(() => {
    try {
      if (managerRef.current) {
        managerRef.current.stopDeviceScan();
      }

      setState((prev) => ({
        ...prev,
        isScanning: false,
      }));
    } catch (error) {
      console.error('Erreur lors de l\'arrêt du scan:', error);
    }
  }, []);

  const connectToDevice = useCallback(async (deviceId: string) => {
    try {
      // Trouver l'appareil dans la liste scannée
      const device = state.scannedDevices.find((d) => d.id === deviceId);
      if (!device) {
        showToast.error({
          title: t('toast.error'),
          message: t('bluetooth.errors.deviceNotFound', {
            defaultValue: 'Appareil non trouvé',
          }),
        });
        return;
      }

      setState((prev) => ({
        ...prev,
        isConnected: true,
        connectedDevice: device,
      }));

      // TODO: Implémenter la connexion avec la bibliothèque BLE
      // const connectedDevice = await manager.connectToDevice(deviceId);
      // await connectedDevice.discoverAllServicesAndCharacteristics();

      showToast.success({
        title: t('toast.success'),
        message: t('bluetooth.connected', {
          defaultValue: 'Connecté à {{name}}',
          name: device.name || deviceId,
        }),
      });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setState((prev) => ({
        ...prev,
        isConnected: false,
        connectedDevice: null,
      }));
      showToast.error({
        title: t('toast.error'),
        message: t('bluetooth.errors.connectionError', {
          defaultValue: 'Erreur lors de la connexion',
        }),
      });
    }
  }, [state.scannedDevices, t]);

  const disconnectDevice = useCallback(async () => {
    try {
      if (!state.connectedDevice) {
        return;
      }

      // TODO: Implémenter la déconnexion avec la bibliothèque BLE
      // await connectedDevice.cancelConnection();

      setState((prev) => ({
        ...prev,
        isConnected: false,
        connectedDevice: null,
      }));

      showToast.success({
        title: t('toast.success'),
        message: t('bluetooth.disconnected', {
          defaultValue: 'Déconnecté',
        }),
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      showToast.error({
        title: t('toast.error'),
        message: t('bluetooth.errors.disconnectionError', {
          defaultValue: 'Erreur lors de la déconnexion',
        }),
      });
    }
  }, [state.connectedDevice, t]);

  const sendCommand = useCallback(
    async (command: string, data?: Record<string, unknown>) => {
      try {
        if (!state.isConnected || !state.connectedDevice) {
          showToast.error({
            title: t('toast.error'),
            message: t('bluetooth.errors.notConnected', {
              defaultValue: 'Aucun appareil connecté',
            }),
          });
          return;
        }

        // TODO: Implémenter l'envoi de commande avec la bibliothèque BLE
        // const commandString = JSON.stringify({ command, data });
        // await characteristic.writeWithResponse(commandString);

        console.log('Commande envoyée:', command, data);
      } catch (error) {
        console.error('Erreur lors de l\'envoi de la commande:', error);
        showToast.error({
          title: t('toast.error'),
          message: t('bluetooth.errors.sendError', {
            defaultValue: 'Erreur lors de l\'envoi de la commande',
          }),
        });
      }
    },
    [state.isConnected, state.connectedDevice, t]
  );

  const clearScannedDevices = useCallback(() => {
    setState((prev) => ({
      ...prev,
      scannedDevices: [],
      kidooDevices: [],
    }));
  }, []);

  const clearPendingKidoo = useCallback(() => {
    setState((prev) => ({
      ...prev,
      pendingKidooDevice: null,
    }));
  }, []);


  // Démarrer automatiquement le scan une fois que le Bluetooth est disponible
  useEffect(() => {
    if (state.isAvailable && state.isEnabled && !state.isScanning) {
      // Petit délai pour s'assurer que tout est initialisé
      const timer = setTimeout(() => {
        startScan();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [state.isAvailable, state.isEnabled, state.isScanning, startScan]);

  // Ouvrir automatiquement le bottom sheet quand un Kidoo non lié est détecté
  // IMPORTANT: Attendre que l'app soit prête (splash screen caché) avant d'ouvrir
  useEffect(() => {
    // Ne pas ouvrir si l'app n'est pas encore prête
    if (!isAppReady) {
      return;
    }
    
    if (state.pendingKidooDevice && kidoos) {
      // Vérifier si le Kidoo est déjà lié avant d'ouvrir le sheet
      const isAlreadyLinked = kidoos.some(
        (kidoo) => kidoo.deviceId === state.pendingKidooDevice!.id || kidoo.macAddress === state.pendingKidooDevice!.id
      );
      
      // Ouvrir le sheet seulement si le Kidoo n'est pas déjà lié
      if (!isAlreadyLinked) {
        // Petit délai pour s'assurer que le sheet est monté dans le DOM
        const timer = setTimeout(() => {
          // Vérifier que le ref est disponible avant d'ouvrir
          if (addKidooSheet.ref.current) {
            addKidooSheet.open();
          }
        }, 200);
        return () => clearTimeout(timer);
      } else {
        // Si déjà lié, nettoyer le pending pour éviter de réessayer
        clearPendingKidoo();
      }
    }
  }, [state.pendingKidooDevice, kidoos, addKidooSheet, clearPendingKidoo, isAppReady]);

  // Handler pour compléter l'ajout du device
  const handleAddDeviceComplete = useCallback(async () => {
    if (!pendingDeviceForAddSheet) {
      return;
    }

    const { device, detectedModel } = pendingDeviceForAddSheet;

    try {
      // Convertir le modèle pour l'API (BASIC/MINI au lieu de Kidoo-Basic/Kidoo-Dream)
      const apiModel = detectedModel === 'Kidoo-Basic' ? 'BASIC' : 'MINI';
      
      await createKidoo.mutateAsync({
        name: device.name || `Kidoo ${detectedModel}`,
        macAddress: device.id, // Utiliser l'ID BLE comme macAddress
        model: apiModel as 'BASIC' | 'MINI',
      });

      await addDeviceSheet.close();
      setPendingDeviceForAddSheet(null);
      clearPendingKidoo();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du Kidoo:', error);
    }
  }, [pendingDeviceForAddSheet, createKidoo, addDeviceSheet, clearPendingKidoo]);

  // Handler pour fermer AddDeviceSheet
  const handleAddDeviceClose = useCallback(() => {
    setPendingDeviceForAddSheet(null);
  }, []);

  // Handler pour fermer le sheet
  const handleAddKidooClose = useCallback(() => {
    clearPendingKidoo();
  }, [clearPendingKidoo]);

  // Handler pour ajouter un Kidoo - ouvre AddDeviceSheet avec le device détecté
  const handleAddKidoo = useCallback(async () => {
    if (!state.pendingKidooDevice) {
      return;
    }

    // Détecter le modèle depuis le device
    const deviceName = state.pendingKidooDevice.name?.toLowerCase() || '';
    let detectedModel: string | null = null;
    
    for (const model of KIDOO_MODELS) {
      const normalizedModel = model.toLowerCase();
      if (deviceName.includes(normalizedModel) || deviceName === normalizedModel) {
        detectedModel = model;
        break;
      }
    }

    if (!detectedModel) {
      return;
    }

    // Fermer AddKidooSheet d'abord
    await addKidooSheet.close();
    
    // Stocker le device et modèle pour AddDeviceSheet (après fermeture du premier sheet)
    setPendingDeviceForAddSheet({ 
      device: state.pendingKidooDevice, 
      detectedModel 
    });
    
    // Attendre un délai pour que le premier sheet soit fermé et que AddDeviceSheet soit rendu
    setTimeout(async () => {
      if (addDeviceSheet.ref.current) {
        await addDeviceSheet.open();
      }
    }, 300);
  }, [state.pendingKidooDevice, addKidooSheet, addDeviceSheet]);

  const value = useMemo<BluetoothContextType>(
    () => ({
      ...state,
      requestPermissions,
      startScan,
      stopScan,
      connectToDevice,
      disconnectDevice,
      sendCommand,
      clearScannedDevices,
      clearPendingKidoo,
      isKidooDevice,
      addKidooSheet, // Exposer le bottom sheet intégré
      openAddDeviceSheet: handleAddKidoo, // Exposer la méthode pour ouvrir AddDeviceSheet
    }),
    [
      state,
      requestPermissions,
      startScan,
      stopScan,
      connectToDevice,
      disconnectDevice,
      sendCommand,
      clearScannedDevices,
      clearPendingKidoo,
      isKidooDevice,
      addKidooSheet,
      handleAddKidoo,
    ]
  );

  // Détecter le modèle depuis le device pending
  const detectedModelForAddSheet = useMemo(() => {
    if (!pendingDeviceForAddSheet?.device?.name) {
      return null;
    }
    
    const normalizedName = pendingDeviceForAddSheet.device.name.toLowerCase();
    for (const model of KIDOO_MODELS) {
      const normalizedModel = model.toLowerCase();
      if (normalizedName.includes(normalizedModel) || normalizedName === normalizedModel) {
        return model;
      }
    }
    return null;
  }, [pendingDeviceForAddSheet]);

  return (
    <BluetoothContext.Provider value={value}>
      {children}
      {/* Bottom Sheet intégré pour ajouter un Kidoo détecté */}
      <AddKidooSheet
        bottomSheet={addKidooSheet}
        device={state.pendingKidooDevice}
        onClose={handleAddKidooClose}
        onAdd={handleAddKidoo}
      />
      {/* Bottom Sheet avec stepper pour ajouter un device */}
      {pendingDeviceForAddSheet && (
        <AddDeviceSheet
          bottomSheet={addDeviceSheet}
          device={pendingDeviceForAddSheet.device}
          detectedModel={detectedModelForAddSheet || pendingDeviceForAddSheet.detectedModel}
          onClose={handleAddDeviceClose}
          onComplete={handleAddDeviceComplete}
        />
      )}
    </BluetoothContext.Provider>
  );
}

export function useBluetooth(): BluetoothContextType {
  const context = useContext(BluetoothContext);
  if (context === undefined) {
    throw new Error('useBluetooth must be used within a BluetoothProvider');
  }
  return context;
}
