/**
 * Enum pour les types de tags NFC
 * Partagé entre kidoo-server et kidoo-app
 */

export enum TagType {
  MUSIC = 'MUSIC',
  STORY = 'STORY',
  SOUND = 'SOUND',
}

/**
 * Liste des types de tags disponibles (pour l'UI)
 */
export const TAG_TYPES = [
  { value: TagType.MUSIC, label: 'Musique' },
  { value: TagType.STORY, label: 'Histoire' },
  { value: TagType.SOUND, label: 'Son' },
] as const;
