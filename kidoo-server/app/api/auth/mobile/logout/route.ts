import { NextResponse } from 'next/server';

/**
 * POST /api/auth/mobile/logout
 * Déconnexion (pour compatibilité, l'app mobile gère la déconnexion localement)
 */
export async function POST() {
  // Pour l'app mobile, la déconnexion est gérée localement via AsyncStorage
  // Cette route existe pour compatibilité et pour pouvoir invalider des tokens si nécessaire
  return NextResponse.json({ success: true, message: 'Déconnexion réussie' });
}
