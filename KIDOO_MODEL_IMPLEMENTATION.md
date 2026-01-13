# Implémentation du modèle de Kidoo

## Résumé des modifications

Ajout du champ `model` pour identifier le modèle de Kidoo (classic, mini, pro, etc.) dans tout le système.

## Modifications effectuées

### 1. ESP32 (Firmware)
- ✅ **`esp32/src/config/config.h`** : Ajout de la constante `KIDOO_MODEL` définie à `"classic"` par défaut
- ✅ **`esp32/src/managers/ble_manager.cpp`** : 
  - Inclusion de `config.h`
  - Ajout du champ `model` dans les réponses BLE (`WIFI_OK` et `VERSION`)

### 2. Base de données (Prisma)
- ✅ **`kidoo-server/prisma/schema.prisma`** : 
  - Ajout du champ `model String @default("classic")` dans le modèle `Kidoo`
  - Ajout d'un index sur `model` pour les requêtes

### 3. Types partagés
- ✅ **`shared/types/kidoo.ts`** : Ajout du champ `model: string` dans l'interface `Kidoo`
- ✅ **`shared/schemas/kidoo.ts`** : Ajout du champ `model` dans `createKidooInputSchema` avec valeur par défaut `'classic'`

### 4. Application mobile (kidoo-app)
- ✅ **`kidoo-app/types/bluetooth.ts`** : Ajout du champ `model?: string` dans `BluetoothResponse`
- ✅ **`kidoo-app/services/kidooService.ts`** : Ajout du champ `model` dans l'interface `Kidoo`
- ✅ **`kidoo-app/screens/kidoo/kidoo-setup-modal/index.tsx`** :
  - Ajout de l'état `kidooModel` pour stocker le modèle récupéré
  - Passage du modèle lors de la création du Kidoo
- ✅ **`kidoo-app/screens/kidoo/kidoo-setup-modal/components/finalization-step.tsx`** :
  - Ajout de la prop `onModelChange` pour recevoir le modèle depuis la réponse BLE
  - Extraction du champ `model` depuis la réponse Bluetooth

### 5. Serveur (kidoo-server)
- ✅ **`kidoo-server/app/api/kidoos/route.ts`** :
  - Extraction du champ `model` depuis les données validées
  - Utilisation du modèle fourni ou `'classic'` par défaut lors de la création

## Migration de la base de données

Pour appliquer les changements à la base de données existante, exécutez :

```bash
cd kidoo-server
npx prisma migrate dev --name add_kidoo_model
```

Ou pour créer une migration sans l'appliquer :

```bash
npx prisma migrate dev --create-only --name add_kidoo_model
```

## Utilisation

### Changer le modèle dans l'ESP32

Pour un nouveau modèle de Kidoo, modifiez simplement la constante dans `esp32/src/config/config.h` :

```cpp
#define KIDOO_MODEL "mini"  // ou "pro", "classic", etc.
```

Le modèle sera automatiquement :
1. Envoyé via Bluetooth lors du setup
2. Récupéré par l'application mobile
3. Sauvegardé dans la base de données
4. Disponible dans toute l'application

### Valeurs par défaut

- **ESP32** : `"classic"` (défini dans `config.h`)
- **Base de données** : `"classic"` (défini dans le schéma Prisma)
- **Schéma Zod** : `"classic"` (valeur par défaut)

## Prochaines étapes

1. **Migrer la base de données** avec Prisma
2. **Rebuild le firmware ESP32** avec le nouveau modèle
3. **Tester le setup** pour vérifier que le modèle est bien récupéré et sauvegardé
