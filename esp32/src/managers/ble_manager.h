#ifndef BLE_MANAGER_H
#define BLE_MANAGER_H

#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

// UUIDs pour le service et les caractéristiques BLE
#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID_RX "beb5483e-36e1-4688-b7f5-ea07361b26a8"
#define CHARACTERISTIC_UUID_TX "beb5483e-36e1-4688-b7f5-ea07361b26a9"

// Fonction pour initialiser le BLE
void initBLE(const char* deviceName);

// Fonction pour vérifier si un client est connecté
bool isBLEConnected();

// Fonction pour envoyer des données via BLE
void sendBLEData(const char* data);

// Fonction pour traiter les commandes reçues via BLE
void processBLECommands();

// Fonction pour mettre à jour l'état dans StateManager (à appeler périodiquement)
void updateBLEState();

// Fonction pour initialiser la tâche de traitement des commandes BLE (à appeler dans setup)
void initBLECommandTask();

#endif // BLE_MANAGER_H
