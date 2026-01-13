# Utilisation du client Prisma

## Import du client

```typescript
import { prisma } from '@/lib/prisma';
```

## Exemples d'utilisation

### Créer un utilisateur

```typescript
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
  },
});
```

### Créer un Kidoo lié à un utilisateur

```typescript
const kidoo = await prisma.kidoo.create({
  data: {
    name: 'Mon Kidoo',
    deviceId: 'ble-uuid-123',
    macAddress: 'AA:BB:CC:DD:EE:FF',
    userId: user.id,
  },
});
```

### Récupérer un utilisateur avec ses Kidoos

```typescript
const userWithKidoos = await prisma.user.findUnique({
  where: { email: 'user@example.com' },
  include: { kidoos: true },
});
```

### Dans une Server Action Next.js

```typescript
// app/actions/users.ts
'use server';

import { prisma } from '@/lib/prisma';

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    include: { kidoos: true },
  });
}
```

## Note importante

Le client Prisma est un singleton global qui évite les problèmes de connexions multiples en développement avec Next.js. Le client est automatiquement réutilisé entre les requêtes.
