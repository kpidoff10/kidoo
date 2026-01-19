/**
 * Route API pour les commandes d'un Kidoo
 * POST /api/kidoos/[id]/commands - Exécute une commande sur le Kidoo
 * GET /api/kidoos/[id]/commands - Liste les commandes disponibles
 * 
 * Format de la requête POST:
 * {
 *   "action": "brightness",
 *   "value": 80
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { processCommand, getAvailableCommands } from './handlers';

/**
 * GET /api/kidoos/[id]/commands
 * Liste les commandes disponibles pour ce Kidoo
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérifier l'authentification
    const authResult = requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const { userId } = authResult;
    const { id } = await params;

    // Vérifier que le kidoo existe et appartient à l'utilisateur
    const kidoo = await prisma.kidoo.findUnique({
      where: { id },
    });

    if (!kidoo) {
      return NextResponse.json(
        { success: false, error: 'Kidoo non trouvé' },
        { status: 404 }
      );
    }

    if (kidoo.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Récupérer les commandes disponibles pour ce modèle
    const commands = getAvailableCommands(kidoo.model);

    return NextResponse.json({
      success: true,
      data: {
        model: kidoo.model,
        commands,
      },
      message: `${commands.length} commande(s) disponible(s)`,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    return NextResponse.json(
      { success: false, error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/kidoos/[id]/commands
 * Exécute une commande sur le Kidoo
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérifier l'authentification
    const authResult = requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const { userId } = authResult;
    const { id } = await params;

    // Récupérer le body de la requête
    const body = await request.json();

    // Vérifier que l'action est présente
    if (!body.action || typeof body.action !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Action manquante ou invalide' },
        { status: 400 }
      );
    }

    // Vérifier que le kidoo existe et appartient à l'utilisateur
    const kidoo = await prisma.kidoo.findUnique({
      where: { id },
      include: { configBasic: true },
    });

    if (!kidoo) {
      return NextResponse.json(
        { success: false, error: 'Kidoo non trouvé' },
        { status: 404 }
      );
    }

    if (kidoo.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Vérifier que le Kidoo a une adresse MAC (nécessaire pour PubNub)
    if (!kidoo.macAddress) {
      return NextResponse.json(
        { success: false, error: 'Kidoo non configuré (adresse MAC manquante)' },
        { status: 400 }
      );
    }

    // Traiter la commande
    const result = await processCommand(kidoo, body.action, body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.status || 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: result.message || 'Commande exécutée',
    });
  } catch (error) {
    console.error('Erreur lors de l\'exécution de la commande:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    
    return NextResponse.json(
      {
        success: false,
        error: 'Une erreur est survenue lors de l\'exécution de la commande',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
