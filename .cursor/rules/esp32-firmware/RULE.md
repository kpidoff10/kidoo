---
description: "Règles et conventions pour le firmware ESP32 (Arduino/PlatformIO)"
alwaysApply: false
globs:
  - esp32/**/*
---

# Firmware ESP32 Kidoo - Règles de Développement

## 🔧 Architecture Globale

### Stack Technique
- **Framework** : Arduino (via PlatformIO)
- **Plateforme** : ESP32 WROOM-32 Type C (DevKitC-32)
- **Librairies principales** :
  - `FastLED` : Gestion LEDs WS2812B
  - `BLEDevice`, `BLEServer` : Bluetooth Low Energy
  - `WiFi` : Access Point et gestion réseau
  - `SD` : Carte SD (SPI)
- **Build System** : PlatformIO
- **Serial Monitor** : 115200 baud, filtres `default` et `esp32_exception_decoder`

## 📁 Structure du Projet

```
esp32/
├── platformio.ini         → Configuration PlatformIO
├── partitions.csv         → Schéma de partitionnement personnalisé
├── src/
│   ├── main.cpp           → Point d'entrée (setup/loop)
│   ├── wifi_manager.h/.cpp → Gestion WiFi Access Point
│   ├── ble_manager.h/.cpp  → Gestion Bluetooth BLE et commandes
│   ├── led_effects.h/.cpp  → Effets LEDs (glossy, rainbow, pulse)
│   ├── sd_manager.h/.cpp   → Gestion carte SD (lecture/écriture)
│   └── bluetooth_manager.* → (Ancien, à éviter)
├── include/               → Headers partagés (vide par défaut)
├── lib/                   → Librairies externes (vide par défaut)
└── test/                  → Tests unitaires (vide par défaut)
```

## 🎯 Règles Critiques

### 1. Organisation du Code

**Séparation modulaire :**
- `main.cpp` : Point d'entrée uniquement, orchestration des managers
- Chaque fonctionnalité = un couple `.h/.cpp` (wifi, ble, led, sd)
- Headers (`.h`) : Déclarations, constantes, prototypes
- Implémentations (`.cpp`) : Logique métier

**Inclusion des headers :**
```cpp
// Dans main.cpp
#include "wifi_manager.h"
#include "ble_manager.h"
#include "led_effects.h"
#include "sd_manager.h"
```

### 2. Gestion des Pins GPIO

**Configuration actuelle (ESP32 WROOM-32 Type C) :**

```cpp
// LEDs WS2812B
#define DATA_PIN 2          // GPIO 2 pour WS2812B

// Carte SD (SPI)
#define SD_MOSI_PIN 23      // GPIO 23 (VSPI MOSI)
#define SD_MISO_PIN 19      // GPIO 19 (VSPI MISO)
#define SD_SCK_PIN 18       // GPIO 18 (VSPI SCK)
#define SD_CS_PIN 5         // GPIO 5 (Chip Select)
```

**⚠️ IMPORTANT :**
- Utiliser les **NUMÉROS GPIO** directement (23, 19, 18, 5)
- Sur ESP32 WROOM-32 Type C, pas de labels D1/D2/etc. → GPIO directement marqués
- Vérifier correspondance si autre carte ESP32
- VCC carte SD → **3.3V** (PAS VIN, PAS VN !)

**Broches réservées (ne pas utiliser) :**
- GPIO 6-11 : Utilisées par Flash interne
- GPIO 34-39 : Entrées uniquement (pas de sortie)
- GPIO 0, 15 : Boot mode (éviter si possible)

### 3. Communication Série

**Configuration :**
```cpp
Serial.begin(115200);
while (!Serial && millis() < 3000) {
  delay(10);  // Attendre Serial prêt (max 3s)
}
```

**Messages de debug :**
- Format : `[MODULE] Message`
- Exemples : `[SD] Carte SD initialisee avec succes !`
- Toujours préfixer avec module (`[SD]`, `[BLE]`, `[WIFI]`, `[MODE]`)

**Baud rate :**
- 115200 (défini dans `platformio.ini` : `monitor_speed = 115200`)
- Si caractères bizarres → vérifier baud rate Serial Monitor

### 4. Gestion WiFi

**Mode Access Point :**
```cpp
initWiFiAP("Kidoo");  // SSID: "Kidoo"
```

**Comportement :**
- WiFi AP toujours actif au démarrage
- Permet configuration initiale via navigateur
- Une fois WiFi configuré via BLE, peut rester connecté

**⚠️ Priorité des modes :**
1. Mode forcé (glossy, rainbow, pulse) via BLE → priorité absolue
2. WiFi connecté → mode automatique selon config
3. Sinon → mode ROUGE par défaut

### 5. Bluetooth BLE

**UUIDs (constantes dans `ble_manager.h`) :**
```cpp
#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID_RX "beb5483e-36e1-4688-b7f5-ea07361b26a8"
#define CHARACTERISTIC_UUID_TX "beb5483e-36e1-4688-b7f5-ea07361b26a9"
```

**Format des commandes :**
- Syntaxe : `COMMAND:VALUE`
- Exemples :
  - `LED_COLOR:255,0,0` → Rouge (RGB)
  - `LED_BRIGHTNESS:128` → Luminosité 50%
  - `LED_EFFECT:glossy` → Effet glossy
  - `LED_EFFECT:rainbow` → Effet arc-en-ciel
  - `LED_EFFECT:pulse` → Effet pulsation
  - `WIFI_SSID:MonWiFi` → Configuration SSID
  - `WIFI_PASSWORD:monpass` → Configuration mot de passe

**Traitement des commandes :**
- Fonction `processBLECommands()` dans `ble_manager.cpp`
- Décodage Base64 depuis app mobile
- Parsing et exécution des commandes

**Mode forcé :**
- Variables globales : `forceGlossyMode`, `forceRainbowMode`, `forcePulseMode`
- Quand activé via BLE → priorité sur état WiFi
- Défini dans `main.cpp` (accès via `extern` dans `ble_manager.cpp`)

### 6. LEDs WS2812B

**Configuration :**
```cpp
#define NUM_LEDS_DEFINE 144  // Nombre de LEDs
#define DATA_PIN 2           // GPIO 2
CRGB leds[NUM_LEDS_DEFINE];
```

**Initialisation :**
```cpp
FastLED.addLeds<NEOPIXEL, DATA_PIN>(leds, NUM_LEDS_DEFINE);
FastLED.setBrightness(255);
```

**Effets disponibles :**
- `setRed()`, `setBlue()`, `setGreen()` : Couleurs unies
- `setGlossy()` : Effet glossy (via `led_effects.cpp`)
- `setRainbow()` : Effet arc-en-ciel (via `led_effects.cpp`)
- `setPulse()` : Effet pulsation (via `led_effects.cpp`)
- Mode manuel : Contrôle RGB depuis app mobile

**Gestion de la luminosité :**
- `FastLED.setBrightness(value)` : 0-255
- Commandé via `LED_BRIGHTNESS:value` depuis BLE

### 7. Modes de Fonctionnement

**Enum Mode :**
```cpp
enum Mode {
  MODE_MANUAL,   // Contrôle via Bluetooth/app
  MODE_GLOSSY,   // Effet glossy automatique
  MODE_RAINBOW,  // Effet arc-en-ciel
  MODE_PULSE,    // Effet pulsation
  MODE_RED,      // Rouge (attente connexion)
  MODE_BLUE,     // Bleu
  MODE_GREEN,    // Vert
  MODE_COUNT
};
```

**Logique dans `loop()` :**
```cpp
// 1. Vérifier modes forcés (priorité absolue)
if (forceGlossyMode) {
  setGlossy();
  currentMode = MODE_GLOSSY;
}
// 2. Sinon, vérifier WiFi
else if (WiFi.status() == WL_CONNECTED) {
  // Mode selon config WiFi
}
// 3. Sinon, mode par défaut (ROUGE)
else {
  setRed();
  currentMode = MODE_RED;
}
```

### 8. Carte SD

**Initialisation :**
```cpp
initSDCard();  // Dans setup()
```

**Broches SPI :**
- Configurées dans `sd_manager.h`
- Initialisation SPI explicite : `SPI.begin(SD_SCK_PIN, SD_MISO_PIN, SD_MOSI_PIN, SD_CS_PIN)`
- CS pin configuré : `pinMode(SD_CS_PIN, OUTPUT); digitalWrite(SD_CS_PIN, HIGH);`

**Fonctions disponibles :**
- `writeSDCardFile(path, data, size)` : Écrire fichier
- `readSDCardFile(path, buffer, size)` : Lire fichier
- `listSDCardFiles(path)` : Lister fichiers
- `createSDCardDirectory(path)` : Créer dossier
- `deleteSDCardFile(path)` : Supprimer fichier

**Format de carte :**
- FAT32 obligatoire
- Capacité recommandée : ≤ 32 GB

**Messages d'erreur :**
- Si initialisation échoue → messages détaillés dans Serial
- Vérifications : connexions, format FAT32, alimentation 3.3V

**Fichier de démarrage :**
- Écrit automatiquement `/startup.txt` avec "ok" au démarrage
- Permet vérifier que SD fonctionne

### 9. Variables Globales

**LEDs :**
```cpp
int NUM_LEDS = NUM_LEDS_DEFINE;  // Variable globale (modifiable)
CRGB leds[NUM_LEDS_DEFINE];       // Buffer LEDs
```

**Modes forcés :**
```cpp
bool forceManualMode = false;
bool forceGlossyMode = false;
bool forceRainbowMode = false;
bool forcePulseMode = false;
```

**Accès depuis autres fichiers :**
- Utiliser `extern` dans headers/implémentations
- Exemple : `extern bool forceGlossyMode;` dans `ble_manager.cpp`

### 10. Fonction `setup()`

**Ordre d'initialisation :**
1. Serial (debug)
2. WiFi AP
3. BLE
4. Carte SD
5. LEDs FastLED
6. Mode initial (ROUGE)

**Structure :**
```cpp
void setup() {
  Serial.begin(115200);
  while (!Serial && millis() < 3000) { delay(10); }
  delay(1000);
  
  initWiFiAP(WIFI_SSID);
  initBLE(BLUETOOTH_NAME);
  
  if (initSDCard()) {
    // Écrire fichier startup.txt
    writeSDCardFile("/startup.txt", ...);
    listSDCardFiles("/");
  }
  
  FastLED.addLeds<NEOPIXEL, DATA_PIN>(leds, NUM_LEDS_DEFINE);
  FastLED.setBrightness(255);
  
  setRed();  // Mode initial
}
```

### 11. Fonction `loop()`

**Logique principale :**
1. Traiter commandes BLE
2. Déterminer mode actuel (forcé → WiFi → défaut)
3. Appliquer mode LED
4. Logging si changement de mode

**Structure :**
```cpp
void loop() {
  processBLECommands();  // Traiter commandes BLE
  
  static Mode currentMode = MODE_RED;
  Mode newMode = determineMode();  // Selon priorités
  
  if (newMode != currentMode) {
    applyMode(newMode);
    currentMode = newMode;
    Serial.print("[MODE] Mode actuel: ");
    Serial.println(getModeName(currentMode));
  }
  
  FastLED.show();
  delay(10);
}
```

### 12. Gestion des Erreurs

**SD Card :**
- Tentatives multiples (3) avec délais
- Messages détaillés si échec
- Continuer fonctionnement même si SD échoue

**BLE :**
- Vérifier connexion avant envoi
- Gérer déconnexion client
- Logs pour debug

**WiFi :**
- Vérifier statut avant utilisation
- Gérer perte de connexion
- Fallback sur mode par défaut

### 13. Optimisations Compilation

**Dans `platformio.ini` :**
```ini
build_flags = 
  -DCORE_DEBUG_LEVEL=0    # Pas de debug
  -Os                     # Optimisation taille
  -ffunction-sections
  -fdata-sections
  -Wl,--gc-sections
```

**Partitionnement :**
- `partitions.csv` : Schéma personnalisé avec 2MB pour programme
- Plus d'espace pour code, moins pour OTA

### 14. Debugging

**Serial Monitor :**
- Baud rate : 115200
- Filtres : `default`, `esp32_exception_decoder`
- Format messages : `[MODULE] Message`

**Messages importants :**
- `[SD]` → Carte SD
- `[BLE]` → Bluetooth
- `[WIFI]` → WiFi
- `[MODE]` → Changement de mode
- `[LED]` → LEDs

**Caractères bizarres dans Serial :**
- Vérifier baud rate (115200)
- Ajouter délai `while (!Serial)` dans setup

## 🚨 Erreurs Courantes à Éviter

### Erreur 1: Mauvaise broche GPIO
**Solution :** Vérifier numéros GPIO directement sur carte (pas Dx labels)

### Erreur 2: SD ne s'initialise pas
**Solution :** Vérifier VCC → 3.3V (pas VIN), format FAT32, connexions SPI

### Erreur 3: Caractères bizarres Serial
**Solution :** Vérifier baud rate 115200, ajouter `while (!Serial)` dans setup

### Erreur 4: Mode LED ne change pas
**Solution :** Vérifier priorités (mode forcé > WiFi > défaut), appeler `FastLED.show()`

### Erreur 5: Commandes BLE ignorées
**Solution :** Vérifier format `COMMAND:VALUE`, décodage Base64, parsing dans `processBLECommands()`

## 💡 Bonnes Pratiques

1. **Messages Serial clairs** : Toujours préfixer avec `[MODULE]`
2. **Gestion d'erreurs** : Vérifier retour des fonctions, continuer si non-critique
3. **Performance** : Utiliser `delay(10)` dans loop, éviter `delay()` longs
4. **Modularité** : Séparer fonctionnalités (wifi, ble, led, sd)
5. **Constantes** : Définir pins, UUIDs, etc. dans headers avec `#define`
6. **Documentation** : Commenter fonctions importantes, expliquer logique complexe

## 📝 Exemples de Code

### Initialisation SD
```cpp
bool initSDCard() {
  Serial.println("[SD] Initialisation de la carte SD...");
  SPI.begin(SD_SCK_PIN, SD_MISO_PIN, SD_MOSI_PIN, SD_CS_PIN);
  pinMode(SD_CS_PIN, OUTPUT);
  digitalWrite(SD_CS_PIN, HIGH);
  
  bool success = SD.begin(SD_CS_PIN, SPI, 4000000);
  if (success) {
    Serial.println("[SD] Carte SD initialisee avec succes !");
    return true;
  } else {
    Serial.println("[SD] ERREUR: Impossible d'initialiser la carte SD !");
    return false;
  }
}
```

### Traitement commande BLE
```cpp
void processBLECommands() {
  String command = receivedBLECommand;  // Depuis callback BLE
  
  if (command.startsWith("LED_COLOR:")) {
    int r, g, b;
    sscanf(command.c_str(), "LED_COLOR:%d,%d,%d", &r, &g, &b);
    for (int i = 0; i < NUM_LEDS; i++) {
      leds[i] = CRGB(r, g, b);
    }
    FastLED.show();
  }
  else if (command == "LED_EFFECT:glossy") {
    forceGlossyMode = true;
    forceManualMode = false;
  }
}
```

### Détermination mode
```cpp
Mode determineMode() {
  if (forceGlossyMode) return MODE_GLOSSY;
  if (forceRainbowMode) return MODE_RAINBOW;
  if (forcePulseMode) return MODE_PULSE;
  if (WiFi.status() == WL_CONNECTED) return MODE_MANUAL;
  return MODE_RED;
}
```

## 📚 Références

- Documentation PlatformIO : https://docs.platformio.org/
- ESP32 Arduino Core : https://github.com/espressif/arduino-esp32
- FastLED Library : https://fastled.io/
- Guide connexion SD : `esp32/SD_CONNECTION_GUIDE.md`
- Pinout ESP32 : `esp32/ESP32_WROOM32_TYPEC_PINOUT.md`
