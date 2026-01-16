# Architecture de stockage des configurations Kidoo

## Vue d'ensemble

Cette architecture permet de stocker les configurations des Kidoos dans la base de données, avec une structure qui sépare :
- **Configuration commune** : Données partagées par tous les modèles (déjà dans la table `Kidoo`)
- **Configuration spécifique** : Données uniques à chaque modèle (dans des tables dédiées)

## Structure proposée

### 1. Table principale `Kidoo` (existant)
Contient les informations communes à tous les modèles :
- `id`, `name`, `model`, `deviceId`, `macAddress`
- `firmwareVersion`, `lastConnected`, `isConnected`
- `wifiSSID` (lecture seule, pour affichage uniquement - modification via Bluetooth uniquement)
- `userId`, `isSynced`, `createdAt`, `updatedAt`

**Note importante** : Les informations WiFi (SSID et mot de passe) ne sont **PAS stockées** dans la base de données. Elles restent uniquement sur le device ESP32 et sont modifiables uniquement via Bluetooth. Le champ `wifiSSID` dans la table `Kidoo` est uniquement informatif (pour affichage).

### 2. Tables de configuration par modèle

#### `KidooConfigBasic`
Configuration spécifique au modèle **Basic** :
- `kidooId` (FK vers Kidoo, relation 1:1)
- `brightness` (10-100)
- `sleepTimeout` (5000-300000 ms)
- **Données de stockage** (dernières valeurs reçues de l'ESP32) :
  - `storageTotalBytes` (BigInt, nullable) - Espace total en bytes
  - `storageFreeBytes` (BigInt, nullable) - Espace libre en bytes
  - `storageUsedBytes` (BigInt, nullable) - Espace utilisé en bytes
  - `storageFreePercent` (Int, nullable) - Pourcentage d'espace libre (0-100)
  - `storageUsedPercent` (Int, nullable) - Pourcentage d'espace utilisé (0-100)
  - `storageLastUpdated` (DateTime, nullable) - Date de dernière mise à jour
- `updatedAt`

**Notes** :
- Les configurations WiFi ne sont pas stockées ici. Elles restent sur le device et sont modifiables uniquement via Bluetooth.
- `sleepTransitionMs` est géré nativement par l'ESP32 et n'est pas stocké en base de données.
- Les configurations LED (couleur RGB et effet) ne sont pas stockées ici. Elles sont envoyées uniquement via Bluetooth en temps réel et ne nécessitent pas de persistance.
- Les données de stockage sont mises à jour à chaque réception de la commande `GET_STORAGE` depuis l'ESP32.

#### `KidooConfigClassic` (exemple futur)
Configuration spécifique au modèle **Classic** :
- `kidooId` (FK vers Kidoo, relation 1:1)
- `brightness`
- `sleepTimeout`
- `volume` (exemple : spécifique au Classic)
- `updatedAt`

## Avantages de cette approche

✅ **Type-safe** : Chaque modèle a ses propres champs typés
✅ **Validation DB** : Contraintes au niveau base de données
✅ **Performance** : Requêtes simples, pas de parsing JSON
✅ **Extensibilité** : Facile d'ajouter de nouveaux modèles
✅ **Clarté** : Structure explicite et documentée

## Inconvénients

⚠️ **Migrations** : Nécessite une migration Prisma pour chaque nouveau modèle
⚠️ **Duplication** : Certains champs peuvent être communs entre modèles

## Alternative : Approche JSON (plus flexible)

Si vous préférez une approche plus flexible, on peut utiliser une seule table `KidooConfig` avec un champ JSON :

```prisma
model KidooConfig {
  id        String   @id @default(uuid())
  kidooId   String   @unique
  model     String   // Pour savoir quel schéma appliquer
  config    Json     // Configuration spécifique au modèle (JSON)
  updatedAt DateTime @updatedAt
  
  kidoo     Kidoo    @relation(fields: [kidooId], references: [id], onDelete: Cascade)
}
```

**Avantages** :
- Pas de migration pour nouveaux modèles
- Très flexible

**Inconvénients** :
- Pas de validation au niveau DB
- Requêtes JSON plus complexes
- Moins type-safe

## Recommandation

**Utiliser l'approche hybride (tables par modèle)** car :
1. Vous avez déjà une structure claire avec des modèles distincts
2. La validation au niveau DB est importante pour la cohérence
3. Les requêtes seront plus simples et performantes
4. TypeScript bénéficiera du typage strict

## Migration

1. Créer les tables de configuration pour chaque modèle existant
2. Migrer les données depuis la carte SD (si nécessaire) - **sans les informations WiFi**
3. Mettre à jour les APIs pour lire/écrire dans la DB
4. Synchroniser avec l'ESP32 lors de la connexion Bluetooth
5. Les configurations WiFi restent uniquement sur le device et sont modifiables via Bluetooth

## Configuration WiFi

⚠️ **Important** : Les informations WiFi (SSID et mot de passe) ne sont **jamais stockées** dans la base de données. Elles restent uniquement sur le device ESP32 et sont modifiables uniquement via Bluetooth. 

Le champ `wifiSSID` dans la table `Kidoo` est uniquement informatif (pour affichage dans l'interface utilisateur), mais ne doit pas être utilisé pour modifier la configuration WiFi du device.
