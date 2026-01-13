# Guide de connexion lecteur SD → ESP32 WROOM-32 Type C (DevKitC-32)

## ✅ Configuration pour ESP32 WROOM-32 Type C

L'ESP32 WROOM-32 Type C utilise **directement les numéros GPIO** (pas de labels D1, D2, etc.).
Les broches sont généralement marquées directement sur la carte : **GPIO 23**, **GPIO 19**, **GPIO 18**, **GPIO 5**, etc.

### Correspondance lecteur SD → ESP32 WROOM-32 Type C

| Lecteur SD | ESP32 WROOM-32 Type C | Numéro GPIO | Notes |
|------------|----------------------|-------------|-------|
| **VCC** | **3.3V** | - | ⚠️ Alimentation 3.3V (PAS VN !) |
| **GND** | **GND** | - | Masse commune |
| **MOSI** | **GPIO 23** | GPIO 23 | Master Out Slave In (VSPI MOSI) |
| **MISO** | **GPIO 19** | GPIO 19 | Master In Slave Out (VSPI MISO) |
| **SCK/CLK** | **GPIO 18** | GPIO 18 | Horloge SPI (VSPI SCK) |
| **CS/SS** | **GPIO 5** | GPIO 5 | Chip Select (n'importe quelle GPIO) |

## Schéma de connexion (ESP32 WROOM-32 Type C)

```
Lecteur SD Module          ESP32 WROOM-32 Type C
─────────────────          ───────────────────────
VCC  ──────────────────────> 3.3V  (broche marquée "3.3V")
GND  ──────────────────────> GND   (broche marquée "GND")
MOSI ──────────────────────> GPIO 23  (marqué "23" sur la carte)
MISO ──────────────────────> GPIO 19  (marqué "19" sur la carte)
SCK  ──────────────────────> GPIO 18  (marqué "18" sur la carte)
CS   ──────────────────────> GPIO 5   (marqué "5" sur la carte)
```

### Photo/Schéma physique typique de l'ESP32 WROOM-32 Type C :

```
      [ESP32 WROOM-32 Type C - Vue de dessus]
      
   GND  EN  VIN  GND  GPIO0  GPIO2  GPIO4  GPIO5  GPIO18  GPIO19  GPIO21  GPIO22  GPIO23  GND
   │    │   │    │     │      │      │      │       │       │       │       │       │     │
   └────┴───┴────┴─────┴──────┴──────┴──────┴───────┴───────┴───────┴───────┴───────┴─────┘
   
   Connectez :
   - SD VCC → 3.3V (pas VIN !)
   - SD GND → GND
   - SD MOSI → GPIO 23
   - SD MISO → GPIO 19
   - SD SCK → GPIO 18
   - SD CS → GPIO 5
```

## Configuration alternative (HSPI) si VSPI ne fonctionne pas

Si GPIO 23/19/18 ne fonctionnent pas, essayez HSPI :

| Lecteur SD | ESP32 WROOM-32 Type C (HSPI) | GPIO |
|------------|------------------------------|------|
| **MOSI** | GPIO 13 | GPIO 13 |
| **MISO** | GPIO 12 | GPIO 12 |
| **SCK** | GPIO 14 | GPIO 14 |
| **CS** | GPIO 5 | GPIO 5 |

⚠️ **Note** : Pour utiliser HSPI, modifiez `sd_manager.h` et décommentez les lignes HSPI.

## ⚠️ Points importants pour ESP32 WROOM-32 Type C

1. **Alimentation VCC** : Connectez à **3.3V** (PAS VIN, PAS VN !)
   - **3.3V** = Alimentation 3.3V régulée ✅
   - **VIN** = Entrée 5V non régulée ❌
   - **VN** = Entrée analogique pour capteurs ❌

2. **Broches directement marquées** : Sur l'ESP32 WROOM-32 Type C, les GPIO sont directement marqués (GPIO 23, GPIO 19, etc.)
   - Pas besoin de chercher de correspondance Dx → GPIO
   - Utilisez directement les numéros marqués sur la carte

3. **Broches réservées** : Ne pas utiliser GPIO 6-11 (utilisées par la Flash interne)

4. **Broches d'entrée uniquement** : GPIO 34-39 sont uniquement des entrées (pas de sortie)

## ✅ Configuration actuelle dans le code

Le fichier `sd_manager.h` utilise actuellement la configuration **VSPI standard** :
- **MOSI** : GPIO 23 ✅
- **MISO** : GPIO 19 ✅
- **SCK** : GPIO 18 ✅
- **CS** : GPIO 5 ✅

Cette configuration est **correcte pour l'ESP32 WROOM-32 Type C**. Le code devrait fonctionner avec les connexions physiques correctes.

## 🔧 Vérifications si ça ne fonctionne pas

1. ✅ Vérifiez que VCC est bien connecté à **3.3V** (pas VIN)
2. ✅ Vérifiez que toutes les broches sont correctement soudées/branchées
3. ✅ Vérifiez que la carte SD est formatée en **FAT32**
4. ✅ Vérifiez que la carte SD est bien insérée dans le lecteur
5. ✅ Vérifiez les résistances pull-up si nécessaire (certains modules en nécessitent sur MISO et CS)
6. 🔄 Essayez l'alternative HSPI (GPIO 13/12/14) si VSPI ne fonctionne pas
