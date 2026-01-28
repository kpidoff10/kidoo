/**
 * Route API pour gérer la configuration du sleep mode
 * GET /api/kidoos/[id]/sleep-mode - Récupère la configuration
 * PATCH /api/kidoos/[id]/sleep-mode - Met à jour la configuration
 */

import { prisma } from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/withAuth';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-response';
import { sleepModeConfigSchema } from '@/shared';
import { sendCommand, isPubNubConfigured } from '@/lib/pubnub';

/**
 * GET /api/kidoos/[id]/sleep-mode
 * Récupère la configuration du sleep mode
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

    // Si pas de configuration, retourner les valeurs par défaut (couleur noire)
    if (kidoo.sleepColorR === null || kidoo.sleepColorG === null || kidoo.sleepColorB === null) {
      return createSuccessResponse({
        type: 'color',
        color: {
          r: 0,
          g: 0,
          b: 0,
        },
      });
    }

    // Si un effet est configuré (sleepEffect !== null && !== 0)
    if (kidoo.sleepEffect !== null && kidoo.sleepEffect > 0) {
      return createSuccessResponse({
        type: 'effect',
        effect: kidoo.sleepEffect,
      });
    }

    // Sinon, couleur unie
    return createSuccessResponse({
      type: 'color',
      color: {
        r: kidoo.sleepColorR ?? 0,
        g: kidoo.sleepColorG ?? 0,
        b: kidoo.sleepColorB ?? 0,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la configuration:', error);
    return createErrorResponse('INTERNAL_ERROR', 500, {
      details: error instanceof Error ? error.message : undefined,
    });
  }
});

/**
 * PATCH /api/kidoos/[id]/sleep-mode
 * Met à jour la configuration du sleep mode
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
    console.log('[SLEEP-MODE] Body reçu:', JSON.stringify(body, null, 2));
    const validation = sleepModeConfigSchema.safeParse(body);

    if (!validation.success) {
      console.error('[SLEEP-MODE] Erreur de validation:', JSON.stringify(validation.error.issues, null, 2));
      const firstError = validation.error.issues[0];
      return createErrorResponse('VALIDATION_ERROR', 400, {
        message: firstError?.message || 'Données invalides',
        field: firstError?.path[0] as string,
        details: validation.error.issues,
      });
    }

    const { type, color, effect } = validation.data;

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

    // Préparer les données de mise à jour
    const updateData: {
      sleepColorR?: number | null;
      sleepColorG?: number | null;
      sleepColorB?: number | null;
      sleepEffect?: number | null;
    } = {};

    if (type === 'color' && color) {
      updateData.sleepColorR = color.r;
      updateData.sleepColorG = color.g;
      updateData.sleepColorB = color.b;
      updateData.sleepEffect = 0; // LED_EFFECT_NONE
    } else if (type === 'effect' && effect !== undefined) {
      updateData.sleepColorR = null;
      updateData.sleepColorG = null;
      updateData.sleepColorB = null;
      updateData.sleepEffect = effect;
    }

    // Mettre à jour le Kidoo
    const updatedKidoo = await prisma.kidoo.update({
      where: { id },
      data: updateData,
    });

    // Envoyer la commande via PubNub si configuré
    if (isPubNubConfigured() && kidoo.macAddress) {
      try {
        // Construire la commande pour l'ESP32
        const command: any = {
          type: 'sleep-mode-config',
        };

        if (type === 'color' && color) {
          command.colorR = color.r;
          command.colorG = color.g;
          command.colorB = color.b;
          command.effect = 0; // LED_EFFECT_NONE
        } else if (type === 'effect' && effect !== undefined) {
          command.colorR = 0;
          command.colorG = 0;
          command.colorB = 0;
          command.effect = effect;
        }

        await sendCommand(kidoo.macAddress, command);
        console.log('[SLEEP-MODE] Commande envoyée via PubNub:', JSON.stringify(command, null, 2));
      } catch (pubnubError) {
        console.error('[SLEEP-MODE] Erreur lors de l\'envoi de la commande PubNub:', pubnubError);
        // Ne pas échouer la requête si PubNub échoue, la config est quand même sauvegardée
      }
    }

    // Construire la réponse
    const response: {
      type: 'color' | 'effect';
      color?: { r: number; g: number; b: number };
      effect?: number;
    } = {
      type,
    };

    if (type === 'color' && color) {
      response.color = color;
    } else if (type === 'effect' && effect !== undefined) {
      response.effect = effect;
    }

    return createSuccessResponse(response);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la configuration:', error);
    return createErrorResponse('INTERNAL_ERROR', 500, {
      details: error instanceof Error ? error.message : undefined,
    });
  }
});
