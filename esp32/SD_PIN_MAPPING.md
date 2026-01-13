# Correspondance des broches SD pour ESP32 WROOM-32 Type C (DevKitC-32)

## ✅ Pour ESP32 WROOM-32 Type C : Utilisez directement les GPIO !

Sur l'ESP32 WROOM-32 Type C (DevKitC-32), les broches sont **directement marquées par leur numéro GPIO** (GPIO 23, GPIO 19, etc.).
Il n'y a **pas de labels D1, D2, etc.** - utilisez directement les numéros marqués sur la carte.

## ⚠️ Note : D1, D2, etc. existent sur d'autres cartes ESP32 (comme NodeMCU)

Sur certaines cartes ESP32 (comme NodeMCU), les labels **D1, D2, D3...** ne correspondent **PAS** directement aux numéros GPIO.
Mais sur l'ESP32 WROOM-32 Type C, vous n'avez pas ce problème - utilisez directement les GPIO.

## Correspondance courante (NodeMCU ESP32 / DevKit)

| Label Carte | GPIO Réel | Fonction |
|-------------|-----------|----------|
| D0 (GPIO 0) | GPIO 0 | Boot mode (attention !) |
| D1 (GPIO 5) | GPIO 5 | ✅ **CS SD recommandé** |
| D2 (GPIO 4) | GPIO 4 | |
| D3 (GPIO 0) | GPIO 0 | Boot (éviter) |
| D4 (GPIO 2) | GPIO 2 | ✅ **LED WS2812B (déjà utilisé)** |
| D5 (GPIO 14) | GPIO 14 | SCK possible |
| D6 (GPIO 12) | GPIO 12 | MISO possible |
| D7 (GPIO 13) | GPIO 13 | MOSI possible |
| D8 (GPIO 15) | GPIO 15 | Boot (éviter) |

## Configuration actuelle du code

Le code utilise actuellement :
- **MOSI** : GPIO 23
- **MISO** : GPIO 19  
- **SCK** : GPIO 18
- **CS** : GPIO 5

## Si votre carte utilise D1, D2, etc.

Vous devez trouver la correspondance dans la documentation de votre carte spécifique.

### Exemple NodeMCU ESP32 :
- D1 = GPIO 5 (CS actuel ✅)
- D5 = GPIO 14 (SCK alternatif)
- D6 = GPIO 12 (MISO alternatif)
- D7 = GPIO 13 (MOSI alternatif)

### Exemple ESP32 DevKit :
- Les GPIO sont souvent directement marqués sur la carte
- Utilisez directement les numéros GPIO

## Comment vérifier ?

1. **Regardez la documentation de votre carte** (schéma, datasheet)
2. **Cherchez un tableau de correspondance** Dx → GPIO
3. **Testez avec un code simple** pour identifier les broches

## Configuration alternative à essayer

Si GPIO 23/19/18/5 ne fonctionne pas, essayez :

```cpp
// Option 1 : Broches SPI VSPI standard ESP32
#define SD_MOSI_PIN 23  // VSPI MOSI
#define SD_MISO_PIN 19  // VSPI MISO
#define SD_SCK_PIN 18   // VSPI SCK
#define SD_CS_PIN 5     // CS

// Option 2 : Broches SPI HSPI (alternative)
#define SD_MOSI_PIN 13  // HSPI MOSI
#define SD_MISO_PIN 12  // HSPI MISO
#define SD_SCK_PIN 14   // HSPI SCK
#define SD_CS_PIN 15    // CS (attention: GPIO 15 = boot, peut causer problèmes)

// Option 3 : Broches avec labels Dx (NodeMCU style)
#define SD_MOSI_PIN 13  // D7
#define SD_MISO_PIN 12  // D6
#define SD_SCK_PIN 14   // D5
#define SD_CS_PIN 5     // D1
```
