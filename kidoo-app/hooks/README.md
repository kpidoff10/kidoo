# Hooks personnalisés

Ce répertoire contient les hooks personnalisés basés sur TanStack Query pour gérer les requêtes API.

## Hooks disponibles

### `useAuth.ts`

Hooks pour l'authentification :

#### `useRegister()`

Hook pour l'inscription d'un nouvel utilisateur.

**Exemple d'utilisation :**

```typescript
'use client';

import { useRegister } from '@/hooks/useAuth';
import { useState } from 'react';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const register = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    register.mutate(
      { email, password, name },
      {
        onSuccess: (data) => {
          console.log('Compte créé:', data.user);
          // Rediriger vers la page de connexion
          router.push('/auth/signin');
        },
        onError: (error) => {
          console.error('Erreur:', error.error);
          if (error.field) {
            // Afficher l'erreur sur le champ spécifique
            console.error('Champ:', error.field);
          }
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
        required
        minLength={8}
      />
      {register.error && (
        <p style={{ color: 'red' }}>{register.error.error}</p>
      )}
      <button type="submit" disabled={register.isPending}>
        {register.isPending ? 'Création...' : 'Créer un compte'}
      </button>
    </form>
  );
}
```

**États disponibles :**
- `isPending` : true pendant la mutation
- `isSuccess` : true si la mutation a réussi
- `isError` : true si la mutation a échoué
- `error` : objet d'erreur avec `error` et `field` optionnel
- `data` : réponse de succès
- `mutate(data, options?)` : fonction pour déclencher la mutation

#### `useCheckEmail(email, enabled?)`

Hook pour vérifier si un email est disponible.

**Exemple d'utilisation :**

```typescript
'use client';

import { useCheckEmail } from '@/hooks/useAuth';
import { useState } from 'react';

export default function EmailInput() {
  const [email, setEmail] = useState('');
  const [showCheck, setShowCheck] = useState(false);

  // Vérifier l'email uniquement si showCheck est true
  const { data, isLoading, error } = useCheckEmail(email, showCheck);

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setShowCheck(false);
        }}
        onBlur={() => {
          if (email.includes('@')) {
            setShowCheck(true);
          }
        }}
        placeholder="Email"
      />
      {isLoading && <p>Vérification...</p>}
      {data && (
        <p style={{ color: data.available ? 'green' : 'red' }}>
          {data.message}
        </p>
      )}
      {error && <p style={{ color: 'red' }}>Erreur: {error.message}</p>}
    </div>
  );
}
```

**Paramètres :**
- `email` : string — Email à vérifier
- `enabled` : boolean — Active/désactive la requête (défaut: false)

**États disponibles :**
- `data` : `CheckEmailResponse` avec `available` et `message`
- `isLoading` : true pendant la requête
- `isError` : true si la requête a échoué
- `error` : objet d'erreur

## Ajouter un nouveau hook

1. Créez le service correspondant dans `services/` (ex: `kidooService.ts`)
2. Créez un nouveau fichier dans `hooks/` (ex: `useKidoos.ts`)
3. Définissez les query keys de manière hiérarchique
4. Exportez les hooks personnalisés

**Exemple :**

```typescript
// hooks/useKidoos.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getKidoos, createKidoo, type Kidoo, type CreateKidooInput } from '@/services/kidooService';

// Query keys hiérarchiques
export const kidooKeys = {
  all: ['kidoos'] as const,
  lists: () => [...kidooKeys.all, 'list'] as const,
  list: (filters?: string) => [...kidooKeys.lists(), { filters }] as const,
  details: () => [...kidooKeys.all, 'detail'] as const,
  detail: (id: string) => [...kidooKeys.details(), id] as const,
};

// Hook pour récupérer tous les Kidoos
export function useKidoos() {
  return useQuery<Kidoo[]>({
    queryKey: kidooKeys.lists(),
    queryFn: getKidoos,
  });
}

// Hook pour créer un Kidoo
export function useCreateKidoo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createKidoo,
    onSuccess: () => {
      // Invalider la liste pour re-fetch
      queryClient.invalidateQueries({ queryKey: kidooKeys.lists() });
    },
  });
}
```

## Query Keys

Utilisez une structure hiérarchique pour les query keys pour faciliter l'invalidation :

```typescript
const resourceKeys = {
  all: ['resource'] as const,
  lists: () => [...resourceKeys.all, 'list'] as const,
  list: (filters?: string) => [...resourceKeys.lists(), { filters }] as const,
  details: () => [...resourceKeys.all, 'detail'] as const,
  detail: (id: string) => [...resourceKeys.details(), id] as const,
};
```

Cela permet d'invalider facilement :
- Toutes les queries : `queryClient.invalidateQueries({ queryKey: resourceKeys.all })`
- Toutes les listes : `queryClient.invalidateQueries({ queryKey: resourceKeys.lists() })`
- Une liste spécifique : `queryClient.invalidateQueries({ queryKey: resourceKeys.list(filters) })`
- Un détail spécifique : `queryClient.invalidateQueries({ queryKey: resourceKeys.detail(id) })`
