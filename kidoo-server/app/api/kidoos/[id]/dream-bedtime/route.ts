/**
 * Route API pour gérer la configuration de l'heure de coucher du modèle Dream
 * GET /api/kidoos/[id]/dream-bedtime - Récupère la configuration
 * PATCH /api/kidoos/[id]/dream-bedtime - Met à jour la configuration
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/withAuth';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-response';
import { updateDreamBedtimeConfigSchema, hexToRgb } from '@/shared';
import { Kidoo } from '@prisma/client';

/**
 * GET /api/kidoos/[id]/dream-bedtime
 * Récupère la configuration de l'heure de coucher
 */
export const GET = withAuth(async (
  request: AuthenticatedRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { userId } = request;
    const { id } = await params;

    // Vérifier que le Kidoo existe et appartient à l'utilisateur
    const kidoo = await prisma.kidoo.findUnique({
      where: { id },
      include: {
        configDream: true,
      },
    });

    if (!kidoo) {
      return createErrorResponse('NOT_FOUND', {
        message: 'Kidoo non trouvé',
      });
    }

    if (kidoo.userId !== userId) {
      return createErrorResponse('FORBIDDEN', {
        message: 'Accès non autorisé',
      });
    }

    // Vérifier que c'est un modèle Dream
    if (kidoo.model !== 'DREAM') {
      return createErrorResponse('BAD_REQUEST', {
        message: 'Cette configuration est uniquement disponible pour le modèle Dream',
      });
    }

    // Si pas de configuration, retourner les valeurs par défaut
    if (!kidoo.configDream) {
      return createSuccessResponse({
        hour: 22,
        minute: 0,
        colorR: 255,
        colorG: 107,
        colorB: 107,
        brightness: 50,
        nightlightAllNight: false,
      });
    }

    return createSuccessResponse({
      hour: kidoo.configDream.bedtimeHour,
      minute: kidoo.configDream.bedtimeMinute,
      colorR: kidoo.configDream.colorR,
      colorG: kidoo.configDream.colorG,
      colorB: kidoo.configDream.colorB,
      brightness: kidoo.configDream.brightness,
      nightlightAllNight: kidoo.configDream.allNight,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la configuration:', error);
    return createErrorResponse('INTERNAL_ERROR', {
      details: error instanceof Error ? error.message : undefined,
    });
  }
});

/**
 * PATCH /api/kidoos/[id]/dream-bedtime
 * Met à jour la configuration de l'heure de coucher
 */
export const PATCH = withAuth(async (
  request: AuthenticatedRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { userId } = request;
    const { id } = await params;

    // Récupérer et valider le body
    const body = await request.json();
    const validation = updateDreamBedtimeConfigSchema.safeParse(body);

    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return createErrorResponse('VALIDATION_ERROR', {
        message: firstError?.message || 'Données invalides',
        field: firstError?.path[0] as string,
        details: validation.error.issues,
      });
    }

    const { hour, minute, color: colorHex, brightness, nightlightAllNight } = validation.data;
    
    // Convertir la couleur hex en RGB
    const rgb = hexToRgb(colorHex);
    if (!rgb) {
      return createErrorResponse('VALIDATION_ERROR', {
        message: 'Couleur invalide',
        field: 'color',
      });
    }

    // Vérifier que le Kidoo existe et appartient à l'utilisateur
    const kidoo = await prisma.kidoo.findUnique({
      where: { id },
    });

    if (!kidoo) {
      return createErrorResponse('NOT_FOUND', {
        message: 'Kidoo non trouvé',
      });
    }

    if (kidoo.userId !== userId) {
      return createErrorResponse('FORBIDDEN', {
        message: 'Accès non autorisé',
      });
    }

    // Vérifier que c'est un modèle Dream
    if (kidoo.model !== 'DREAM') {
      return createErrorResponse('BAD_REQUEST', {
        message: 'Cette configuration est uniquement disponible pour le modèle Dream',
      });
    }

    // Mettre à jour ou créer la configuration
    const config = await prisma.kidooConfigDream.upsert({
      where: { kidooId: id },
      update: {
        bedtimeHour: hour,
        bedtimeMinute: minute,
        colorR: rgb.r,
        colorG: rgb.g,
        colorB: rgb.b,
        brightness,
        allNight: nightlightAllNight,
      },
      create: {
        kidooId: id,
        bedtimeHour: hour,
        bedtimeMinute: minute,
        colorR: rgb.r,
        colorG: rgb.g,
        colorB: rgb.b,
        brightness,
        allNight: nightlightAllNight,
      },
    });

    return createSuccessResponse(
      {
        hour: config.bedtimeHour,
        minute: config.bedtimeMinute,
        colorR: config.colorR,
        colorG: config.colorG,
        colorB: config.colorB,
        brightness: config.brightness,
        nightlightAllNight: config.allNight,
      },
      { message: 'Configuration de l\'heure de coucher mise à jour' }
    );
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la configuration:', error);
    return createErrorResponse('INTERNAL_ERROR', {
      details: error instanceof Error ? error.message : undefined,
    });
  }
});
