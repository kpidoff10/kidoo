# TanStack Query (React Query)

TanStack Query est configuré pour gérer toutes les requêtes API dans l'application.

## Configuration

Le `QueryProvider` est configuré avec les options suivantes :

### Queries (GET)
- **staleTime**: 5 minutes — Temps avant que les données soient considérées comme périmées
- **gcTime**: 30 minutes — Temps de garde en cache après inutilisation
- **refetchOnWindowFocus**: false — Ne pas re-fetch quand la fenêtre reprend le focus
- **refetchOnMount**: true — Re-fetch au montage du composant
- **refetchOnReconnect**: false — Ne pas re-fetch quand on reconnecte au réseau
- **retry**: 2 — Nombre de tentatives en cas d'erreur
- **retryDelay**: Exponential backoff (max 30s)

### Mutations (POST, PUT, DELETE)
- **retry**: 1 — Nombre de tentatives en cas d'erreur

## Utilisation

### Utiliser un hook personnalisé

```typescript
import { useRegister } from '@/hooks/useAuth';

function RegisterForm() {
  const { mutate, isPending, error } = useRegister();

  const handleSubmit = (data: RegisterInput) => {
    mutate(data, {
      onSuccess: (response) => {
        console.log('Compte créé:', response.user);
      },
      onError: (error) => {
        console.error('Erreur:', error.error);
      },
    });
  };

  return (
    // ... votre formulaire
  );
}
```

### Utiliser useQuery directement

```typescript
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/services/api';

function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => apiGet(`/api/users/${userId}`),
  });

  if (isLoading) return <Text>Chargement...</Text>;
  if (error) return <Text>Erreur: {error.message}</Text>;

  return <Text>{data.name}</Text>;
}
```

### Utiliser useMutation directement

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiPost } from '@/services/api';

function CreateKidoo() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: KidooInput) => apiPost('/api/kidoos', data),
    onSuccess: () => {
      // Invalider et re-fetch la liste des Kidoos
      queryClient.invalidateQueries({ queryKey: ['kidoos'] });
    },
  });

  return (
    <Button
      onPress={() => mutation.mutate({ name: 'Mon Kidoo' })}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? 'Création...' : 'Créer'}
    </Button>
  );
}
```

## Query Keys

Les query keys doivent être organisées de manière hiérarchique :

```typescript
// Pattern recommandé
const queryKeys = {
  all: ['resource'] as const,
  lists: () => [...queryKeys.all, 'list'] as const,
  list: (filters: string) => [...queryKeys.lists(), { filters }] as const,
  details: () => [...queryKeys.all, 'detail'] as const,
  detail: (id: number) => [...queryKeys.details(), id] as const,
};
```

Exemple d'utilisation :
```typescript
// Invalider toutes les queries kidoos
queryClient.invalidateQueries({ queryKey: ['kidoos'] });

// Invalider seulement la liste
queryClient.invalidateQueries({ queryKey: ['kidoos', 'list'] });

// Invalider un détail spécifique
queryClient.invalidateQueries({ queryKey: ['kidoos', 'detail', id] });
```

## Services API

Toutes les requêtes API passent par le service `api.ts` qui fournit :
- `apiGet<T>(endpoint, options?)`
- `apiPost<T>(endpoint, data, options?)`
- `apiPut<T>(endpoint, data, options?)`
- `apiDelete<T>(endpoint, options?)`

Ces fonctions gèrent automatiquement :
- La construction de l'URL complète
- Les erreurs HTTP
- Le parsing JSON
- Les exceptions personnalisées

## Exemples

Consultez `hooks/useAuth.ts` pour voir des exemples d'implémentation de hooks personnalisés.
