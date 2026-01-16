/**
 * Route API pour l'upload de fichiers multimédias (audio)
 * POST /api/multimedia/upload
 * 
 * Utilise Cloudflare R2 pour le stockage cloud des fichiers
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { r2Client, MULTIMEDIA_BUCKET, getFileUrl } from '@/lib/r2';
import { prisma } from '@/lib/prisma';
import { PutObjectCommand } from '@aws-sdk/client-s3';

// Types MIME acceptés pour les fichiers audio
const ALLOWED_MIME_TYPES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/wave',
  'audio/x-wav',
  'audio/mp4',
  'audio/m4a',
  'audio/aac',
  'audio/ogg',
  'audio/webm',
];

// Taille maximale du fichier (10 MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * POST /api/multimedia/upload
 * Upload un fichier audio
 */
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const authResult = requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const { userId } = authResult;

    // Récupérer le FormData
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const tagId = formData.get('tagId') as string | null;
    const kidooId = formData.get('kidooId') as string | null;

    // Décoder le nom du fichier si nécessaire (gère l'encodage URL)
    let decodedFileName = file?.name || '';
    try {
      // Si le nom contient des caractères encodés en URL, les décoder
      if (decodedFileName.includes('%')) {
        decodedFileName = decodeURIComponent(decodedFileName);
      }
    } catch (error) {
      console.warn('[Multimedia Upload] Erreur lors du décodage du nom de fichier, utilisation du nom original:', error);
      // Garder le nom original si le décodage échoue
    }

    // Vérifier que le fichier est présent
    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: 'Aucun fichier fourni',
          field: 'file',
        },
        { status: 400 }
      );
    }

    // Vérifier le type MIME
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Type de fichier non autorisé. Types acceptés: ${ALLOWED_MIME_TYPES.join(', ')}`,
          field: 'file',
        },
        { status: 400 }
      );
    }

    // Vérifier la taille du fichier
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `Fichier trop volumineux. Taille maximale: ${MAX_FILE_SIZE / 1024 / 1024} MB`,
          field: 'file',
        },
        { status: 400 }
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

    // Vérifier que kidooId et tagId sont présents
    if (!kidooId || !tagId) {
      return NextResponse.json(
        {
          success: false,
          error: 'kidooId et tagId sont requis pour l\'upload',
          field: 'kidooId',
        },
        { status: 400 }
      );
    }

    // Vérifier que le tag existe et appartient à l'utilisateur
    const tag = await prisma.tag.findFirst({
      where: {
        tagId: tagId, // tagId est l'UUID du tag
        userId,
        kidooId,
      },
    });

    if (!tag) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tag non trouvé ou vous n\'avez pas les permissions',
          field: 'tagId',
        },
        { status: 404 }
      );
    }

    // Générer un nom de fichier unique
    // Chemin: kidooId/tagId/filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = decodedFileName.split('.').pop() || 'mp3';
    const filePath = `${kidooId}/${tagId}/${timestamp}_${randomString}.${fileExtension}`;

    // Convertir le fichier en buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload vers Cloudflare R2
    try {
      const command = new PutObjectCommand({
        Bucket: MULTIMEDIA_BUCKET,
        Key: filePath,
        Body: buffer,
        ContentType: file.type,
        // Métadonnées optionnelles
        Metadata: {
          userId,
          originalName: decodedFileName,
          uploadedAt: new Date().toISOString(),
          ...(tagId && { tagId }),
        },
      });

      await r2Client.send(command);

      // Générer l'URL publique du fichier
      const fileUrl = await getFileUrl(filePath);

      // Sauvegarder les métadonnées dans la base de données
      const fileName = filePath.split('/').pop() || decodedFileName;
      
      // Calculer l'ordre : récupérer le nombre de fichiers existants pour ce tag
      const existingFilesCount = await prisma.multimediaFile.count({
        where: {
          tagId: tag.id,
          userId,
        },
      });
      
      let multimediaFile;
      
      try {
        multimediaFile = await prisma.multimediaFile.create({
          data: {
            tagId: tag.id, // Utiliser l'id du tag (clé primaire), pas le tagId (UUID)
            userId,
            url: fileUrl,
            path: filePath,
            fileName,
            originalName: decodedFileName,
            size: file.size,
            mimeType: file.type,
            order: existingFilesCount, // Nouveau fichier à la fin de la liste
          },
        });
      } catch (dbError) {
        console.error('[Multimedia Upload] Erreur lors de l\'enregistrement en base de données:', dbError);
        // Le fichier a été uploadé vers R2 mais l'enregistrement en base a échoué
        // TODO: Optionnellement, supprimer le fichier de R2 ici pour éviter les orphelins
        return NextResponse.json(
          {
            success: false,
            error: 'Le fichier a été uploadé mais l\'enregistrement en base de données a échoué',
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          id: multimediaFile.id,
          url: fileUrl,
          path: filePath,
          fileName,
          size: file.size,
          mimeType: file.type,
          tagId: tagId, // Retourner le tagId (UUID) pour compatibilité avec l'app
          createdAt: multimediaFile.createdAt.toISOString(),
        },
        message: 'Fichier uploadé avec succès',
      });
    } catch (uploadError) {
      console.error('[Multimedia Upload] Erreur R2:', uploadError);
      return NextResponse.json(
        {
          success: false,
          error: `Erreur lors de l'upload: ${uploadError instanceof Error ? uploadError.message : 'Erreur inconnue'}`,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Erreur lors de l\'upload du fichier:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'upload',
      },
      { status: 500 }
    );
  }
}
