/**
 * Utilitaires pour la liste des fichiers multimédias
 */

/**
 * Décode le nom du fichier si nécessaire (gère l'encodage URL et les caractères spéciaux)
 */
export function decodeFileName(fileName: string): string {
  try {
    // Essayer de décoder l'URL si c'est encodé
    if (fileName.includes('%')) {
      return decodeURIComponent(fileName);
    }
    // Si le nom contient des séquences d'échappement, les décoder
    if (fileName.includes('\\u')) {
      return JSON.parse(`"${fileName}"`);
    }
    return fileName;
  } catch (error) {
    // Si le décodage échoue, retourner le nom original
    console.warn('[MultimediaList] Erreur lors du décodage du nom de fichier:', error);
    return fileName;
  }
}

/**
 * Formate la taille d'un fichier en format lisible
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}
