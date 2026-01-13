/**
 * Helpers pour l'authentification dans les routes API
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Extrait l'userId depuis les headers de la requête
 * Cherche dans X-User-Id ou Authorization header
 * 
 * @param request - La requête Next.js
 * @returns L'userId ou null si non trouvé
 */
export function getUserIdFromRequest(request: NextRequest): string | null {
  // Priorité 1: Header X-User-Id (spécifique pour mobile)
  const userIdHeader = request.headers.get('X-User-Id');
  if (userIdHeader) {
    return userIdHeader.trim();
  }

  // Priorité 2: Header Authorization (format: "Bearer userId" ou juste "userId")
  const authHeader = request.headers.get('Authorization');
  if (authHeader) {
    // Supprimer "Bearer " si présent
    const cleanAuth = authHeader.replace(/^Bearer\s+/i, '').trim();
    return cleanAuth || null;
  }

  return null;
}

/**
 * Vérifie si l'utilisateur est authentifié
 * 
 * @param request - La requête Next.js
 * @returns Un objet avec userId si authentifié, ou une réponse d'erreur NextResponse
 */
export function requireAuth(request: NextRequest): 
  | { success: true; userId: string }
  | { success: false; response: NextResponse } {
  const userId = getUserIdFromRequest(request);

  if (!userId) {
    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          error: 'Authentification requise',
          field: 'userId',
        },
        { status: 401 }
      ),
    };
  }

  return {
    success: true,
    userId,
  };
}
