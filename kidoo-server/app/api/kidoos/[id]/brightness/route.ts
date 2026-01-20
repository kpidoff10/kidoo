/**
 * Route API pour modifier la luminosité d'un Kidoo
 * PATCH /api/kidoos/[id]/commands/common/brightness
 * 
 * Body: { "value": 80 }
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { sendCommand, isPubNubConfigured } from '@/lib/pubnub';
import { brightnessCommandSchema } from '@/shared/schemas/api/kidoos/brightness';
import { Kidoo } from '@prisma/client';

/**
 * PATCH/POST /api/kidoos/[id]/commands/common/brightness
 * Modifie la luminosité d'un Kidoo
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: Kidoo['id'] }> }
) {
  try {
    // Vérifier l'authentification
    const authResult = requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const { userId } = authResult;
    const { id } = await params;

    // Récupérer et valider le body
    const body = await request.json();
    const validation = brightnessCommandSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'La luminosité doit être un nombre entre 10 et 100',
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { value } = validation.data;

    // Vérifier que le Kidoo existe et appartient à l'utilisateur
    const kidoo = await prisma.kidoo.findUnique({
      where: { id },
    });

    if (!kidoo) {
      return NextResponse.json(
        { success: false, error: 'Kidoo non trouvé' },
        { status: 404 }
      );
    }

    if (kidoo.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Vérifier que le Kidoo a une adresse MAC
    if (!kidoo.macAddress) {
      return NextResponse.json(
        { success: false, error: 'Kidoo non configuré (adresse MAC manquante)' },
        { status: 400 }
      );
    }

    // Vérifier PubNub
    if (!isPubNubConfigured()) {
      return NextResponse.json(
        { success: false, error: 'PubNub non configuré sur le serveur' },
        { status: 503 }
      );
    }

    // Envoyer la commande via PubNub
    const sent = await sendCommand(kidoo.macAddress, 'brightness', { value });

    if (!sent) {
      return NextResponse.json(
        { success: false, error: 'Échec de l\'envoi de la commande au Kidoo' },
        { status: 502 }
      );
    }

    // Mettre à jour la config en base (si modèle Basic)
    await prisma.kidoo.update({
      where: { id: kidoo.id },
      data: { brightness: value },
    });

    return NextResponse.json({
      success: true,
      data: { brightness: value },
      message: `Luminosité définie à ${value}%`,
    });
  } catch (error) {
    console.error('Erreur lors de la modification de la luminosité:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';

    return NextResponse.json(
      {
        success: false,
        error: 'Une erreur est survenue',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
