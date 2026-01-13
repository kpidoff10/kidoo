---
description: "Structure et conventions du projet kidoo-app. Organisation des fichiers, conventions de nommage, imports avec path aliases, et bonnes pratiques d'organisation."
alwaysApply: true
globs:
  - kidoo-app/**/*
---

# Structure du Projet kidoo-app

## Organisation générale

```
kidoo-app/
├── app/                 # Routes Expo Router (file-based routing)
│   ├── _layout.tsx      # Layout racine avec protection auth
│   ├── (auth)/          # Routes d'authentification
│   └── (tabs)/          # Routes des tabs (protégées)
├── components/          # Composants UI génériques et réutilisables
│   └── ui/              # Composants UI génériques (Button, AlertMessage, etc.)
├── screens/              # Interfaces/écrans avec logique métier
│   ├── auth/            # Interfaces d'authentification
│   └── kidoo/           # Interfaces liées aux Kidoos
├── contexts/            # React Contexts
│   ├── AuthContext.tsx
│   └── NavigationContext.tsx
├── hooks/               # Hooks personnalisés
│   ├── use-theme.ts
│   ├── use-auth.ts
│   └── use-bluetooth-scan.ts
├── services/            # Services API
│   ├── api.ts
│   └── authService.ts
├── theme/               # Système de thème centralisé
│   ├── colors.ts
│   ├── spacing.ts
│   ├── typography.ts
│   └── components.ts
├── i18n/                # Internationalisation
│   ├── config.ts
│   └── locales/
├── types/               # Types TypeScript
│   └── shared.ts        # Wrapper pour types partagés
└── config/              # Configuration
    └── api.ts
```

## Conventions de nommage

### Fichiers
- **Composants** : `PascalCase.tsx` (ex: `AuthButton.tsx`)
- **Hooks** : `use-kebab-case.ts` (ex: `use-theme.ts`)
- **Services** : `camelCase.ts` (ex: `authService.ts`)
- **Types** : `camelCase.ts` (ex: `shared.ts`)

### Composants
- **Noms** : `PascalCase` (ex: `AuthButton`, `KidooCard`)
- **Props interfaces** : `ComponentNameProps` (ex: `AuthButtonProps`)

### Hooks
- **Noms** : `use*` (ex: `useTheme`, `useAuth`)
- **Fichiers** : `use-kebab-case.ts`

## Imports

### Path aliases

```tsx
// ✅ CORRECT - Utiliser les aliases
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import { BluetoothScanModal } from '@/screens/kidoo';
import type { Kidoo } from '@/types/shared';

// ❌ INTERDIT - Imports relatifs
import { useTheme } from '../../hooks/use-theme';
```

### Ordre des imports

1. React et React Native
2. Bibliothèques externes
3. Imports internes (composants, hooks, services)
4. Types

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import type { Kidoo } from '@/types/shared';
```

## Exports

### Interfaces groupées

Pour les interfaces dans un dossier (ex: `screens/kidoo/`), créer un `index.ts` :

```tsx
// screens/kidoo/index.ts
export * from './kidoo-card';
export * from './kidoo-list';
export * from './floating-action-button';
export * from './bluetooth-scan-modal';
```

Puis importer :

```tsx
import { KidooCard, KidooList } from '@/screens/kidoo';
```

## Documentation

### JSDoc pour les composants

```tsx
/**
 * Composant Button générique et réutilisable
 * Utilise les styles du thème centralisé
 * 
 * @example
 * <Button
 *   label="Connexion"
 *   variant="primary"
 *   onPress={handlePress}
 * />
 */
export function Button({ ... }: ButtonProps) {
  // ...
}
```

## Règles strictes

1. **Respecter la structure** - Ne pas créer de fichiers à la racine
2. **Utiliser les path aliases** - `@/` au lieu de `../../`
3. **Grouper les exports** - Créer des `index.ts` pour les dossiers
4. **Documenter les composants complexes** - JSDoc pour les composants non triviaux
5. **Organiser par domaine** - Composants groupés par fonctionnalité
