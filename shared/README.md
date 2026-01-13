# Shared - Schémas et Types Partagés

Ce répertoire contient les schémas Zod et types TypeScript partagés entre `kidoo-app` (Expo/React Native) et `kidoo-server` (Next.js).

## Structure

```
shared/
├── schemas/          # Schémas de validation Zod
│   └── auth.ts       # Schémas d'authentification
├── types/            # Types TypeScript
│   ├── api/          # Types API organisés par fonctionnalité
│   │   ├── common.ts # Types communs (ApiError, ApiSuccess, etc.)
│   │   ├── auth.ts   # Types pour l'authentification
│   │   ├── index.ts  # Point d'entrée des types API
│   │   └── README.md # Documentation des types API
│   ├── kidoo.ts      # Types pour les Kidoos
│   └── user.ts       # Types pour les utilisateurs
├── index.ts          # Point d'entrée principal
├── package.json      # Configuration du package
├── tsconfig.json     # Configuration TypeScript
└── README.md         # Ce fichier
```

## Installation

Les dépendances du dossier `shared` doivent être installées séparément :

```bash
cd shared
npm install
```

**Note :** Actuellement, seule `zod` est requise comme dépendance.

## Utilisation

### Dans kidoo-server (Next.js)

```typescript
import { registerSchema, RegisterInput, RegisterResponse } from '@/shared';
// ou depuis un fichier spécifique
import { registerSchema } from '@/shared/schemas/auth';
```

### Dans kidoo-app (Expo)

```typescript
import { registerSchema, RegisterInput, RegisterResponse } from '@/shared/index';
// ou depuis un fichier spécifique
import { registerSchema } from '@/shared/schemas/auth';
```

## Configuration

Les deux projets ont été configurés pour accéder à ce dossier via des paths TypeScript dans leurs `tsconfig.json` :

### kidoo-server/tsconfig.json

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@/shared": ["../shared"],
      "@/shared/*": ["../shared/*"]
    }
  }
}
```

### kidoo-app/tsconfig.json

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@/shared": ["../shared"],
      "@/shared/*": ["../shared/*"]
    }
  }
}
```

**Note pour Expo :** Un fichier `babel.config.js` a été configuré avec `babel-plugin-module-resolver` pour que Metro bundler puisse résoudre les imports `@/shared`.

## Schémas disponibles

### Authentification (`schemas/auth.ts`)

- **`registerSchema`** — Schéma pour l'inscription
  - Type : `RegisterInput`
  
- **`loginSchema`** — Schéma pour la connexion
  - Type : `LoginInput`
  
- **`emailSchema`** — Schéma pour la validation d'email
  - Type : `EmailInput` (string)
  
- **`updateProfileSchema`** — Schéma pour la mise à jour du profil
  - Type : `UpdateProfileInput`

## Types disponibles

### API (`types/api/`)

Les types API sont organisés par fonctionnalité dans `types/api/` :

#### Types communs (`types/api/common.ts`)

- `ApiError` — Erreur API standard
- `ApiSuccess<T>` — Succès API standard
- `ApiResponse<T>` — Réponse API générique (union type)

#### Authentification (`types/api/auth.ts`)

- `RegisterResponse` — Réponse d'inscription réussie
- `RegisterError` — Erreur d'inscription
- `LoginResponse` — Réponse de connexion réussie
- `LoginError` — Erreur de connexion
- `CheckEmailResponse` — Réponse de vérification d'email
- `SessionUser` — Informations utilisateur de session

Voir `types/api/README.md` pour plus de détails sur l'organisation des types API.

### Kidoo (`types/kidoo.ts`)

- `Kidoo` — Type pour un appareil Kidoo
- `CreateKidooInput` — Input pour créer un Kidoo
- `UpdateKidooInput` — Input pour mettre à jour un Kidoo
- `LEDColor` — Type pour une couleur LED
- `LEDSettings` — Type pour les paramètres LED

### User (`types/user.ts`)

- `User` — Type utilisateur (compatible serveur)
- `UserProfile` — Type profil utilisateur (compatible mobile)

## Ajouter un nouveau schéma/type

### Ajouter un schéma

1. Créez le fichier dans `schemas/` (ex: `schemas/kidoo.ts`)
2. Exportez-le depuis le fichier
3. Exportez-le depuis `schemas/index.ts` (si créé) ou directement depuis `shared/index.ts`

**Exemple :**

```typescript
// shared/schemas/kidoo.ts
import { z } from 'zod';

export const createKidooSchema = z.object({
  name: z.string().min(1).max(100),
  deviceId: z.string().uuid(),
});

export type CreateKidooInput = z.infer<typeof createKidooSchema>;

// shared/index.ts
export * from './schemas/kidoo';
```

### Ajouter des types API pour une nouvelle fonctionnalité

1. Créez un nouveau fichier dans `types/api/` (ex: `types/api/kidoo.ts`)
2. Définissez les types spécifiques à cette fonctionnalité
3. Exportez-les depuis `types/api/index.ts`

**Exemple :**

```typescript
// shared/types/api/kidoo.ts
import type { ApiError } from './common';

export interface KidooResponse {
  success: true;
  message: string;
  kidoo: {
    id: string;
    name: string;
    deviceId: string;
    // ...
  };
}

export interface KidooError extends ApiError {
  field?: 'name' | 'deviceId' | 'macAddress';
}

// shared/types/api/index.ts
export * from './kidoo';
```

Les types seront automatiquement disponibles via `import type { KidooResponse } from '@/shared';`

## Avantages

- ✅ **Pas de duplication** : Un seul endroit pour les schémas et types
- ✅ **Cohérence** : Même validation côté client et serveur
- ✅ **Type-safety** : Types TypeScript partagés garantissent la cohérence
- ✅ **Maintenabilité** : Modifier en un seul endroit
- ✅ **Réutilisabilité** : Facilement réutilisable dans d'autres projets futurs

## Migration

### Depuis kidoo-server/schemas

Les anciens schémas dans `kidoo-server/schemas/` ont été migrés vers `shared/schemas/`. Mettez à jour vos imports :

**Avant :**
```typescript
import { registerSchema } from '@/schemas/auth';
```

**Après :**
```typescript
import { registerSchema } from '@/shared/schemas/auth';
// ou
import { registerSchema } from '@/shared';
```

### Depuis kidoo-app

Les types dans `kidoo-app/services/authService.ts` ont été remplacés par les types partagés :

**Avant :**
```typescript
export interface RegisterInput { ... }
```

**Après :**
```typescript
import type { RegisterInput } from '@/shared/index';
```
