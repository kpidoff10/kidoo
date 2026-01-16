/**
 * Routes API pour un fichier multimédia spécifique
 * GET /api/multimedia/[id] - Récupérer un fichier multimédia
 * DELETE /api/multimedia/[id] - Supprimer un fichier multimédia
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { r2Client, MULTIMEDIA_BUCKET, getFileUrl } from '@/lib/r2';
import { prisma } from '@/lib/prisma';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';

/**
 * GET /api/multimedia/[id]
 * Récupère un fichier multimédia par son ID
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

    // Vérifier que l'ID est présent
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID du fichier requis',
        },
        { status: 400 }
      );
    }

    // Récupérer le fichier depuis la base de données
    const multimediaFile = await prisma.multimediaFile.findUnique({
      where: {
        id,
      },
      include: {
        tag: {
          select: {
            id: true,
            tagId: true,
            name: true,
            kidooId: true,
          },
        },
      },
    });

    // Vérifier que le fichier existe
    if (!multimediaFile) {
      return NextResponse.json(
        {
          success: false,
          error: 'Fichier non trouvé',
        },
        { status: 404 }
      );
    }

    // Vérifier que le fichier appartient à l'utilisateur
    if (multimediaFile.userId !== userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Vous n\'avez pas les permissions pour accéder à ce fichier',
        },
        { status: 403 }
      );
    }

    // Régénérer l'URL du fichier (au cas où l'URL signée aurait expiré)
    let fileUrl = multimediaFile.url;
    try {
      if (r2Client) {
        fileUrl = await getFileUrl(multimediaFile.path);
      }
    } catch (urlError) {
      console.error('[Multimedia Get] Erreur lors de la génération de l\'URL:', urlError);
      // Utiliser l'URL stockée en base si la génération échoue
    }

    // Convertir les dates en ISO strings
    const multimediaFileWithISOStrings = {
      id: multimediaFile.id,
      url: fileUrl,
      path: multimediaFile.path,
      fileName: multimediaFile.fileName,
      originalName: multimediaFile.originalName,
      size: multimediaFile.size,
      mimeType: multimediaFile.mimeType,
      tagId: multimediaFile.tag.tagId, // Retourner le tagId (UUID) pour compatibilité
      order: multimediaFile.order,
      disabled: multimediaFile.disabled || false,
      tag: {
        id: multimediaFile.tag.id,
        tagId: multimediaFile.tag.tagId,
        name: multimediaFile.tag.name,
        kidooId: multimediaFile.tag.kidooId,
      },
      createdAt: multimediaFile.createdAt.toISOString(),
      updatedAt: multimediaFile.updatedAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: multimediaFileWithISOStrings,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du fichier:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la récupération du fichier',
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/multimedia/[id]
 * Met à jour un fichier multimédia (notamment le statut disabled)
 */
export async function PATCH(
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

    // Vérifier que l'ID est présent
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID du fichier requis',
        },
        { status: 400 }
      );
    }

    // Récupérer le body de la requête
    const body = await request.json();
    const { disabled } = body;

    // Vérifier que disabled est un booléen
    if (typeof disabled !== 'boolean') {
      return NextResponse.json(
        {
          success: false,
          error: 'Le champ disabled doit être un booléen',
        },
        { status: 400 }
      );
    }

    // Vérifier que le fichier existe et appartient à l'utilisateur
    const multimediaFile = await prisma.multimediaFile.findUnique({
      where: {
        id,
      },
    });

    if (!multimediaFile) {
      return NextResponse.json(
        {
          success: false,
          error: 'Fichier non trouvé',
        },
        { status: 404 }
      );
    }

    if (multimediaFile.userId !== userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Vous n\'avez pas les permissions pour modifier ce fichier',
        },
        { status: 403 }
      );
    }

    // Mettre à jour le fichier
    const updatedFile = await prisma.multimediaFile.update({
      where: {
        id,
      },
      data: {
        disabled,
      },
      include: {
        tag: {
          select: {
            id: true,
            tagId: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updatedFile.id,
        url: updatedFile.url,
        path: updatedFile.path,
        fileName: updatedFile.fileName,
        originalName: updatedFile.originalName,
        size: updatedFile.size,
        mimeType: updatedFile.mimeType,
        tagId: updatedFile.tag.tagId,
        order: updatedFile.order,
        disabled: updatedFile.disabled,
        createdAt: updatedFile.createdAt.toISOString(),
        updatedAt: updatedFile.updatedAt.toISOString(),
      },
      message: disabled ? 'Fichier désactivé avec succès' : 'Fichier activé avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du fichier:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la mise à jour',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/multimedia/[id]
 * Supprime un fichier multimédia
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

    // Vérifier que l'ID est présent
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID du fichier requis',
        },
        { status: 400 }
      );
    }

    // Récupérer le fichier depuis la base de données
    const multimediaFile = await prisma.multimediaFile.findUnique({
      where: {
        id,
      },
      include: {
        tag: {
          select: {
            id: true,
            tagId: true,
            name: true,
          },
        },
      },
    });

    // Vérifier que le fichier existe
    if (!multimediaFile) {
      return NextResponse.json(
        {
          success: false,
          error: 'Fichier non trouvé',
        },
        { status: 404 }
      );
    }

    // Vérifier que le fichier appartient à l'utilisateur
    if (multimediaFile.userId !== userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Vous n\'avez pas les permissions pour supprimer ce fichier',
        },
        { status: 403 }
      );
    }

    // Vérifier que R2 est configuré
    if (!r2Client) {
      return NextResponse.json(
        {
          success: false,
          error: 'Service de stockage non configuré. Veuillez configurer Cloudflare R2.',
        },
        { status: 500 }
      );
    }

    // Supprimer le fichier de R2
    try {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: MULTIMEDIA_BUCKET,
        Key: multimediaFile.path,
      });

      await r2Client.send(deleteCommand);
    } catch (r2Error) {
      console.error('[Multimedia Delete] Erreur lors de la suppression du fichier R2:', r2Error);
      // Continuer quand même pour supprimer l'enregistrement en base
      // Le fichier pourrait ne plus exister dans R2
    }

    // Supprimer l'enregistrement de la base de données
    try {
      await prisma.multimediaFile.delete({
        where: {
          id,
        },
      });
    } catch (dbError) {
      console.error('[Multimedia Delete] Erreur lors de la suppression en base de données:', dbError);
      return NextResponse.json(
        {
          success: false,
          error: 'Erreur lors de la suppression de l\'enregistrement en base de données',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Fichier supprimé avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du fichier:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la suppression',
      },
      { status: 500 }
    );
  }
}
