---
description: "Règles pour les schémas et types partagés entre kidoo-app et kidoo-server. JAMAIS de duplication, utiliser les schémas Zod partagés, et importer via @/types/shared."
alwaysApply: false
globs:
  - shared/**/*
  - kidoo-app/types/shared.ts
  - kidoo-app/app/**/*.tsx
  - kidoo-app/components/**/*.tsx
  - kidoo-app/services/**/*.ts
---

# Règles du Module Shared

## Architecture

Le dossier `shared/` contient les schémas et types partagés entre `kidoo-app` et `kidoo-server` :

```
shared/
├── schemas/          # Schémas Zod de validation
│   ├── auth.ts
│   └── kidoo.ts
├── types/            # Types TypeScript
│   ├── api/          # Types de réponses API
│   ├── kidoo.ts
│   └── user.ts
└── index.ts          # Export centralisé
```

## Utilisation dans kidoo-app

### Import depuis shared

```tsx
// ✅ CORRECT - Utiliser le wrapper
import { loginSchema, registerSchema } from '@/types/shared';
import type { Kidoo, CreateKidooInput } from '@/types/shared';

// Le fichier types/shared.ts réexporte depuis ../../shared
```

### Schémas de validation

```tsx
import { loginSchema, registerSchema } from '@/types/shared';

// Validation
const result = loginSchema.safeParse(formData);
if (!result.success) {
  // Gérer les erreurs
  result.error.issues.forEach((issue) => {
    console.error(issue.path, issue.message);
  });
}
```

### Types API

```tsx
import type { 
  GetKidoosResponse, 
  CreateKidooResponse,
  CreateKidooError 
} from '@/types/shared';
```

## Structure des schémas

### Schémas Zod

```typescript
// shared/schemas/auth.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

export type LoginInput = z.infer<typeof loginSchema>;
```

### Types API

```typescript
// shared/types/api/kidoo.ts
export interface GetKidoosResponse extends ApiSuccess<Kidoo[]> {
  data: Kidoo[];
}

export interface CreateKidooResponse extends ApiSuccess<Kidoo> {
  data: Kidoo;
}

export interface CreateKidooError extends ApiError {
  field?: 'name' | 'deviceId' | 'macAddress';
}
```

## Règles strictes

1. **JAMAIS de duplication** - Les schémas/types sont dans `shared/`
2. **Utiliser les schémas Zod** - Pour la validation côté client et serveur
3. **Types cohérents** - Les types API doivent correspondre aux réponses serveur
4. **Import via wrapper** - Utiliser `@/types/shared` dans kidoo-app
5. **Exports centralisés** - Tout exporter via `shared/index.ts`

## Ajouter un nouveau schéma/type

1. **Créer dans shared/** - `shared/schemas/monSchema.ts` ou `shared/types/monType.ts`
2. **Exporter dans index.ts** - Ajouter l'export dans `shared/index.ts`
3. **Utiliser dans les deux projets** - kidoo-app et kidoo-server

## Validation

Les schémas Zod sont utilisés pour :
- **Validation côté client** - Dans les formulaires
- **Validation côté serveur** - Dans les routes API

**Règle** : Un seul schéma pour les deux, pas de duplication.
