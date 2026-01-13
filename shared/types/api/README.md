# Types API - Organisation par fonctionnalité

Ce répertoire contient tous les types TypeScript pour les réponses API, organisés par fonctionnalité.

## Structure

```
api/
├── common.ts       # Types communs à toutes les fonctionnalités
├── auth.ts         # Types pour l'authentification
├── index.ts        # Point d'entrée principal (exports tous les types)
└── README.md       # Ce fichier
```

## Organisation

### `common.ts` - Types communs

Types réutilisables par toutes les fonctionnalités :

- `ApiError` - Format d'erreur standard
- `ApiSuccess<T>` - Format de succès standard avec données génériques
- `ApiResponse<T>` - Union type pour les réponses (succès ou erreur)

### `auth.ts` - Authentification

Types spécifiques à l'authentification :

- `RegisterResponse` - Réponse d'inscription réussie
- `RegisterError` - Erreur d'inscription
- `LoginResponse` - Réponse de connexion réussie
- `LoginError` - Erreur de connexion
- `CheckEmailResponse` - Réponse de vérification d'email
- `SessionUser` - Informations utilisateur de session

## Ajouter une nouvelle fonctionnalité

Pour ajouter les types d'une nouvelle fonctionnalité (ex: `kidoo`, `user`, etc.) :

1. Créez un nouveau fichier `shared/types/api/[fonctionnalite].ts`
2. Définissez les types spécifiques à cette fonctionnalité
3. Exportez-les depuis `shared/types/api/index.ts`

**Exemple :**

```typescript
// shared/types/api/kidoo.ts
import type { ApiError } from './common';

export interface KidooResponse {
  success: true;
  kidoo: {
    id: string;
    name: string;
    // ...
  };
}

export interface KidooError extends ApiError {
  field?: 'name' | 'deviceId' | 'macAddress';
}

// shared/types/api/index.ts
export * from './kidoo';
```

## Utilisation

### Depuis kidoo-app ou kidoo-server

```typescript
// Import depuis l'index principal (recommandé)
import type { LoginResponse, RegisterResponse, ApiError } from '@/shared';

// Ou depuis un fichier spécifique
import type { LoginResponse, LoginError } from '@/shared/types/api/auth';
import type { ApiError } from '@/shared/types/api/common';
```

## Avantages de cette organisation

✅ **Modularité** : Chaque fonctionnalité a ses propres types  
✅ **Maintenabilité** : Facile de trouver et modifier les types d'une fonctionnalité  
✅ **Extensibilité** : Simple d'ajouter de nouvelles fonctionnalités  
✅ **Réutilisabilité** : Types communs partagés via `common.ts`  
✅ **Clarté** : Structure claire et organisée
