# Configuration Sentry pour Kidoo App

## Installation

Sentry est déjà installé et configuré dans l'application. Il capture automatiquement :
- Les erreurs JavaScript non gérées
- Les erreurs React (via ErrorBoundary)
- Les erreurs réseau (via API client)
- Les crashes natifs (Android/iOS)

## Configuration

### 1. Obtenir votre DSN Sentry

1. Créez un compte sur [sentry.io](https://sentry.io) (gratuit jusqu'à 5,000 événements/mois)
2. Créez un nouveau projet "React Native"
3. Copiez votre DSN depuis : `Settings > Projects > {votre-projet} > Client Keys (DSN)`

### 2. Configurer le DSN

Ajoutez votre DSN dans le fichier `.env` :

```env
EXPO_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

### 3. Redémarrer l'application

Après avoir ajouté le DSN, redémarrez l'application :

```bash
npm run start
```

## Utilisation

### Capturer une erreur manuellement

```typescript
import { captureError } from '@/lib/sentry';

try {
  // Votre code
} catch (error) {
  captureError(error, { context: 'additional info' });
}
```

### Capturer un message

```typescript
import { captureMessage } from '@/lib/sentry';

captureMessage('Something important happened', 'info');
```

### Ajouter du contexte utilisateur

```typescript
import { setUser } from '@/lib/sentry';

setUser({
  id: user.id,
  email: user.email,
  username: user.username,
});
```

### Ajouter des tags

```typescript
import { setTag } from '@/lib/sentry';

setTag('feature', 'bluetooth');
setTag('environment', 'production');
```

## Configuration actuelle

- **En développement** : Sentry est désactivé (`enableInExpoDevelopment: false`) pour éviter le bruit
- **En production** : Sentry capture toutes les erreurs
- **Sampling** : 100% en dev, 10% en prod pour les traces de performance
- **Session tracking** : Activé automatiquement

## Voir les utilisateurs connectés dans Sentry

Sentry capture automatiquement les informations utilisateur lors de la connexion. Vous pouvez voir :

### Dans le dashboard Sentry

1. **Vue "Users"** : Allez dans `Issues > Users` pour voir tous les utilisateurs affectés par des erreurs
2. **Sur chaque erreur** : Cliquez sur une erreur pour voir :
   - L'utilisateur affecté (ID, email, username)
   - Le nombre d'utilisateurs affectés par cette erreur
   - Les tags associés (comme `developer_mode`)

### Informations capturées automatiquement

- **ID utilisateur** : Identifiant unique de l'utilisateur
- **Email** : Adresse email de l'utilisateur
- **Username** : Nom ou email de l'utilisateur
- **Tags** : 
  - `developer_mode`: `enabled` ou `disabled` selon si le mode développeur est activé

### Exemple de ce que vous verrez

Quand un utilisateur se connecte, Sentry reçoit automatiquement :
```json
{
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "username": "John Doe"
  },
  "tags": {
    "developer_mode": "disabled"
  }
}
```

Toutes les erreurs capturées après la connexion seront associées à cet utilisateur.

## Vérifier que Sentry fonctionne

1. Ajoutez temporairement ce code dans votre app :
```typescript
import { captureMessage } from '@/lib/sentry';
captureMessage('Test Sentry', 'info');
```

2. Connectez-vous avec un utilisateur
3. Vérifiez dans votre dashboard Sentry que :
   - Le message apparaît
   - L'utilisateur est associé au message (onglet "User" dans les détails de l'événement)

## Désactiver Sentry

Pour désactiver Sentry temporairement, commentez l'initialisation dans `index.tsx` :

```typescript
// if (process.env.EXPO_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN) {
//   Sentry.init({ ... });
// }
```

## Documentation

- [Sentry React Native Docs](https://docs.sentry.io/platforms/react-native/)
- [Expo + Sentry Integration](https://docs.expo.dev/guides/using-sentry/)
