/**
 * Route API pour la configuration Basic d'un Kidoo
 * GET /api/kidoos/[id]/config-basic - Récupère la configuration Basic
 * PATCH /api/kidoos/[id]/config-basic - Met à jour la configuration Basic
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { publishKidooConfigUpdate } from '@/lib/mqtt';
import { z } from 'zod';

// Schéma de validation pour la mise à jour de la config Basic
const updateConfigBasicSchema = z.object({
  brightness: z.number().int().min(10).max(100).optional(),
  sleepTimeout: z.number().int().min(5000).max(300000).optional(),
  storageTotalBytes: z.number().int().nonnegative().nullable().optional(),
  storageFreeBytes: z.number().int().nonnegative().nullable().optional(),
  storageUsedBytes: z.number().int().nonnegative().nullable().optional(),
  storageFreePercent: z.number().int().min(0).max(100).nullable().optional(),
  storageUsedPercent: z.number().int().min(0).max(100).nullable().optional(),
});

/**
 * PATCH /api/kidoos/[id]/config-basic
 * Met à jour la configuration Basic d'un Kidoo
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

    // Récupérer le body de la requête
    const body = await request.json();

    // Valider les données avec le schéma
    const validationResult = updateConfigBasicSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Données invalides',
          field: validationResult.error.issues[0]?.path[0] as string,
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Vérifier que le kidoo existe et appartient à l'utilisateur
    const existingKidoo = await prisma.kidoo.findUnique({
      where: { id },
      include: { configBasic: true },
    });

    if (!existingKidoo) {
      return NextResponse.json(
        {
          success: false,
          error: 'Kidoo non trouvé',
        },
        { status: 404 }
      );
    }

    if (existingKidoo.userId !== userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Accès non autorisé',
        },
        { status: 403 }
      );
    }

    // Vérifier que c'est un modèle Basic
    if (existingKidoo.model.toLowerCase() !== 'basic') {
      return NextResponse.json(
        {
          success: false,
          error: 'Cette configuration est uniquement disponible pour les modèles Basic',
        },
        { status: 400 }
      );
    }

    // Préparer les données à mettre à jour
    const updateData: {
      brightness?: number;
      sleepTimeout?: number;
      storageTotalBytes?: bigint | null;
      storageFreeBytes?: bigint | null;
      storageUsedBytes?: bigint | null;
      storageFreePercent?: number | null;
      storageUsedPercent?: number | null;
      storageLastUpdated?: Date | null;
    } = {};

    if (data.brightness !== undefined) {
      updateData.brightness = data.brightness;
    }
    if (data.sleepTimeout !== undefined) {
      updateData.sleepTimeout = data.sleepTimeout;
    }
    if (data.storageTotalBytes !== undefined) {
      updateData.storageTotalBytes = data.storageTotalBytes !== null ? BigInt(data.storageTotalBytes) : null;
    }
    if (data.storageFreeBytes !== undefined) {
      updateData.storageFreeBytes = data.storageFreeBytes !== null ? BigInt(data.storageFreeBytes) : null;
    }
    if (data.storageUsedBytes !== undefined) {
      updateData.storageUsedBytes = data.storageUsedBytes !== null ? BigInt(data.storageUsedBytes) : null;
    }
    if (data.storageFreePercent !== undefined) {
      updateData.storageFreePercent = data.storageFreePercent;
    }
    if (data.storageUsedPercent !== undefined) {
      updateData.storageUsedPercent = data.storageUsedPercent;
    }
    
    // Si on met à jour les données de stockage, mettre à jour storageLastUpdated
    if (
      data.storageTotalBytes !== undefined ||
      data.storageFreeBytes !== undefined ||
      data.storageUsedBytes !== undefined ||
      data.storageFreePercent !== undefined ||
      data.storageUsedPercent !== undefined
    ) {
      updateData.storageLastUpdated = new Date();
    }

    // Créer ou mettre à jour la configuration Basic
    const configBasic = existingKidoo.configBasic
      ? await prisma.kidooConfigBasic.update({
          where: { kidooId: id },
          data: updateData,
        })
      : await prisma.kidooConfigBasic.create({
          data: {
            kidooId: id,
            brightness: data.brightness ?? 100,
            sleepTimeout: data.sleepTimeout ?? 30000,
            ...updateData,
          },
        });

    // Convertir les dates et BigInt en formats JSON-compatibles
    const configBasicWithISOStrings = {
      ...configBasic,
      storageTotalBytes: configBasic.storageTotalBytes ? Number(configBasic.storageTotalBytes) : null,
      storageFreeBytes: configBasic.storageFreeBytes ? Number(configBasic.storageFreeBytes) : null,
      storageUsedBytes: configBasic.storageUsedBytes ? Number(configBasic.storageUsedBytes) : null,
      createdAt: configBasic.createdAt.toISOString(),
      updatedAt: configBasic.updatedAt.toISOString(),
      storageLastUpdated: configBasic.storageLastUpdated?.toISOString() || null,
    };

    // Publier la mise à jour sur MQTT pour notifier l'ESP32 (si brightness ou sleepTimeout ont changé)
    // On fait ça en arrière-plan pour ne pas bloquer la réponse HTTP
    if (data.brightness !== undefined || data.sleepTimeout !== undefined) {
      publishKidooConfigUpdate(id, {
        brightness: configBasic.brightness,
        sleepTimeout: configBasic.sleepTimeout,
      }).catch((error) => {
        // Logger l'erreur mais ne pas faire échouer la requête HTTP
        console.error('[MQTT] Erreur lors de la publication MQTT (non bloquante):', error);
      });
    }

    return NextResponse.json({
      success: true,
      data: configBasicWithISOStrings,
      message: 'Configuration Basic mise à jour avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la configuration Basic:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    
    return NextResponse.json(
      {
        success: false,
        error: 'Une erreur est survenue lors de la mise à jour de la configuration Basic',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
