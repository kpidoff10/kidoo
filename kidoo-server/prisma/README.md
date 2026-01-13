# Configuration Prisma avec Neon PostgreSQL

## Configuration de l'environnement

Créez un fichier `.env` à la racine du projet avec la variable suivante :

```env
# URL de connexion PostgreSQL Neon
# Format: postgresql://user:password@host:port/database?sslmode=require
# Exemple Neon: postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
```

**Note importante :** Dans Prisma 7.x, l'URL de la base de données est configurée dans `prisma.config.ts` (déjà configuré) et non dans `schema.prisma`. Le fichier `.env` est automatiquement chargé par `prisma.config.ts` grâce à `dotenv/config`.

## Récupération de votre URL de connexion Neon

1. Connectez-vous à votre tableau de bord Neon : https://console.neon.tech
2. Sélectionnez votre projet
3. Allez dans "Connection Details"
4. Copiez la connection string et remplacez `[YOUR-PASSWORD]` par votre mot de passe réel
5. Ajoutez `?sslmode=require` à la fin de l'URL

## Commandes disponibles

- `npm run db:generate` - Génère le client Prisma
- `npm run db:push` - Pousse le schéma vers la base de données (développement)
- `npm run db:migrate` - Crée une nouvelle migration
- `npm run db:migrate:deploy` - Applique les migrations (production)
- `npm run db:studio` - Ouvre Prisma Studio (interface graphique)
- `npm run db:seed` - Exécute le script de seed (optionnel)

## Premier déploiement

1. Configurez votre `.env` avec l'URL Neon
2. Exécutez `npm run db:generate` pour générer le client Prisma
3. Exécutez `npm run db:push` pour créer les tables (développement) ou `npm run db:migrate` pour créer une migration

## Structure du schéma

Le schéma définit deux modèles principaux :
- **User** : Profils utilisateurs avec email unique
- **Kidoo** : Appareils Kidoo liés aux utilisateurs (relation optionnelle)
