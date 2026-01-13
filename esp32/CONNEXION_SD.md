# Connexion Carte SD sur ESP32

## ⚠️ IMPORTANT : Alimentation

### Broche VCC du module SD → **3.3V de l'ESP32**

**Ne JAMAIS connecter à :**
- ❌ **5V** (détruirait la carte SD)
- ❌ **VIN** (variable, peut être > 3.3V)
- ❌ **VDD** (si présent sur votre carte)

**Connecter à :**
- ✅ **3.3V** ou **3V3** (broche d'alimentation 3.3V de l'ESP32)

## Connexions complètes

```
Module SD          ESP32 WROOM-32
-----------        ---------------
VCC         →      3.3V (ou 3V3)
GND         →      GND (masse commune)
MOSI        →      GPIO 23 (VSPI MOSI)
MISO        →      GPIO 19 (VSPI MISO)
SCK         →      GPIO 18 (VSPI SCK)
CS          →      GPIO 5
```

## Où trouver 3.3V sur l'ESP32 ?

Sur la plupart des cartes ESP32 DevKit :

1. **Cherchez une broche marquée "3.3V" ou "3V3"**
2. **C'est souvent près du connecteur USB**
3. **Il peut y avoir plusieurs broches 3.3V** - utilisez n'importe laquelle

### Exemple sur ESP32 DevKit V1 :
```
     [USB]  [BOOT]
           |
     [EN]  [GPIO 0]
           |
     3.3V ←─── ICI (VCC de votre module SD)
     GND
     5V
     VIN
     GPIO...
```

## Vérification

- **3.3V** : Tension constante de 3.3 volts
- **GND** : Masse (0V)
- **5V** : 5 volts (NE PAS UTILISER)
- **VIN** : Tension d'entrée (variable, NE PAS UTILISER)

## Si vous n'êtes pas sûr

1. Regardez la documentation de votre carte ESP32
2. Utilisez un multimètre pour vérifier la tension :
   - Mettez le multimètre en mode voltmètre (V)
   - Placez la pointe noire sur GND
   - Placez la pointe rouge sur la broche suspecte
   - Vous devriez lire environ 3.3V

## Résumé

**VCC du module SD → 3.3V de l'ESP32** ✅

C'est la connexion la plus importante ! Si VCC est mal connecté (5V au lieu de 3.3V), la carte SD ne fonctionnera pas ou sera endommagée.
