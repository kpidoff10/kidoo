/**
 * Point d'entrée pour toutes les API communes à tous les modèles de Kidoo
 * 
 * Ce fichier regroupe toutes les opérations API communes (CRUD) :
 * - create: Créer un Kidoo
 * - get: Récupérer un ou plusieurs Kidoos
 * - update: Mettre à jour un Kidoo
 * - delete: Supprimer un Kidoo
 */

export {
  createKidoo,
  getKidooById,
  getKidoos,
  updateKidoo,
  deleteKidoo,
  type CreateKidooResponse,
  type CreateKidooError,
} from './common-api-kidoo';

// Réexporter les query keys
export { kidooKeys } from './common-api-keys';
