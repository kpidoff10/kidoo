/**
 * Route API pour gérer la configuration de l'heure de coucher du modèle Dream
 * GET /api/kidoos/[id]/dream-bedtime - Récupère la configuration
 * PATCH /api/kidoos/[id]/dream-bedtime - Met à jour la configuration
 */

import { prisma } from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/withAuth';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-response';
import { updateDreamBedtimeConfigSchema, hexToRgb, saturateRgbToMax } from '@/shared';
import { sendCommand, isPubNubConfigured } from '@/lib/pubnub';

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
        configDream: {
          include: {
            bedtimeSchedules: true,
          },
        },
      },
    });

    if (!kidoo) {
      return createErrorResponse('NOT_FOUND', 404, {
        message: 'Kidoo non trouvé',
      });
    }

    if (kidoo.userId !== userId) {
      return createErrorResponse('FORBIDDEN', 403, {
        message: 'Accès non autorisé',
      });
    }

    // Vérifier que c'est un modèle Dream
    if (kidoo.model !== 'DREAM') {
      return createErrorResponse('BAD_REQUEST', 400, {
        message: 'Cette configuration est uniquement disponible pour le modèle Dream',
      });
    }

    // Si pas de configuration, retourner les valeurs par défaut (sans weekdaySchedule)
    if (!kidoo.configDream) {
      return createSuccessResponse({
        weekdaySchedule: undefined,
        colorR: 255,
        colorG: 107,
        colorB: 107,
        brightness: 50,
        nightlightAllNight: false,
      });
    }

    // Récupérer le schedule par jour depuis la table
    let weekdaySchedule: Record<string, { hour: number; minute: number; activated: boolean }> | undefined;
    if (kidoo.configDream.bedtimeSchedules && kidoo.configDream.bedtimeSchedules.length > 0) {
      weekdaySchedule = {};
      kidoo.configDream.bedtimeSchedules.forEach((schedule) => {
        weekdaySchedule![schedule.weekday] = {
          hour: schedule.hour,
          minute: schedule.minute,
          activated: schedule.activated,
        };
      });
    }

    return createSuccessResponse({
      weekdaySchedule,
      colorR: kidoo.configDream.colorR,
      colorG: kidoo.configDream.colorG,
      colorB: kidoo.configDream.colorB,
      brightness: kidoo.configDream.brightness,
      nightlightAllNight: kidoo.configDream.allNight,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la configuration:', error);
    return createErrorResponse('INTERNAL_ERROR', 500, {
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
    console.log('[DREAM-BEDTIME] Body reçu:', JSON.stringify(body, null, 2));
    const validation = updateDreamBedtimeConfigSchema.safeParse(body);

    if (!validation.success) {
      console.error('[DREAM-BEDTIME] Erreur de validation:', JSON.stringify(validation.error.issues, null, 2));
      const firstError = validation.error.issues[0];
      return createErrorResponse('VALIDATION_ERROR', 400, {
        message: firstError?.message || 'Données invalides',
        field: firstError?.path[0] as string,
        details: validation.error.issues,
      });
    }

    const { weekdaySchedule, color: colorHex, brightness, nightlightAllNight } = validation.data;
    
    // Convertir la couleur hex en RGB et saturer à 100% pour une couleur "profonde"
    const rgb = hexToRgb(colorHex);
    if (!rgb) {
      return createErrorResponse('VALIDATION_ERROR', 400, {
        message: 'Couleur invalide',
        field: 'color',
      });
    }
    
    // Saturer la couleur à 100% pour qu'elle soit "profonde" (ex: rouge = 100% rouge)
    const saturatedRgb = saturateRgbToMax(rgb);

    // Vérifier que le Kidoo existe et appartient à l'utilisateur
    const kidoo = await prisma.kidoo.findUnique({
      where: { id },
    });

    if (!kidoo) {
      return createErrorResponse('NOT_FOUND', 404, {
        message: 'Kidoo non trouvé',
      });
    }

    if (kidoo.userId !== userId) {
      return createErrorResponse('FORBIDDEN', 403, {
        message: 'Accès non autorisé',
      });
    }

    // Vérifier que c'est un modèle Dream
    if (kidoo.model !== 'DREAM') {
      return createErrorResponse('BAD_REQUEST', 400, {
        message: 'Cette configuration est uniquement disponible pour le modèle Dream',
      });
    }

    // Préparer les données de mise à jour
    const updateData = {
      colorR: saturatedRgb.r,
      colorG: saturatedRgb.g,
      colorB: saturatedRgb.b,
      brightness,
      allNight: nightlightAllNight,
    };

    // Mettre à jour ou créer la configuration
    const config = await prisma.kidooConfigDream.upsert({
      where: { kidooId: id },
      update: updateData,
      create: {
        kidooId: id,
        ...updateData,
      },
      include: {
        bedtimeSchedules: true,
      },
    });

    // Mettre à jour les schedules par jour
    if (weekdaySchedule && Object.keys(weekdaySchedule).length > 0) {
      // Supprimer tous les schedules existants pour ce config
      await prisma.kidooConfigDreamBedtimeSchedule.deleteMany({
        where: { kidooConfigDreamId: config.id },
      });

      // Créer les nouveaux schedules
      await prisma.kidooConfigDreamBedtimeSchedule.createMany({
        data: Object.entries(weekdaySchedule).map(([weekday, time]) => ({
          kidooConfigDreamId: config.id,
          weekday,
          hour: time.hour,
          minute: time.minute,
          activated: time.activated ?? true,
        })),
      });
    } else {
      // Si weekdaySchedule est vide ou undefined, supprimer tous les schedules existants
      await prisma.kidooConfigDreamBedtimeSchedule.deleteMany({
        where: { kidooConfigDreamId: config.id },
      });
    }

    // Récupérer les schedules mis à jour après les modifications
    const updatedSchedules = await prisma.kidooConfigDreamBedtimeSchedule.findMany({
      where: { kidooConfigDreamId: config.id },
    });

    // Construire le schedule pour la réponse
    let responseWeekdaySchedule: Record<string, { hour: number; minute: number; activated: boolean }> | undefined;
    if (updatedSchedules.length > 0) {
      responseWeekdaySchedule = {};
      updatedSchedules.forEach((schedule) => {
        responseWeekdaySchedule![schedule.weekday] = {
          hour: schedule.hour,
          minute: schedule.minute,
          activated: schedule.activated,
        };
      });
    }

    // Récupérer la config mise à jour pour la réponse (incluant les schedules)
    const updatedConfig = await prisma.kidooConfigDream.findUnique({
      where: { id: config.id },
      include: {
        bedtimeSchedules: true,
      },
    });

    if (!updatedConfig) {
      return createErrorResponse('INTERNAL_ERROR', 500, {
        message: 'Erreur lors de la récupération de la configuration mise à jour',
      });
    }

    // Envoyer la configuration à l'ESP32 via PubNub
    if (kidoo.macAddress && isPubNubConfigured()) {
      try {
        // Construire les paramètres PubNub avec la configuration
        const params: Record<string, unknown> = {
          colorR: updatedConfig.colorR,
          colorG: updatedConfig.colorG,
          colorB: updatedConfig.colorB,
          brightness: updatedConfig.brightness,
          allNight: updatedConfig.allNight,
        };

        // Ajouter weekdaySchedule si présent
        if (responseWeekdaySchedule && Object.keys(responseWeekdaySchedule).length > 0) {
          params.weekdaySchedule = responseWeekdaySchedule;
        }

        const pubnubMessage: Record<string, unknown> = {
          action: 'set-bedtime-config',
          params,
        };

        console.log('[DREAM-BEDTIME] Envoi configuration via PubNub:', JSON.stringify(pubnubMessage, null, 2));
        await sendCommand(kidoo.macAddress, 'set-bedtime-config', params);
        console.log('[DREAM-BEDTIME] Configuration envoyée avec succès via PubNub');
      } catch (error) {
        console.error('[DREAM-BEDTIME] Erreur lors de l\'envoi PubNub:', error);
        // Ne pas faire échouer la requête si PubNub échoue, la config est déjà en base
      }
    } else {
      if (!kidoo.macAddress) {
        console.warn('[DREAM-BEDTIME] Adresse MAC manquante, impossible d\'envoyer via PubNub');
      }
      if (!isPubNubConfigured()) {
        console.warn('[DREAM-BEDTIME] PubNub non configuré, impossible d\'envoyer la configuration');
      }
    }

    return createSuccessResponse(
      {
        weekdaySchedule: responseWeekdaySchedule,
        colorR: updatedConfig.colorR,
        colorG: updatedConfig.colorG,
        colorB: updatedConfig.colorB,
        brightness: updatedConfig.brightness,
        nightlightAllNight: updatedConfig.allNight,
      },
      { message: 'Configuration de l\'heure de coucher mise à jour' }
    );
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la configuration:', error);
    return createErrorResponse('INTERNAL_ERROR', 500, {
      details: error instanceof Error ? error.message : undefined,
    });
  }
});
