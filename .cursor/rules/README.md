# Règles Cursor pour le Projet Kidoo

Ce dossier contient les règles de développement pour le projet Kidoo, configurées selon la [documentation officielle de Cursor](https://cursor.com/fr/docs/context/rules).

## 📋 Règles Disponibles

### 0. `project-overview` - Vue d'Ensemble du Projet
**Description** : Vue d'ensemble simple de Kidoo

**Application** :
- **Type** : `Always Apply`
- **Activation** : Toujours active (contexte global)

**Contenu** :
- Qu'est-ce que Kidoo (boîte à musique pour enfants)
- Architecture en 2 parties (mobile + ESP32)
- Communication BLE
- Structure globale du projet

### 1. `mobile-app` - Application Mobile (React Native/Expo)
**Description** : Règles et conventions pour l'application mobile Kidoo

**Application** :
- **Type** : `Apply to Specific Files`
- **Globs** : `my-app/**/*`
- **Activation** : Automatique quand vous travaillez dans `my-app/`

**Contenu** :
- Architecture Expo Router
- Conventions de nommage et structure de dossiers
- Règles d'internationalisation (i18n)
- Patterns React Context
- Bonnes pratiques de styling
- Gestion Bluetooth BLE
- Base de données SQLite

### 2. `esp32-firmware` - Firmware ESP32 (Arduino/PlatformIO)
**Description** : Règles et conventions pour le firmware ESP32

**Application** :
- **Type** : `Apply to Specific Files`
- **Globs** : `esp32/**/*`
- **Activation** : Automatique quand vous travaillez dans `esp32/`

**Contenu** :
- Architecture modulaire ESP32
- Gestion des GPIO (pins)
- Communication série (Serial Monitor)
- Bluetooth BLE et commandes
- LEDs WS2812B (FastLED)
- Carte SD (SPI)
- Modes de fonctionnement

## 🎯 Comment Utiliser

### Activation Automatique
Les règles s'activent automatiquement selon les fichiers sur lesquels vous travaillez :
- Ouvrez un fichier dans `my-app/` → Règle `mobile-app` appliquée
- Ouvrez un fichier dans `esp32/` → Règle `esp32-firmware` appliquée

### Activation Manuelle
Vous pouvez aussi activer manuellement une règle dans le chat Cursor :
```
@mobile-app comment structurer un nouveau composant ?
@esp32-firmware quelle broche utiliser pour la carte SD ?
```

### Vérifier l'Application
Dans Cursor :
1. Ouvrez **Settings** → **Rules, Commands**
2. Section **Project Rules**
3. Vous verrez les deux règles avec leur statut

## 📚 Documentation Complémentaire

- **Architecture Expo** : `my-app/ARCHITECTURE_EXPO.md`
- **Guide connexion SD** : `esp32/SD_CONNECTION_GUIDE.md`
- **Pinout ESP32** : `esp32/ESP32_WROOM32_TYPEC_PINOUT.md`

## 🔧 Modification des Règles

Pour modifier une règle :
1. Éditez le fichier `.cursor/rules/[nom-regle]/RULE.md`
2. Modifiez le frontmatter si besoin (description, globs, alwaysApply)
3. Les changements sont automatiquement pris en compte

**Note** : Les règles sont versionnées avec Git, donc faites attention aux commits.

## 💡 Bonnes Pratiques

- **Règles ciblées** : Chaque règle couvre un domaine spécifique
- **Exemples concrets** : Les règles incluent des exemples de code
- **Mise à jour régulière** : Mettez à jour les règles quand l'architecture évolue
- **Références** : Les règles pointent vers la documentation complémentaire

## 📖 Références

- [Documentation Cursor Rules](https://cursor.com/fr/docs/context/rules)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [PlatformIO Documentation](https://docs.platformio.org/)
