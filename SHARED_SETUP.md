# Configuration du dossier `shared` - Schémas et Types Partagés

Le dossier `shared/` contient tous les schémas Zod et types TypeScript partagés entre `kidoo-app` (Expo/React Native) et `kidoo-server` (Next.js). Cela évite la duplication et assure une cohérence totale entre le client et le serveur.

## Structure

```
Kidoo/
├── shared/                    # Dossier partagé
│   ├── schemas/              # Schémas de validation Zod
│   │   └── auth.ts           # Schémas d'authentification
│   ├── types/                # Types TypeScript
│   │   ├── api.ts            # Types pour les réponses API
│   │   ├── kidoo.ts          # Types pour les Kidoos
│   │   └── user.ts           # Types pour les utilisateurs
│   ├── index.ts              # Point d'entrée principal
│   ├── package.json          # Configuration du package
│   └── tsconfig.json         # Configuration TypeScript
├── kidoo-app/                # Application Expo
├── kidoo-server/             # Backend Next.js
└── SHARED_SETUP.md           # Ce fichier
```

## Configuration

### TypeScript (`tsconfig.json`)

Les deux projets ont été configurés pour accéder au dossier `shared` via des paths :

**kidoo-server/tsconfig.json :**
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

**kidoo-app/tsconfig.json :**
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

### Expo/Metro (`babel.config.js` et `metro.config.js`)

Pour Expo, `babel-plugin-module-resolver` a été configuré pour que Metro bundler puisse résoudre les imports `@/shared` :

**kidoo-app/babel.config.js :**
```javascript
plugins: [
  [
    'module-resolver',
    {
      root: ['./'],
      alias: {
        '@': './',
        '@/shared': '../shared',
      },
    },
  ],
  'react-native-reanimated/plugin', // Doit être en dernier
],
```

**kidoo-app/metro.config.js :**
```javascript
config.watchFolders = [
  path.resolve(__dirname, '.'),
  path.resolve(__dirname, '../shared'),
];
```

## Utilisation

### Dans kidoo-server (Next.js)

```typescript
// Import depuis l'index
import { registerSchema, RegisterInput, RegisterResponse } from '@/shared';

// Ou depuis un fichier spécifique
import { registerSchema } from '@/shared/schemas/auth';
import type { RegisterResponse } from '@/shared/types/api';
```

### Dans kidoo-app (Expo)

```typescript
// Import depuis l'index
import type { RegisterInput, RegisterResponse } from '@/shared';

// Ou depuis un fichier spécifique
import { registerSchema } from '@/shared/schemas/auth';
import type { RegisterResponse } from '@/shared/types/api';
```

## Contenu partagé

### Schémas Zod (`shared/schemas/`)

- `auth.ts` — Schémas d'authentification (register, login, email, updateProfile)

### Types TypeScript (`shared/types/`)

- `api.ts` — Types pour les réponses API (ApiError, ApiSuccess, RegisterResponse, etc.)
- `kidoo.ts` — Types pour les Kidoos (Kidoo, CreateKidooInput, LEDSettings, etc.)
- `user.ts` — Types pour les utilisateurs (User, UserProfile)

## Avantages

✅ **Pas de duplication** : Un seul endroit pour définir les schémas et types  
✅ **Cohérence** : Même validation côté client et serveur  
✅ **Type-safety** : Types TypeScript garantissent la cohérence  
✅ **Maintenabilité** : Modifier en un seul endroit  
✅ **Réutilisabilité** : Facilement réutilisable dans d'autres projets futurs

## Installation

Les dépendances du dossier `shared` doivent être installées séparément :

```bash
cd shared
npm install
```

**Note :** Actuellement, seule `zod` est requise comme dépendance.
