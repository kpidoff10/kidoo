/**
 * Routes API pour les fichiers multimédias d'un tag spécifique
 * GET /api/tags/[id]/multimedia - Récupérer tous les fichiers multimédias d'un tag
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { r2Client, getFileUrl } from '@/lib/r2';

/**
 * GET /api/tags/[id]/multimedia
 * Récupère tous les fichiers multimédias d'un tag spécifique
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
    const { id: tagId } = await params;

    // Vérifier que le tag existe et appartient à l'utilisateur
    const tag = await prisma.tag.findFirst({
      where: {
        id: tagId,
        userId,
      },
    });

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
        tagId: tag.id, // Utiliser l'id du tag (clé primaire)
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
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
