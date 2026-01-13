/**
 * Routes API pour les tags d'un Kidoo spécifique
 * GET /api/kidoos/[id]/tags - Récupérer tous les tags d'un Kidoo
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';

/**
 * GET /api/kidoos/[id]/tags
 * Récupère tous les tags d'un Kidoo spécifique
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
    const { id: kidooId } = await params;

    // Vérifier que le Kidoo appartient à l'utilisateur
    const kidoo = await prisma.kidoo.findFirst({
      where: {
        id: kidooId,
        userId,
      },
    });

    if (!kidoo) {
      return NextResponse.json(
        {
          success: false,
          error: 'Kidoo non trouvé ou vous n\'avez pas les permissions',
        },
        { status: 404 }
      );
    }

    // Récupérer les tags du Kidoo
    const tags = await prisma.tag.findMany({
      where: {
        kidooId,
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Convertir les dates en ISO strings
    const tagsWithISOStrings = tags.map((tag) => ({
      ...tag,
      createdAt: tag.createdAt.toISOString(),
      updatedAt: tag.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: tagsWithISOStrings,
      message: `${tags.length} tag(s) trouvé(s)`,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des tags:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Une erreur est survenue lors de la récupération des tags',
      },
      { status: 500 }
    );
  }
}
