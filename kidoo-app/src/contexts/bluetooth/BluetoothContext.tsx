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
import { KIDOO_MODELS, isValidKidooModel, convertBleModelToApiModel } from '@/config';
import { useBottomSheet, UseBottomSheetReturn } from '@/hooks/useBottomSheet';
import { useKidoos } from '@/hooks/useKidoos';
import { useCreateKidoo } from '@/hooks/useKidoos';
import * as BLECommands from './commands';
import { BLECommand, CommandResult } from './commands';

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
  sendCommand: (command: BLECommand | string, data?: Record<string, unknown>) => Promise<CommandResult>;
  clearScannedDevices: () => void;
  clearPendingKidoo: () => void;
  isKidooDevice: (device: BLEDevice) => boolean;
  addKidooSheet: UseBottomSheetReturn; // Bottom sheet intégré pour ajouter un Kidoo
  addDeviceSheet: UseBottomSheetReturn; // Bottom sheet pour AddDeviceSheet
  scanKidoosSheet: UseBottomSheetReturn; // Bottom sheet pour ScanKidoosSheet
  pendingDeviceForAddSheet: { device: BLEDevice; detectedModel: string } | null; // Device en attente pour AddDeviceSheet
  detectedModelForAddSheet: string | null; // Modèle détecté pour AddDeviceSheet
  handleAddKidooClose: () => void; // Handler pour fermer AddKidooSheet
  handleAddKidoo: (device?: BLEDevice) => Promise<void>; // Handler pour ajouter un Kidoo
  handleAddDeviceClose: () => void; // Handler pour fermer AddDeviceSheet
  handleAddDeviceComplete: (formData: { name: string; wifiSSID: string; wifiPassword?: string; brightness?: number; sleepTimeout?: number; firmwareVersion?: string }) => Promise<void>; // Handler pour compléter l'ajout
  handleSelectDevice: (device: BLEDevice) => Promise<void>; // Handler pour sélectionner un device depuis le scan
  openAddDeviceSheet: (device?: BLEDevice) => void; // Ouvrir AddDeviceSheet avec un device optionnel
  openScanSheet: () => Promise<void>; // Ouvrir le sheet de scan manuel
}

const BluetoothContext = createContext<BluetoothContextType | undefined>(undefined);

interface BluetoothProviderProps {
  children: React.ReactNode;
}

export function BluetoothProvider({ children }: BluetoothProviderProps) {
  const { t } = useTranslation();
  const managerRef = useRef<BleManager | null>(null);
  const connectedDeviceRef = useRef<Device | null>(null); // Référence au Device BLE connecté
  const isScanningRef = useRef(false); // Ref pour suivre si un scan est en cours (synchrone)
  const addKidooSheet = useBottomSheet(); // Bottom sheet intégré
  const addDeviceSheet = useBottomSheet(); // Bottom sheet pour AddDeviceSheet
  const scanKidoosSheet = useBottomSheet(); // Bottom sheet pour ScanKidoosSheet
  const { data: kidoos } = useKidoos(); // Liste des Kidoos pour vérifier si déjà lié
  const createKidoo = useCreateKidoo();
  const [pendingDeviceForAddSheet, setPendingDeviceForAddSheet] = useState<{ device: BLEDevice; detectedModel: string } | null>(null);
  const isOpeningAddDeviceSheetRef = useRef(false); // Flag pour éviter les ouvertures multiples
  const isManualAddInProgressRef = useRef(false); // Flag pour indiquer qu'un ajout manuel est en cours
  const dismissedDeviceIdsRef = useRef<Set<string>>(new Set()); // Liste des IDs des devices annulés/refusés
  // Le BluetoothProvider n'est rendu que pour les utilisateurs authentifiés
  // Donc on peut toujours ouvrir le bottom sheet (pas besoin de vérifier la navigation)

  // ===== Fonctions utilitaires pour la gestion des bottom sheets =====
  
  /**
   * Ouvre un sheet principal (addKidooSheet ou scanKidoosSheet) en fermant l'autre automatiquement
   * Ces deux sheets sont mutuellement exclusifs
   */
  const openMainSheet = useCallback(async (
    targetSheet: UseBottomSheetReturn
  ): Promise<void> => {
    // Déterminer quel est l'autre sheet à fermer
    const otherSheet = targetSheet === addKidooSheet ? scanKidoosSheet : addKidooSheet;
    
    // Fermer l'autre sheet s'il est ouvert
    await otherSheet.close().catch(() => {});
    
    // Ouvrir le sheet cible s'il n'est pas déjà ouvert
    if (!targetSheet.isOpen()) {
      await targetSheet.open();
    }
  }, [addKidooSheet, scanKidoosSheet]);
  
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
      // Déconnecter le device si connecté
      if (connectedDeviceRef.current) {
        connectedDeviceRef.current.cancelConnection().catch(console.error);
        connectedDeviceRef.current = null;
      }
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

      // Vérifier si un scan est déjà en cours (vérification synchrone avec ref)
      if (isScanningRef.current) {
        return; // Un scan est déjà en cours, ne pas en démarrer un nouveau
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

      // Marquer le scan comme actif
      isScanningRef.current = true;
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
          isScanningRef.current = false; // Réinitialiser le ref
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
      isScanningRef.current = false; // Réinitialiser le ref en cas d'erreur
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

      isScanningRef.current = false; // Réinitialiser le ref
      setState((prev) => ({
        ...prev,
        isScanning: false,
      }));
    } catch (error) {
      console.error('Erreur lors de l\'arrêt du scan:', error);
      isScanningRef.current = false; // Réinitialiser le ref même en cas d'erreur
    }
  }, []);

  const connectToDevice = useCallback(async (deviceId: string) => {
    try {
      if (!managerRef.current) {
        showToast.error({
          title: t('toast.error'),
          message: t('bluetooth.errors.managerNotInitialized', {
            defaultValue: 'Gestionnaire BLE non initialisé',
          }),
        });
        return;
      }

      // Vérifier si déjà connecté au même device
      if (state.isConnected && state.connectedDevice?.id === deviceId && connectedDeviceRef.current) {
        console.log('[BLE] Déjà connecté au device:', deviceId);
        // Vérifier que la connexion est toujours active
        try {
          const isConnected = await connectedDeviceRef.current.isConnected();
          if (isConnected) {
            // Déjà connecté et connexion active, ne rien faire
            return;
          }
        } catch (error) {
          // La connexion n'est plus active, continuer pour se reconnecter
          console.log('[BLE] Connexion précédente invalide, reconnexion...');
        }
      }

      // Si connecté à un autre device, se déconnecter d'abord
      if (state.isConnected && state.connectedDevice?.id !== deviceId && connectedDeviceRef.current) {
        console.log('[BLE] Déconnexion du device précédent:', state.connectedDevice?.id);
        try {
          await connectedDeviceRef.current.cancelConnection();
        } catch (error) {
          console.warn('[BLE] Erreur lors de la déconnexion du device précédent:', error);
        }
        connectedDeviceRef.current = null;
        setState((prev) => ({
          ...prev,
          isConnected: false,
          connectedDevice: null,
        }));
      }

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

      // Se connecter au device via BLE avec négociation MTU
      // Négocier un MTU de 512 bytes pour permettre l'envoi de commandes JSON plus longues
      const bleDevice = await managerRef.current.connectToDevice(deviceId, {
        requestMTU: 512,
      });
      
      // Découvrir les services et caractéristiques
      await bleDevice.discoverAllServicesAndCharacteristics();
      
      // Le MTU a été négocié lors de la connexion avec requestMTU: 512
      console.log('[BLE] MTU négocié: 512 bytes (demandé lors de la connexion)');

      // Stocker la référence au device connecté
      connectedDeviceRef.current = bleDevice;

      // Mettre à jour le state après connexion réussie
      setState((prev) => ({
        ...prev,
        isConnected: true,
        connectedDevice: device,
      }));

      // Écouter les événements de déconnexion
      // IMPORTANT: Wrapper dans try-catch pour éviter les crashes
      // La bibliothèque peut appeler ce callback même pendant le nettoyage
      bleDevice.onDisconnected((error, device) => {
        try {
          console.log('Device déconnecté:', device?.id, error);
          // Réinitialiser la référence AVANT de mettre à jour le state
          // pour éviter que d'autres opérations BLE tentent d'utiliser le device déconnecté
          connectedDeviceRef.current = null;
          setState((prev) => ({
            ...prev,
            isConnected: false,
            connectedDevice: null,
          }));
        } catch (err) {
          // Ignorer les erreurs dans le callback de déconnexion
          // pour éviter les crashes en cascade
          console.error('Erreur dans le callback onDisconnected (ignorée):', err);
        }
      });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      connectedDeviceRef.current = null;
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
      throw error; // Re-throw pour que l'appelant puisse gérer l'erreur
    }
  }, [state.scannedDevices, state.isConnected, state.connectedDevice, t]);

  const disconnectDevice = useCallback(async () => {
    try {
      // Réinitialiser la référence AVANT toute opération pour éviter
      // que d'autres opérations BLE tentent d'utiliser le device pendant la déconnexion
      const deviceToDisconnect = connectedDeviceRef.current;
      connectedDeviceRef.current = null;
      
      // Mettre à jour le state immédiatement pour éviter les opérations BLE concurrentes
      setState((prev) => ({
        ...prev,
        isConnected: false,
        connectedDevice: null,
      }));

      if (!state.connectedDevice || !deviceToDisconnect) {
        // Si pas de device connecté, on a déjà mis à jour le state
        return;
      }

      // Déconnecter le device BLE avec protection contre les erreurs
      // La bibliothèque peut déjà avoir nettoyé la connexion automatiquement
      try {
        await deviceToDisconnect.cancelConnection();
      } catch (cancelError: any) {
        // Ignorer les erreurs de cancelConnection car la bibliothèque
        // peut avoir déjà nettoyé la connexion automatiquement
        // (par exemple si la connexion était déjà perdue)
        console.log('Erreur lors de cancelConnection (peut être ignorée):', cancelError?.message);
      }

      // Toast de déconnexion retiré - la déconnexion est silencieuse
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Mettre à jour le state même en cas d'erreur
      connectedDeviceRef.current = null;
      setState((prev) => ({
        ...prev,
        isConnected: false,
        connectedDevice: null,
      }));
      // Ne pas afficher d'erreur si c'est juste une déconnexion normale
      // (la bibliothèque peut avoir déjà nettoyé)
      const errorMessage = (error as any)?.message || '';
      if (!errorMessage.includes('already') && !errorMessage.includes('disconnected')) {
        showToast.error({
          title: t('toast.error'),
          message: t('bluetooth.errors.disconnectionError', {
            defaultValue: 'Erreur lors de la déconnexion',
          }),
        });
      }
    }
  }, [state.connectedDevice, t]);

  const sendCommand = useCallback(
    async (command: BLECommand | string, data?: Record<string, unknown>): Promise<CommandResult> => {
      // Vérifier d'abord le state
      if (!state.isConnected || !state.connectedDevice || !connectedDeviceRef.current) {
        const errorMessage = t('bluetooth.errors.notConnected', {
          defaultValue: 'Aucun appareil connecté',
        });
        showToast.error({
          title: t('toast.error'),
          message: errorMessage,
        });
        return {
          success: false,
          message: errorMessage,
        };
      }

      // Vérifier que le device est toujours réellement connecté
      // (la connexion peut avoir été perdue entre-temps)
      const deviceToUse = connectedDeviceRef.current;
      try {
        const isActuallyConnected = await deviceToUse.isConnected();
        if (!isActuallyConnected) {
          // Mettre à jour le state pour refléter la déconnexion
          connectedDeviceRef.current = null;
          setState((prev) => ({
            ...prev,
            isConnected: false,
            connectedDevice: null,
          }));
          
          const errorMessage = t('bluetooth.errors.notConnected', {
            defaultValue: 'Aucun appareil connecté',
          });
          return {
            success: false,
            message: errorMessage,
          };
        }
      } catch (checkError: any) {
        // Si on ne peut pas vérifier la connexion, le device est probablement déconnecté
        console.warn('[BLE] Impossible de vérifier la connexion:', checkError?.message);
        connectedDeviceRef.current = null;
        setState((prev) => ({
          ...prev,
          isConnected: false,
          connectedDevice: null,
        }));
        return {
          success: false,
          message: 'Device déconnecté ou inaccessible',
        };
      }

      try {
        // Router vers la commande appropriée via le routeur
        const result = await BLECommands.routeCommand(
          deviceToUse,
          command,
          {
            ...data,
            timeoutMs: 30000, // Timeout par défaut de 30 secondes
          }
        );

        // Retourner le résultat directement (ne pas lancer d'erreur)
        // Le code appelant peut vérifier result.success et result.wifiConnected
        return result;
      } catch (error: any) {
        console.error('Erreur lors de l\'envoi de la commande:', error);
        
        // Vérifier si c'est une erreur de déconnexion
        const isDisconnectionError = 
          error?.message?.includes('disconnected') ||
          error?.message?.includes('not connected') ||
          error?.message?.includes('Device non connecté') ||
          error?.message?.includes('Device déconnecté') ||
          error?.reason === 'DeviceDisconnected' ||
          String(error?.errorCode) === 'DeviceDisconnected';
        
        // Si c'est une déconnexion, mettre à jour le state
        if (isDisconnectionError) {
          connectedDeviceRef.current = null;
          setState((prev) => ({
            ...prev,
            isConnected: false,
            connectedDevice: null,
          }));
        }
        
        const errorMessage = error?.message || t('bluetooth.errors.sendError', {
          defaultValue: 'Erreur lors de l\'envoi de la commande',
        });
        
        // Ne pas afficher de toast pour les erreurs de déconnexion (c'est normal)
        if (!isDisconnectionError) {
          showToast.error({
            title: t('toast.error'),
            message: errorMessage,
          });
        }
        
        return {
          success: false,
          message: errorMessage,
        };
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
      startScan();
    }
  }, [state.isAvailable, state.isEnabled, state.isScanning, startScan]);

  // Ref pour suivre si on a déjà tenté d'ouvrir le sheet pour ce device
  const openedDeviceIdRef = useRef<string | null>(null);
  const isOpeningRef = useRef(false); // Flag pour éviter les tentatives simultanées
  
  // Ouvrir automatiquement le bottom sheet quand un Kidoo non lié est détecté
  useEffect(() => {
    // Si pas de device pending ou pas de liste de kidoos, ne rien faire
    if (!state.pendingKidooDevice || !kidoos) {
      return;
    }
    
    // Ne pas ouvrir automatiquement si on a déjà un device en cours d'ajout via le scan manuel
    // ou si un ajout manuel est en cours
    if (pendingDeviceForAddSheet || isManualAddInProgressRef.current) {
      return;
    }
    
    // Ne pas ouvrir automatiquement si le sheet de scan est ouvert
    // (l'utilisateur est en train de scanner manuellement)
    if (scanKidoosSheet.isOpen()) {
      return;
    }
    
    const deviceId = state.pendingKidooDevice.id;
    
    // Si on est déjà en train d'ouvrir le sheet, ne pas réessayer
    if (isOpeningRef.current) {
      return;
    }
    
    // Si on a déjà ouvert le sheet pour ce device et qu'il est toujours ouvert, ne pas réessayer
    if (openedDeviceIdRef.current === deviceId && addKidooSheet.isOpen()) {
      return;
    }
    
    // Si le sheet est ouvert pour un autre device, ne pas ouvrir
    if (addKidooSheet.isOpen() && openedDeviceIdRef.current !== deviceId) {
      return;
    }
    
    // Vérifier si le Kidoo est déjà lié avant d'ouvrir le sheet
    // Comparer avec deviceId, macAddress (WiFi) ou bluetoothMacAddress
    const isAlreadyLinked = kidoos.some(
      (kidoo) => kidoo.deviceId === deviceId || kidoo.macAddress === deviceId || kidoo.bluetoothMacAddress === deviceId
    );
    
    // Si déjà lié, nettoyer le pending
    if (isAlreadyLinked) {
      clearPendingKidoo();
      openedDeviceIdRef.current = null;
      isOpeningRef.current = false;
      return;
    }
    
    // Vérifier si l'utilisateur a déjà annulé/refusé ce device
    if (dismissedDeviceIdsRef.current.has(deviceId)) {
      clearPendingKidoo();
      openedDeviceIdRef.current = null;
      isOpeningRef.current = false;
      return;
    }
    
    // Marquer qu'on essaie d'ouvrir pour ce device
    openedDeviceIdRef.current = deviceId;
    isOpeningRef.current = true;
    
    // Utiliser la fonction utilitaire pour ouvrir en fermant l'autre sheet principal
    openMainSheet(addKidooSheet)
      .then(() => {
        isOpeningRef.current = false;
      })
      .catch((error) => {
        console.error('[BLE] Erreur lors de l\'ouverture du sheet:', error);
        openedDeviceIdRef.current = null;
        isOpeningRef.current = false;
      });
  }, [state.pendingKidooDevice, kidoos, addKidooSheet, clearPendingKidoo, pendingDeviceForAddSheet, openMainSheet]);

  // Handler pour compléter l'ajout du device
  const handleAddDeviceComplete = useCallback(async (formData: { 
    name: string; 
    wifiSSID: string; 
    wifiPassword?: string; 
    deviceId?: string;
    macAddress?: string;
    bluetoothMacAddress?: string;
    brightness?: number;
    sleepTimeout?: number;
    firmwareVersion?: string;
  }) => {
    if (!pendingDeviceForAddSheet) {
      return;
    }

    const { device, detectedModel } = pendingDeviceForAddSheet;

    try {
      // Convertir le modèle BLE vers le modèle API
      const apiModel = convertBleModelToApiModel(detectedModel);
      
      // Utiliser l'UUID renvoyé par l'ESP32 (généré lors de la commande setup)
      if (!formData.deviceId) {
        console.error('Erreur: deviceId manquant (devrait être renvoyé par l\'ESP32)');
        throw new Error('deviceId manquant');
      }
      
      await createKidoo.mutateAsync({
        name: formData.name || device.name || `Kidoo ${detectedModel}`,
        macAddress: formData.macAddress || undefined, // Adresse MAC WiFi renvoyée par l'ESP32
        bluetoothMacAddress: formData.bluetoothMacAddress || device.id, // Adresse MAC Bluetooth (device.id est l'ID BLE qui correspond à l'adresse MAC)
        model: apiModel,
        deviceId: formData.deviceId, // UUID renvoyé par l'ESP32
        wifiSSID: formData.wifiSSID || undefined,
        firmwareVersion: formData.firmwareVersion || undefined,
        brightness: formData.brightness !== undefined ? formData.brightness : undefined,
        sleepTimeout: formData.sleepTimeout !== undefined ? formData.sleepTimeout : undefined,
      });

      await addDeviceSheet.close();
      setPendingDeviceForAddSheet(null);
      clearPendingKidoo();
      isManualAddInProgressRef.current = false; // Réinitialiser le flag
    } catch (error) {
      console.error('Erreur lors de l\'ajout du Kidoo:', error);
      isManualAddInProgressRef.current = false; // Réinitialiser le flag même en cas d'erreur
    }
  }, [pendingDeviceForAddSheet, createKidoo, addDeviceSheet, clearPendingKidoo]);

  // Handler pour fermer AddDeviceSheet
  const handleAddDeviceClose = useCallback(() => {
    setPendingDeviceForAddSheet(null);
    isOpeningAddDeviceSheetRef.current = false;
    isManualAddInProgressRef.current = false; // Réinitialiser le flag
  }, []);

  // Handler pour fermer le sheet
  const handleAddKidooClose = useCallback(() => {
    // Si un device était en attente, l'ajouter à la liste des devices annulés
    if (state.pendingKidooDevice) {
      dismissedDeviceIdsRef.current.add(state.pendingKidooDevice.id);
    }
    
    clearPendingKidoo();
    openedDeviceIdRef.current = null; // Réinitialiser le ref pour permettre une nouvelle ouverture
    isOpeningRef.current = false; // Réinitialiser le flag
  }, [clearPendingKidoo, state.pendingKidooDevice]);

  // Handler pour ajouter un Kidoo - ouvre AddDeviceSheet avec le device détecté
  const handleAddKidoo = useCallback(async (device?: BLEDevice) => {
    // Utiliser le device fourni en paramètre ou celui en pending
    const deviceToUse = device || state.pendingKidooDevice;
    
    if (!deviceToUse) {
      return;
    }

    // Marquer qu'un ajout manuel est en cours (si device est fourni, c'est un ajout manuel)
    if (device) {
      isManualAddInProgressRef.current = true;
    }

    // Détecter le modèle depuis le device
    const deviceName = deviceToUse.name?.toLowerCase() || '';
    let detectedModel: string | null = null;
    
    for (const model of KIDOO_MODELS) {
      const normalizedModel = model.toLowerCase();
      if (deviceName.includes(normalizedModel) || deviceName === normalizedModel) {
        detectedModel = model;
        break;
      }
    }

    if (!detectedModel) {
      isManualAddInProgressRef.current = false;
      return;
    }

    // Fermer AddKidooSheet d'abord si ouvert
    await addKidooSheet.close().catch(() => {
      // Ignorer les erreurs de fermeture
    });
    
    // Stocker le device et modèle pour AddDeviceSheet (après fermeture du premier sheet)
    setPendingDeviceForAddSheet({ 
      device: deviceToUse, 
      detectedModel 
    });
  }, [state.pendingKidooDevice, addKidooSheet]);

  // Ouvrir automatiquement AddDeviceSheet quand pendingDeviceForAddSheet est défini
  // et que le composant est monté
  useEffect(() => {
    if (!pendingDeviceForAddSheet) {
      isOpeningAddDeviceSheetRef.current = false;
      return;
    }

    // Éviter les ouvertures multiples
    if (isOpeningAddDeviceSheetRef.current) {
      return;
    }

    isOpeningAddDeviceSheetRef.current = true;

    // Utiliser la fonction utilitaire pour ouvrir après avoir fermé les autres sheets
    const openSheet = async () => {
      // Attendre le prochain cycle de rendu pour s'assurer que le composant est monté
      requestAnimationFrame(() => {
        requestAnimationFrame(async () => {
          // Fermer scanKidoosSheet s'il est ouvert (addKidooSheet est déjà fermé par handleAddKidoo)
          if (scanKidoosSheet.isOpen()) {
            await scanKidoosSheet.close().catch(() => {});
          }
          
          // Ouvrir AddDeviceSheet s'il n'est pas déjà ouvert
          if (!addDeviceSheet.isOpen()) {
            try {
              await addDeviceSheet.open();
            } catch (error) {
              console.error('[BLE] Erreur lors de l\'ouverture de AddDeviceSheet:', error);
            }
          }
          
          isOpeningAddDeviceSheetRef.current = false;
        });
      });
    };

    openSheet();
  }, [pendingDeviceForAddSheet, addDeviceSheet, addKidooSheet, scanKidoosSheet]);

  const handleSelectDevice = useCallback(async (device: BLEDevice) => {
    // Nettoyer le pendingKidooDevice pour éviter l'ouverture automatique de AddKidooSheet
    // car le scan peut continuer un peu et détecter le même device
    clearPendingKidoo();
    
    // Fermer le scan sheet
    await scanKidoosSheet.close()
    
    // Ouvrir AddDeviceSheet avec le device sélectionné
    handleAddKidoo(device);
  }, [scanKidoosSheet, clearPendingKidoo, handleAddKidoo]);

  // Fonction pour ouvrir le sheet de scan manuel
  const openScanSheet = useCallback(async () => {
    // Fermer addKidooSheet (l'autre sheet principal) et addDeviceSheet si ouvert
    // On ne les attend pas, ils se ferment en arrière-plan
    addKidooSheet.close().catch(() => {});
    addDeviceSheet.close().catch(() => {});
    
    // Ouvrir le scan sheet s'il n'est pas déjà ouvert
    if (!scanKidoosSheet.isOpen()) {
      await scanKidoosSheet.open();
    }
  }, [scanKidoosSheet, addKidooSheet, addDeviceSheet]);

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
      addDeviceSheet, // Exposer le bottom sheet pour AddDeviceSheet
      scanKidoosSheet, // Exposer le bottom sheet pour ScanKidoosSheet
      pendingDeviceForAddSheet, // Exposer le device en attente
      detectedModelForAddSheet, // Exposer le modèle détecté
      handleAddKidooClose, // Exposer le handler pour fermer AddKidooSheet
      handleAddKidoo, // Exposer le handler pour ajouter un Kidoo
      handleAddDeviceClose, // Exposer le handler pour fermer AddDeviceSheet
      handleAddDeviceComplete, // Exposer le handler pour compléter l'ajout
      handleSelectDevice, // Exposer le handler pour sélectionner un device
      openAddDeviceSheet: handleAddKidoo, // Exposer la méthode pour ouvrir AddDeviceSheet
      openScanSheet, // Exposer la méthode pour ouvrir le sheet de scan
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
      addDeviceSheet,
      scanKidoosSheet,
      pendingDeviceForAddSheet,
      detectedModelForAddSheet,
      handleAddKidooClose,
      handleAddKidoo,
      handleAddDeviceClose,
      handleAddDeviceComplete,
      handleSelectDevice,
      openScanSheet,
    ]
  );

  return (
    <BluetoothContext.Provider value={value}>
      {children}
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
