# API REST - Inscription

Cette route API REST fournit une alternative à la Server Action pour l'inscription. Elle peut être utilisée depuis n'importe quel client (mobile, web, etc.).

## Endpoints

### POST `/api/auth/register`

Crée un nouveau compte utilisateur.

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Responses

##### 201 Created - Succès

```json
{
  "success": true,
  "message": "Compte créé avec succès",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

##### 400 Bad Request - Validation échouée

```json
{
  "success": false,
  "error": "Email invalide",
  "field": "email"
}
```

##### 409 Conflict - Email déjà utilisé

```json
{
  "success": false,
  "error": "Un compte avec cet email existe déjà",
  "field": "email"
}
```

##### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Une erreur est survenue lors de la création du compte. Veuillez réessayer."
}
```

### GET `/api/auth/register/check-email?email=...`

Vérifie si un email est déjà utilisé.

#### Query Parameters

- `email` (required) : Email à vérifier

#### Responses

##### 200 OK

```json
{
  "success": true,
  "available": false,
  "message": "Cet email est déjà utilisé"
}
```

ou

```json
{
  "success": true,
  "available": true,
  "message": "Cet email est disponible"
}
```

##### 400 Bad Request - Email manquant ou invalide

```json
{
  "success": false,
  "error": "Email invalide"
}
```

## Exemples d'utilisation

### JavaScript/Fetch

```javascript
// Inscription
async function register(email, password, name) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, name }),
  });

  const data = await response.json();

  if (data.success) {
    console.log('Compte créé:', data.user);
  } else {
    console.error('Erreur:', data.error);
  }

  return data;
}

// Vérifier email
async function checkEmail(email) {
  const response = await fetch(
    `/api/auth/register/check-email?email=${encodeURIComponent(email)}`
  );
  const data = await response.json();
  return data.available;
}
```

### React Native / Expo

```typescript
// Dans votre service auth
import { API_BASE_URL } from '@/config/api';

export async function registerUser(email: string, password: string, name: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors de l\'inscription');
    }

    return data;
  } catch (error) {
    console.error('Erreur inscription:', error);
    throw error;
  }
}
```

### curl

```bash
# Inscription
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'

# Vérifier email
curl http://localhost:3000/api/auth/register/check-email?email=user@example.com
```

## Validation

Les mêmes règles de validation s'appliquent que pour la Server Action :
- **Email** : Format email valide
- **Password** : Minimum 8 caractères
- **Name** : Entre 2 et 100 caractères

## Note

Pour une utilisation dans Next.js avec des composants React, il est recommandé d'utiliser la **Server Action** (`registerUser` de `app/actions/auth.ts`) plutôt que cette route API REST, car elle offre de meilleures performances et une meilleure intégration avec Next.js.

Utilisez cette route API REST si vous avez besoin d'appeler l'inscription depuis :
- Une application mobile (React Native, Expo)
- Une autre application web (CORS configuré)
- Un service externe
