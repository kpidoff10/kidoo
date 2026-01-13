---
description: "Vue d'ensemble du projet Kidoo - Boîte à musique interactive pour enfants"
alwaysApply: true
globs: []
---

# Kidoo - Vue d'Ensemble

## 🎵 Qu'est-ce que Kidoo ?

Kidoo est une **boîte à musique interactive pour enfants** qui combine contrôle de LEDs et audio via une application mobile.

## 🏗️ Architecture du Projet

Le projet est décomposé en **2 parties principales** :

### 1. Application Mobile (`my-app/`)
- **Framework** : React Native avec Expo Router
- **Rôle** : Interface utilisateur pour contrôler les Kidoos
- **Communication** : Bluetooth BLE avec les appareils ESP32
- **Fonctionnalités** :
  - Liste et gestion des Kidoos
  - Contrôle des LEDs (couleurs, luminosité, effets)
  - Configuration WiFi des appareils
  - Profil utilisateur
  - Base de données locale SQLite

### 2. Firmware ESP32 (`esp32/`)
- **Framework** : Arduino (PlatformIO)
- **Rôle** : Firmware embarqué sur les appareils Kidoo
- **Composants** :
  - LEDs WS2812B (144 LEDs) - Effets visuels
  - Bluetooth BLE - Communication avec l'app mobile
  - WiFi Access Point - Configuration réseau
  - Carte SD (optionnelle) - Stockage audio/fichiers
- **Fonctionnalités** :
  - Réception commandes BLE depuis l'app
  - Contrôle LEDs (couleurs, effets glossy/rainbow/pulse)
  - Mode Access Point pour configuration initiale
  - Gestion modes automatiques selon état WiFi

## 🔄 Communication Mobile ↔ ESP32

**Protocole** : Bluetooth Low Energy (BLE)

**Format des commandes** :
- `LED_COLOR:r,g,b` → Couleur RGB
- `LED_BRIGHTNESS:value` → Luminosité (0-255)
- `LED_EFFECT:glossy|rainbow|pulse` → Effet LED
- `WIFI_SSID:nom` → Configuration SSID WiFi
- `WIFI_PASSWORD:pass` → Configuration mot de passe WiFi

**Flux** :
1. App mobile scanne et se connecte au Kidoo via BLE
2. App envoie commandes encodées en Base64
3. ESP32 reçoit, décode et exécute les commandes
4. ESP32 applique les effets sur les LEDs en temps réel

## 📁 Structure Globale

```
Kidoo/
├── my-app/          → Application mobile (React Native/Expo)
├── esp32/           → Firmware ESP32 (Arduino/PlatformIO)
└── .cursor/rules/   → Règles de développement
    ├── mobile-app/  → Règles spécifiques application mobile
    ├── esp32-firmware/ → Règles spécifiques firmware ESP32
    └── project-overview/ → Cette règle (vue d'ensemble)
```

## 🎯 Objectif

Permettre aux enfants de contrôler facilement une boîte à musique interactive avec des LEDs colorées, via une application mobile intuitive.
