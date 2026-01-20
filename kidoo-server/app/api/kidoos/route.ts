/**
 * Routes API pour les Kidoos
 * GET /api/kidoos - Récupérer tous les kidoos de l'utilisateur connecté
 * POST /api/kidoos - Créer un nouveau kidoo
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createKidooInputSchema } from '@/shared/schemas/kidoo';
import { requireAuth } from '@/lib/auth-helpers';

/**
 * GET /api/kidoos
 * Récupère tous les kidoos de l'utilisateur connecté
 */
export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const authResult = requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const { userId } = authResult;

    // Récupérer les kidoos de l'utilisateur
    const kidoos = await prisma.kidoo.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Convertir les dates en ISO strings pour la compatibilité JSON
    const kidoosWithISOStrings = kidoos.map((kidoo) => ({
      ...kidoo,
      lastConnected: kidoo.lastConnected?.toISOString() || null,
      createdAt: kidoo.createdAt.toISOString(),
      updatedAt: kidoo.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: kidoosWithISOStrings,
      message: `${kidoos.length} kidoo(s) trouvé(s)`,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des kidoos:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Une erreur est survenue lors de la récupération des kidoos',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/kidoos
 * Crée un nouveau kidoo pour l'utilisateur connecté
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Vérifier l'authentification
    const authResult = requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const { userId } = authResult;

    // Validation des données
    const validationResult = createKidooInputSchema.safeParse(body);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return NextResponse.json(
        {
          success: false,
          error: firstError.message,
          field: firstError.path[0] as string,
        },
        { status: 400 }
      );
    }

    const { name, model, deviceId, macAddress, firmwareVersion } = validationResult.data;

    // Vérifier si un kidoo avec ce deviceId existe déjà
    const existingKidoo = await prisma.kidoo.findUnique({
      where: { deviceId },
    });

    if (existingKidoo) {
      // Si le kidoo appartient déjà à cet utilisateur, retourner celui-ci
      if (existingKidoo.userId === userId) {
        return NextResponse.json(
          {
            success: false,
            error: 'Ce Kidoo est déjà enregistré dans votre compte',
            field: 'deviceId',
          },
          { status: 409 }
        );
      }

      // Sinon, erreur car le deviceId est déjà utilisé par un autre utilisateur
      return NextResponse.json(
        {
          success: false,
          error: 'Ce Kidoo est déjà enregistré par un autre utilisateur',
          field: 'deviceId',
        },
        { status: 409 }
      );
    }

    // Créer le nouveau kidoo
    const newKidoo = await prisma.kidoo.create({
      data: {
        name,
        model: model || 'classic', // Utiliser le modèle fourni ou 'classic' par défaut
        deviceId,
        macAddress: macAddress || null,
        firmwareVersion: firmwareVersion || null,
        userId,
        isConnected: false,
        isSynced: true, // Marqué comme synchronisé avec le serveur
      },
    });

    // Convertir les dates en ISO strings
    const kidooWithISOStrings = {
      ...newKidoo,
      lastConnected: newKidoo.lastConnected?.toISOString() || null,
      createdAt: newKidoo.createdAt.toISOString(),
      updatedAt: newKidoo.updatedAt.toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        data: kidooWithISOStrings,
        message: 'Kidoo créé avec succès',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur lors de la création du kidoo:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Une erreur est survenue lors de la création du kidoo',
      },
      { status: 500 }
    );
  }
}
