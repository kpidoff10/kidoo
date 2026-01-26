/**
 * Bluetooth Sheets Component
 * Composant séparé pour rendre les bottom sheets liés au Bluetooth
 * Ce composant est séparé pour éviter les cycles de dépendances
 */

import React from 'react';
import { AddKidooSheet } from '@/screens/kidoos/KidoosListScreen/components/AddKidooSheet';
import { AddDeviceSheet } from '@/components/AddDeviceSheet';
import { ScanKidoosSheet } from '@/components/ScanKidoosSheet';
import { useBluetooth } from './BluetoothContext';

export function BluetoothSheets() {
  const {
    addKidooSheet,
    pendingKidooDevice, // Fait partie de state, accessible via le contexte
    addDeviceSheet,
    scanKidoosSheet,
    pendingDeviceForAddSheet,
    detectedModelForAddSheet,
    handleAddKidooClose,
    handleAddKidoo,
    handleAddDeviceClose,
    handleAddDeviceComplete,
    handleSelectDevice,
  } = useBluetooth();

  return (
    <>
      {/* Bottom Sheet intégré pour ajouter un Kidoo détecté */}
      <AddKidooSheet
        bottomSheet={addKidooSheet}
        device={pendingKidooDevice}
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
      {/* Scan Kidoos Sheet */}
      <ScanKidoosSheet
        bottomSheet={scanKidoosSheet}
        onClose={() => scanKidoosSheet.close()}
        onSelectDevice={handleSelectDevice}
      />
    </>
  );
}
