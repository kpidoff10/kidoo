# Kidoo App

Application mobile React Native pour contrôler les appareils Kidoo.

## Stack technique

| Catégorie | Technologie |
|-----------|-------------|
| Framework | React Native + Expo |
| Language | TypeScript |
| Navigation | React Navigation |
| State/Cache | React Query + Persist |
| Formulaires | React Hook Form + Zod |
| HTTP | Axios |
| Auth | JWT + Refresh Token |
| i18n | react-i18next (FR/EN) |
| Theme | Light/Dark auto |

## Installation

### Prérequis

- Node.js 18+
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Pour iOS : Xcode (Mac uniquement)
- Pour Android : Android Studio + émulateur

### Setup

```bash
# Installer les dépendances
cd kidoo-app
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Éditer .env avec votre configuration
```

### Configuration

Créer un fichier `.env` à la racine :

```env
API_URL=http://localhost:3000
```

## Scripts

```bash
# Démarrer le serveur de développement
npm start

# Lancer sur Android
npm run android

# Lancer sur iOS
npm run ios

# Lancer sur Web
npm run web
```

## Architecture

```
src/
├── api/              # Clients API (axios, endpoints)
├── components/       # Composants réutilisables
│   ├── ui/           # Button, Input, Card...
│   ├── ErrorBoundary/
│   └── layout/
├── contexts/         # React Contexts (Auth, Network)
├── hooks/            # Custom hooks
├── i18n/             # Traductions FR/EN
├── lib/              # Configuration (queryClient)
├── navigation/       # React Navigation config
├── screens/          # Écrans organisés par feature
│   ├── auth/
│   ├── home/
│   ├── kidoos/
│   └── profile/
├── theme/            # Couleurs, fonts, spacing
├── types/            # Types TypeScript
└── utils/            # Utilitaires
```

## Features

- **Authentification** : Login/Register avec JWT + Refresh token
- **Theme** : Light/Dark mode automatique
- **i18n** : Français et Anglais (auto-détection)
- **Offline** : Détection réseau + cache persistant
- **Optimistic UI** : Mises à jour instantanées avec rollback

## Conventions

Voir [docs/CONVENTIONS.md](docs/CONVENTIONS.md) pour les conventions de code.
