/**
 * Utilitaires pour la conversion et le formatage des unités de stockage
 */

/**
 * Convertit des octets en Go (ou Mo si moins d'1 Go)
 * @param bytes Nombre d'octets à convertir
 * @returns Chaîne formatée (ex: "1.23 Go" ou "500.00 Mo")
 */
export function formatBytesToGB(bytes: number): string {
  const gb = bytes / (1024 * 1024 * 1024);
  if (gb >= 1) {
    return `${gb.toFixed(2)} Go`;
  }
  // Si moins d'1 Go, afficher en Mo
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} Mo`;
}
