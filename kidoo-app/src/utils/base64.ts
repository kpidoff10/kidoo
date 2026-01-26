/**
 * Base64 Encoding Utilities
 * Fonctions utilitaires pour l'encodage/décodage Base64
 */

/**
 * Encode une string en base64
 * Utilise TextEncoder disponible dans React Native moderne
 * 
 * @param str La string à encoder
 * @returns La string encodée en base64
 * 
 * @example
 * ```ts
 * const encoded = encodeBase64('Hello World');
 * console.log(encoded); // "SGVsbG8gV29ybGQ="
 * ```
 */
export function encodeBase64(str: string): string {
  try {
    // Utiliser TextEncoder (disponible dans React Native)
    const encoder = new TextEncoder();
    const bytes = encoder.encode(str);
    
    // Convertir bytes en base64 manuellement
    const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    let i = 0;
    
    while (i < bytes.length) {
      const a = bytes[i++];
      const b = i < bytes.length ? bytes[i++] : 0;
      const c = i < bytes.length ? bytes[i++] : 0;
      
      const bitmap = (a << 16) | (b << 8) | c;
      
      result += base64Chars.charAt((bitmap >> 18) & 63);
      result += base64Chars.charAt((bitmap >> 12) & 63);
      result += i - 2 < bytes.length ? base64Chars.charAt((bitmap >> 6) & 63) : '=';
      result += i - 1 < bytes.length ? base64Chars.charAt(bitmap & 63) : '=';
    }
    
    return result;
  } catch (error) {
    console.error('[BASE64] Erreur lors de l\'encodage base64:', error);
    // En dernier recours, essayer d'envoyer la string directement
    // (ne devrait pas arriver dans un environnement React Native moderne)
    return str;
  }
}

/**
 * Décode une string base64
 * Utilise TextDecoder disponible dans React Native moderne
 * 
 * @param base64 La string base64 à décoder
 * @returns La string décodée
 * 
 * @example
 * ```ts
 * const decoded = decodeBase64('SGVsbG8gV29ybGQ=');
 * console.log(decoded); // "Hello World"
 * ```
 */
export function decodeBase64(base64: string): string {
  try {
    // Table de décodage base64
    const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const lookup: number[] = [];
    
    // Construire la table de lookup
    for (let i = 0; i < base64Chars.length; i++) {
      lookup[base64Chars.charCodeAt(i)] = i;
    }
    lookup['='.charCodeAt(0)] = 0;
    
    // Nettoyer la string (enlever les espaces, retours à la ligne, etc.)
    base64 = base64.replace(/[^A-Za-z0-9+/=]/g, '');
    
    // Décoder
    const bytes: number[] = [];
    let i = 0;
    
    while (i < base64.length) {
      const enc1 = lookup[base64.charCodeAt(i++)];
      const enc2 = lookup[base64.charCodeAt(i++)];
      const enc3 = lookup[base64.charCodeAt(i++)];
      const enc4 = lookup[base64.charCodeAt(i++)];
      
      const bitmap = (enc1 << 18) | (enc2 << 12) | (enc3 << 6) | enc4;
      
      if (enc3 !== 64) bytes.push((bitmap >> 16) & 255);
      if (enc4 !== 64) bytes.push((bitmap >> 8) & 255);
      bytes.push(bitmap & 255);
    }
    
    // Convertir bytes en string avec TextDecoder
    const decoder = new TextDecoder();
    return decoder.decode(new Uint8Array(bytes));
  } catch (error) {
    console.error('[BASE64] Erreur lors du décodage base64:', error);
    throw new Error('Impossible de décoder la string base64');
  }
}
