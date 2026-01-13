/**
 * Routes API pour les Tags NFC
 * POST /api/tags - Créer un nouveau tag NFC
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createTagInputSchema } from '@/shared';
import { requireAuth } from '@/lib/auth-helpers';

/**
 * POST /api/tags
 * Crée un nouveau tag NFC pour un Kidoo
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Vérifier l'authentification
    const authResult = requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const { userId } = authResult;

    // Validation des données
    const validationResult = createTagInputSchema.safeParse(body);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return NextResponse.json(
        {
          success: false,
          error: firstError.message,
          field: firstError.path[0] as string,
        },
        { status: 400 }
      );
    }

    const { kidooId, name } = validationResult.data;

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

    // Créer un tag temporaire avec un UID placeholder
    // L'UID réel sera mis à jour après la lecture du tag NFC
    // On utilise un UUID temporaire pour éviter les contraintes de base de données
    const tempUID = `temp_${crypto.randomUUID()}`;

    // Créer le nouveau tag
    // L'id (UUID) sera généré automatiquement par Prisma et sera écrit sur le tag NFC
    const newTag = await prisma.tag.create({
      data: {
        uid: tempUID, // UID temporaire, sera remplacé par l'UID réel du tag NFC
        name: name || null,
        kidooId,
        userId,
      },
    });

    // Convertir les dates en ISO strings
    const tagWithISOStrings = {
      ...newTag,
      createdAt: newTag.createdAt.toISOString(),
      updatedAt: newTag.updatedAt.toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        data: tagWithISOStrings,
        message: 'Tag créé avec succès',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur lors de la création du tag:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Une erreur est survenue lors de la création du tag',
      },
      { status: 500 }
    );
  }
}
