/**
 * Route API pour réorganiser l'ordre des fichiers multimédias
 * PUT /api/multimedia/reorder - Réorganiser l'ordre des fichiers multimédias d'un tag
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';

/**
 * PUT /api/multimedia/reorder
 * Réorganise l'ordre des fichiers multimédias d'un tag
 * Body: { tagId: string, fileIds: string[] } - Liste des IDs dans le nouvel ordre
 */
export async function PUT(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const authResult = requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const { userId } = authResult;

    // Récupérer le body
    const body = await request.json();
    const { tagId, fileIds } = body;

    if (!tagId || !Array.isArray(fileIds)) {
      return NextResponse.json(
        {
          success: false,
          error: 'tagId et fileIds (array) sont requis',
        },
        { status: 400 }
      );
    }

    // Vérifier que le tag existe et appartient à l'utilisateur
    const tag = await prisma.tag.findFirst({
      where: {
        tagId: tagId, // tagId est l'UUID du tag
        userId,
      },
    });

    if (!tag) {
      // Essayer par id (clé primaire) si tagId (UUID) n'a pas fonctionné
      const tagById = await prisma.tag.findFirst({
        where: {
          id: tagId,
          userId,
        },
      });

      if (!tagById) {
        return NextResponse.json(
          {
            success: false,
            error: 'Tag non trouvé ou vous n\'avez pas les permissions',
          },
          { status: 404 }
        );
      }
    }

    const actualTag = tag || (await prisma.tag.findFirst({
      where: {
        id: tagId,
        userId,
      },
    }));

    if (!actualTag) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tag non trouvé ou vous n\'avez pas les permissions',
        },
        { status: 404 }
      );
    }

    // Vérifier que tous les fichiers appartiennent à l'utilisateur et au tag
    const files = await prisma.multimediaFile.findMany({
      where: {
        id: { in: fileIds },
        tagId: actualTag.id,
        userId,
      },
    });

    if (files.length !== fileIds.length) {
      return NextResponse.json(
        {
          success: false,
          error: 'Certains fichiers n\'ont pas été trouvés ou ne vous appartiennent pas',
        },
        { status: 403 }
      );
    }

    // Mettre à jour l'ordre de chaque fichier
    const updatePromises = fileIds.map((fileId, index) =>
      prisma.multimediaFile.update({
        where: { id: fileId },
        data: { order: index },
      })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: 'Ordre des fichiers mis à jour avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la réorganisation des fichiers multimédias:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la réorganisation',
      },
      { status: 500 }
    );
  }
}
