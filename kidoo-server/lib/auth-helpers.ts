/**
 * Helpers pour l'authentification dans les routes API
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, extractTokenFromHeader } from './jwt';

/**
 * Extrait l'userId depuis les headers de la requête
 * Supporte JWT Bearer token et header X-User-Id
 * 
 * @param request - La requête Next.js
 * @returns L'userId ou null si non trouvé
 */
export function getUserIdFromRequest(request: NextRequest): string | null {
  // Priorité 1: JWT Bearer token
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = extractTokenFromHeader(authHeader);
    if (token) {
      const payload = verifyAccessToken(token);
      if (payload) {
        return payload.userId;
      }
    }
  }

  // Priorité 2: Header X-User-Id (fallback pour compatibilité)
  const userIdHeader = request.headers.get('X-User-Id');
  if (userIdHeader) {
    return userIdHeader.trim();
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
