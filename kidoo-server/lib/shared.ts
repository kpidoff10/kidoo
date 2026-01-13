/**
 * Réexport des schémas et types partagés depuis le dossier shared/
 * 
 * Ce fichier permet de partager les schémas Zod et types TypeScript
 * entre kidoo-app (Expo) et kidoo-server (Next.js) sans duplication.
 * 
 * IMPORTANT: Pour que cela fonctionne, utilisez Webpack :
 *    - Commande : `npm run dev:webpack` ou `npm run build:webpack`
 * 
 * Webpack résout correctement les modules en dehors du projet,
 * contrairement à Turbopack qui nécessiterait une duplication locale.
 */

// Import depuis shared/ (partage réel, fonctionne avec Webpack)
export * from '../../shared';
