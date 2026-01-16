/**
 * Route API pour récupérer les fichiers multimédias
 * GET /api/multimedia?tagId=xxx - Récupérer tous les fichiers multimédias d'un tag par son tagId (UUID)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { r2Client, getFileUrl } from '@/lib/r2';

/**
 * GET /api/multimedia?tagId=xxx
 * Récupère tous les fichiers multimédias d'un tag spécifique par son tagId (UUID)
 */
export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const authResult = requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const { userId } = authResult;

    // Récupérer le paramètre tagId depuis l'URL
    const { searchParams } = new URL(request.url);
    const tagIdParam = searchParams.get('tagId');

    if (!tagIdParam) {
      return NextResponse.json(
        {
          success: false,
          error: 'Le paramètre tagId est requis',
        },
        { status: 400 }
      );
    }

    // Vérifier que le tag existe et appartient à l'utilisateur
    // On essaie d'abord par tagId (UUID), puis par id (clé primaire) si ce n'est pas trouvé
    let tag = await prisma.tag.findFirst({
      where: {
        tagId: tagIdParam, // tagId est l'UUID du tag
        userId,
      },
    });

    // Si pas trouvé par tagId (UUID), essayer par id (clé primaire)
    if (!tag) {
      tag = await prisma.tag.findFirst({
        where: {
          id: tagIdParam, // id est la clé primaire
          userId,
        },
      });
    }

    if (!tag) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tag non trouvé ou vous n\'avez pas les permissions',
        },
        { status: 404 }
      );
    }

    // Récupérer tous les fichiers multimédias du tag
    const multimediaFiles = await prisma.multimediaFile.findMany({
      where: {
        tagId: tag.id, // Utiliser l'id du tag (clé primaire) pour la relation
        userId,
      },
      orderBy: [
        {
          order: 'asc', // Trier d'abord par ordre (pour réorganisation)
        },
        {
          createdAt: 'desc', // Puis par date de création (fallback)
        },
      ],
    });

    // Régénérer les URLs des fichiers (au cas où les URLs signées auraient expiré)
    const multimediaFilesWithUrls = await Promise.all(
      multimediaFiles.map(async (file) => {
        let fileUrl = file.url;
        try {
          if (r2Client) {
            fileUrl = await getFileUrl(file.path);
          }
        } catch (urlError) {
          console.error('[Multimedia Get] Erreur lors de la génération de l\'URL:', urlError);
          // Utiliser l'URL stockée en base si la génération échoue
        }

        return {
          id: file.id,
          url: fileUrl,
          path: file.path,
          fileName: file.fileName,
          originalName: file.originalName,
          size: file.size,
          mimeType: file.mimeType,
          tagId: tag.tagId, // Retourner le tagId (UUID) pour compatibilité
          order: file.order, // Retourner l'ordre pour la réorganisation
          disabled: file.disabled || false, // Inclure le statut disabled
          createdAt: file.createdAt.toISOString(),
          updatedAt: file.updatedAt.toISOString(),
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: multimediaFilesWithUrls,
      message: `${multimediaFiles.length} fichier(s) trouvé(s)`,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des fichiers multimédias:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la récupération des fichiers multimédias',
      },
      { status: 500 }
    );
  }
}
