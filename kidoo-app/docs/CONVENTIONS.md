# Conventions de code - Kidoo App

## Structure des fichiers

### Naming

- **Composants** : PascalCase (`Button.tsx`, `KidooCard.tsx`)
- **Hooks** : camelCase avec préfixe `use` (`useAuth.ts`, `useKidoos.ts`)
- **Utils** : camelCase (`storage.ts`, `validation.ts`)
- **Types** : PascalCase pour les types, camelCase pour les variables

### Organisation des screens

Chaque écran a son propre dossier :

```
screens/
└── auth/
    └── LoginScreen/
        ├── index.ts           # Export
        ├── LoginScreen.tsx    # Composant principal
        ├── LoginForm.tsx      # Sous-composant
        └── components/        # Composants spécifiques à l'écran
```

## Composants

### Structure d'un composant

```tsx
/**
 * Description du composant
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';

// Props interface en haut
interface ButtonProps {
  title: string;
  onPress: () => void;
}

// Export nommé (pas de default export)
export function Button({ title, onPress }: ButtonProps) {
  return (
    <View style={styles.container}>
      {/* ... */}
    </View>
  );
}

// Styles en bas
const styles = StyleSheet.create({
  container: {},
});
```

### Règles

- Utiliser des **exports nommés** (pas de `export default`)
- Les **styles** vont dans `StyleSheet.create()` en bas du fichier
- Utiliser **useTheme()** pour les couleurs/spacing dynamiques
- Décomposer les composants quand ils dépassent ~150 lignes

## Hooks

### Structure

```tsx
export function useKidoos() {
  // Hooks en premier
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  // State
  const [state, setState] = useState();

  // Effects
  useEffect(() => {}, []);

  // Handlers
  const handleClick = () => {};

  // Return
  return { data, isLoading };
}
```

## React Query

### Queries

```tsx
export function useKidoos() {
  return useQuery({
    queryKey: ['kidoos'],
    queryFn: kidoosApi.getAll,
  });
}
```

### Mutations avec Optimistic Update

```tsx
export function useUpdateKidoo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => kidoosApi.update(id, data),
    
    // Optimistic update
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['kidoos'] });
      const previous = queryClient.getQueryData(['kidoos']);
      
      queryClient.setQueryData(['kidoos'], (old) =>
        old?.map((k) => (k.id === id ? { ...k, ...data } : k))
      );
      
      return { previous };
    },
    
    // Rollback
    onError: (err, variables, context) => {
      queryClient.setQueryData(['kidoos'], context?.previous);
      showToast.error({ title: 'Erreur' });
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['kidoos'] });
    },
  });
}
```

## i18n

### Ajouter une traduction

1. Ajouter la clé dans `src/i18n/fr.json` et `src/i18n/en.json`
2. Utiliser avec `t('ma.cle')`

### Interpolation

```json
{
  "welcome": "Bonjour {{name}} !"
}
```

```tsx
t('welcome', { name: 'John' })
```

## Git

### Branches

- `main` : Production
- `develop` : Développement
- `feature/xxx` : Nouvelles features
- `fix/xxx` : Bug fixes

### Commits

Format : `type(scope): description`

Types :
- `feat` : Nouvelle feature
- `fix` : Bug fix
- `refactor` : Refactoring
- `style` : Formatting
- `docs` : Documentation
- `chore` : Maintenance

Exemples :
- `feat(auth): add biometric login`
- `fix(kidoos): fix offline sync`
- `refactor(theme): simplify color system`

## Tests

TODO: Ajouter les conventions de tests

## Ressources

- [React Native](https://reactnative.dev/)
- [Expo](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Query](https://tanstack.com/query/latest)
