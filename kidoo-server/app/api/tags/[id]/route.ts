/**
 * Routes API pour un Tag spécifique
 * GET /api/tags/[id] - Récupérer un tag
 * DELETE /api/tags/[id] - Supprimer un tag
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { updateTagInputSchema } from '@/shared';

/**
 * GET /api/tags/[id]
 * Récupère un tag spécifique
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

    // Récupérer le tag
    const tag = await prisma.tag.findFirst({
      where: {
        id,
        userId, // S'assurer que le tag appartient à l'utilisateur
      },
      include: {
        kidoo: {
          select: {
            id: true,
            name: true,
            model: true,
          },
        },
      },
    });

    if (!tag) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tag non trouvé',
        },
        { status: 404 }
      );
    }

    // Convertir les dates en ISO strings
    const tagWithISOStrings = {
      ...tag,
      createdAt: tag.createdAt.toISOString(),
      updatedAt: tag.updatedAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: tagWithISOStrings,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du tag:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Une erreur est survenue lors de la récupération du tag',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/tags/[id]
 * Met à jour un tag
 */
export async function PUT(
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
    const body = await request.json();

    // Validation des données
    const validationResult = updateTagInputSchema.safeParse(body);
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

    // Vérifier que le tag existe et appartient à l'utilisateur
    const existingTag = await prisma.tag.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingTag) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tag non trouvé',
        },
        { status: 404 }
      );
    }

    // Si un UID est fourni, vérifier qu'il n'existe pas déjà pour ce Kidoo
    if (validationResult.data.uid && validationResult.data.uid !== existingTag.uid) {
      const duplicateTag = await prisma.tag.findFirst({
        where: {
          uid: validationResult.data.uid,
          kidooId: existingTag.kidooId,
          id: { not: id },
        },
      });

      if (duplicateTag) {
        return NextResponse.json(
          {
            success: false,
            error: 'Un tag avec cet UID existe déjà pour ce Kidoo',
            errorCode: 'TAG_UID_ALREADY_EXISTS',
            field: 'uid',
          },
          { status: 409 }
        );
      }
    }

    // Préparer les données à mettre à jour
    const updateData: {
      uid?: string | null;
      name?: string | null;
    } = {};

    if (validationResult.data.uid !== undefined) {
      updateData.uid = validationResult.data.uid;
    }
    if (validationResult.data.name !== undefined) {
      updateData.name = validationResult.data.name;
    }

    // Mettre à jour le tag
    const updatedTag = await prisma.tag.update({
      where: { id },
      data: updateData,
    });

    // Convertir les dates en ISO strings
    const tagWithISOStrings = {
      ...updatedTag,
      createdAt: updatedTag.createdAt.toISOString(),
      updatedAt: updatedTag.updatedAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: tagWithISOStrings,
      message: 'Tag mis à jour avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du tag:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Une erreur est survenue lors de la mise à jour du tag',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tags/[id]
 * Supprime un tag
 */
export async function DELETE(
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

    // Vérifier que le tag existe et appartient à l'utilisateur
    const tag = await prisma.tag.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!tag) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tag non trouvé',
        },
        { status: 404 }
      );
    }

    // Supprimer le tag
    await prisma.tag.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Tag supprimé avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du tag:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Une erreur est survenue lors de la suppression du tag',
      },
      { status: 500 }
    );
  }
}
