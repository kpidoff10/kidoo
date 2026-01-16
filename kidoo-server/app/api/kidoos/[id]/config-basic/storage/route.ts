/**
 * Route API pour récupérer les données de stockage d'un Kidoo Basic
 * GET /api/kidoos/[id]/config-basic/storage - Récupère uniquement les données de stockage
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';

/**
 * GET /api/kidoos/[id]/config-basic/storage
 * Récupère uniquement les données de stockage d'un Kidoo Basic
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
          error: 'Cette route est uniquement disponible pour les modèles Basic',
        },
        { status: 400 }
      );
    }

    // Récupérer uniquement les données de stockage depuis configBasic
    const configBasic = existingKidoo.configBasic;

    if (!configBasic) {
      return NextResponse.json({
        success: true,
        data: {
          totalBytes: null,
          freeBytes: null,
          usedBytes: null,
          freePercent: null,
          usedPercent: null,
          storageLastUpdated: null,
        },
        message: 'Aucune donnée de stockage disponible',
      });
    }

    // Convertir les BigInt en Number et les dates en ISO strings
    const storageData = {
      totalBytes: configBasic.storageTotalBytes ? Number(configBasic.storageTotalBytes) : null,
      freeBytes: configBasic.storageFreeBytes ? Number(configBasic.storageFreeBytes) : null,
      usedBytes: configBasic.storageUsedBytes ? Number(configBasic.storageUsedBytes) : null,
      freePercent: configBasic.storageFreePercent,
      usedPercent: configBasic.storageUsedPercent,
      storageLastUpdated: configBasic.storageLastUpdated?.toISOString() || null,
    };

    return NextResponse.json({
      success: true,
      data: storageData,
      message: 'Données de stockage récupérées avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des données de stockage:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    
    return NextResponse.json(
      {
        success: false,
        error: 'Une erreur est survenue lors de la récupération des données de stockage',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
