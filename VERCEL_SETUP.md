# Configuration Vercel pour le monorepo Kidoo

## Problème

Vercel doit détecter Next.js (Framework Preset) mais aussi avoir accès au dossier `shared/` qui est au niveau parent du monorepo.

## Solution

### Configuration dans l'interface Vercel

1. **Dans les paramètres du projet Vercel** :
   - Allez dans **Settings** → **General**
   - **Root Directory** : `kidoo-server` (important pour la détection automatique de Next.js)
   - **Framework Preset** : Devrait être détecté automatiquement comme **Next.js**

2. **Build & Development Settings** :
   - Le fichier `kidoo-server/vercel.json` configure automatiquement :
     - **Build Command** : `npm run build`
     - **Install Command** : `node scripts/install-workspaces.js` (installe depuis la racine pour les workspaces)
     - **Output Directory** : `.next`
   - **Framework Preset** : Next.js (détecté automatiquement)

3. **Variables d'environnement** :
   - Configurez toutes les variables nécessaires dans **Settings** → **Environment Variables**

### Comment ça fonctionne

- Le `vercel.json` dans `kidoo-server/` permet à Vercel de détecter automatiquement Next.js
- Le script `install-workspaces.js` monte automatiquement à la racine du monorepo pour installer les workspaces npm
- Cela permet d'avoir accès à `@kidoo/shared` via npm workspaces

### Vérification

Après configuration, Vercel devrait :
- ✅ Détecter Next.js comme framework automatiquement
- ✅ Installer les workspaces npm (y compris `@kidoo/shared`) depuis la racine
- ✅ Builder le projet correctement depuis `kidoo-server/`

## Structure du monorepo

```
Kidoo/
├── package.json (workspaces configurés)
├── shared/ (package @kidoo/shared)
├── kidoo-server/
│   ├── vercel.json (configuration Vercel - détection Next.js)
│   ├── package.json (dépend de @kidoo/shared)
│   └── scripts/
│       └── install-workspaces.js (installe depuis la racine)
└── kidoo-app/
    └── ...
```

## Important

**Root Directory dans Vercel** : Doit être configuré sur `kidoo-server` dans l'interface Vercel pour que :
1. Vercel détecte automatiquement Next.js (présence de `next.config.ts` et `package.json` avec Next.js)
2. Le `vercel.json` dans `kidoo-server/` soit utilisé
3. Le script d'installation puisse monter à la racine pour les workspaces
