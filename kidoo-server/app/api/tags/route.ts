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

    const { tagId, kidooId, name, type } = validationResult.data;

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

    // Vérifier que le tagId n'existe pas déjà
    const existingTag = await prisma.tag.findFirst({
      where: {
        tagId,
      },
    });

    if (existingTag) {
      return NextResponse.json(
        {
          success: false,
          error: 'Un tag avec ce tagId existe déjà',
          errorCode: 'TAG_ID_ALREADY_EXISTS',
          field: 'tagId',
        },
        { status: 409 }
      );
    }

    // Créer le nouveau tag
    // Le tagId (UUID) est généré par l'app et écrit sur le tag NFC avant la création
    // L'UID sera null jusqu'à ce que l'app lise le tag NFC et mette à jour le tag
    const newTag = await prisma.tag.create({
      data: {
        tagId, // UUID généré par l'app et écrit sur le tag NFC
        uid: null, // UID sera mis à jour par l'app après la lecture du tag NFC
        name: name || null,
        type: type || null, // Type du tag (ex: "MUSIC")
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
