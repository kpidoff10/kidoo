/**
 * Service BTE (Bluetooth Low Energy)
 * Point d'entrée pour tous les services BLE
 */

export { bleManager, type BLEDevice, type BluetoothConnectionResult, type BLEManagerCallbacks, type WaitForResponseOptions } from './bleManager';
export { bteService, type BluetoothDevice, type BluetoothService } from './bteService';
