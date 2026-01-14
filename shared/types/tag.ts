/**
 * Types pour les Tags NFC partagés entre le client et le serveur
 */

export interface Tag {
  id: string; // Clé primaire générée par Prisma
  tagId: string; // UUID généré par l'app et écrit sur le tag NFC
  uid: string | null; // UID du tag NFC (lecture seule, identifiant matériel du tag physique) - null jusqu'à la lecture du tag
  name: string | null;
  kidooId: string;
  userId: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
