/**
 * Query keys hiérarchiques pour les Kidoos
 * Défini ici pour éviter la dépendance circulaire
 */

// Query keys hiérarchiques pour les Kidoos
export const kidooKeys = {
  all: ['kidoos'] as const,
  lists: () => [...kidooKeys.all, 'list'] as const,
  details: () => [...kidooKeys.all, 'detail'] as const,
  detail: (kidooId: string) => [...kidooKeys.details(), kidooId] as const,
};
