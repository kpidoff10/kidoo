# Partage des schémas avec shared/

Ce fichier explique comment partager les schémas et types entre `kidoo-app` et `kidoo-server` sans duplication.

## Solution : Utiliser Webpack ✅

Le projet utilise **Webpack** pour partager réellement les fichiers depuis le dossier `shared/` sans duplication.

**Utilisation** :
```bash
npm run dev:webpack    # Développement avec Webpack
npm run build:webpack  # Build avec Webpack
```

**Configuration** : 
- Les imports utilisent `@/shared` qui pointe vers `../shared/` grâce à la configuration webpack dans `next.config.ts`
- Le fichier `lib/shared.ts` réexporte tout depuis `../../shared`
- Pas de duplication nécessaire, les modifications dans `shared/` sont directement utilisées

## Pourquoi Webpack ?

Next.js 16 utilise Turbopack par défaut, qui ne peut pas résoudre les modules en dehors du projet `kidoo-server`. 

Webpack supporte mieux les modules externes et permet un vrai partage sans duplication.

## Note sur Turbopack

Si vous souhaitez utiliser Turbopack (plus rapide), vous devrez :
1. Créer une copie locale dans `lib/schemas/`
2. Maintenir la synchronisation manuellement
3. Modifier `lib/shared.ts` pour pointer vers la copie locale

Pour le développement, **Webpack est recommandé** pour éviter la duplication et simplifier la maintenance.
