/**
 * Routes API pour un Kidoo spécifique
 * GET /api/kidoos/[id] - Récupérer un kidoo par son ID
 * PUT /api/kidoos/[id] - Mettre à jour un kidoo
 * DELETE /api/kidoos/[id] - Supprimer un kidoo
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { updateKidooInputSchema } from '@/shared/schemas/kidoo';

/**
 * GET /api/kidoos/[id]
 * Récupère un kidoo par son ID
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

    // Récupérer le kidoo avec sa configuration Basic
    const kidoo = await prisma.kidoo.findUnique({
      where: { id },
      include: {
        configBasic: true,
      },
    });

    if (!kidoo) {
      return NextResponse.json(
        {
          success: false,
          error: 'Kidoo non trouvé',
        },
        { status: 404 }
      );
    }

    // Vérifier que le kidoo appartient à l'utilisateur
    if (kidoo.userId !== userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Accès non autorisé',
        },
        { status: 403 }
      );
    }

    // Convertir les dates en ISO strings et les BigInt en Number
    const kidooWithISOStrings = {
      ...kidoo,
      lastConnected: kidoo.lastConnected?.toISOString() || null,
      createdAt: kidoo.createdAt.toISOString(),
      updatedAt: kidoo.updatedAt.toISOString(),
      configBasic: kidoo.configBasic ? {
        ...kidoo.configBasic,
        storageTotalBytes: kidoo.configBasic.storageTotalBytes ? Number(kidoo.configBasic.storageTotalBytes) : null,
        storageFreeBytes: kidoo.configBasic.storageFreeBytes ? Number(kidoo.configBasic.storageFreeBytes) : null,
        storageUsedBytes: kidoo.configBasic.storageUsedBytes ? Number(kidoo.configBasic.storageUsedBytes) : null,
        createdAt: kidoo.configBasic.createdAt.toISOString(),
        updatedAt: kidoo.configBasic.updatedAt.toISOString(),
        storageLastUpdated: kidoo.configBasic.storageLastUpdated?.toISOString() || null,
      } : null,
    };

    return NextResponse.json({
      success: true,
      data: kidooWithISOStrings,
      message: 'Kidoo trouvé',
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du kidoo:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('Détails de l\'erreur:', {
      message: errorMessage,
      stack: errorStack,
      error,
    });
    
    return NextResponse.json(
      {
        success: false,
        error: 'Une erreur est survenue lors de la récupération du kidoo',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/kidoos/[id]
 * Met à jour un kidoo par son ID
 */
export async function PUT(
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
    const validationResult = updateKidooInputSchema.safeParse(body);
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

    // Préparer les données à mettre à jour
    const updateData: {
      name?: string;
      macAddress?: string | null;
      wifiSSID?: string | null;
      isConnected?: boolean;
      lastConnected?: Date | null;
    } = {};
    
    if (data.name !== undefined) {
      updateData.name = data.name;
    }
    if (data.macAddress !== undefined) {
      updateData.macAddress = data.macAddress;
    }
    if (data.wifiSSID !== undefined) {
      updateData.wifiSSID = data.wifiSSID;
    }

    // Mettre à jour le kidoo
    const updatedKidoo = await prisma.kidoo.update({
      where: { id },
      data: updateData,
    });

    // Convertir les dates en ISO strings
    const kidooWithISOStrings = {
      ...updatedKidoo,
      lastConnected: updatedKidoo.lastConnected?.toISOString() || null,
      createdAt: updatedKidoo.createdAt.toISOString(),
      updatedAt: updatedKidoo.updatedAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: kidooWithISOStrings,
      message: 'Kidoo mis à jour avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du kidoo:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    
    return NextResponse.json(
      {
        success: false,
        error: 'Une erreur est survenue lors de la mise à jour du kidoo',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/kidoos/[id]
 * Supprime un kidoo par son ID
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

    // Vérifier que le kidoo existe et appartient à l'utilisateur
    const existingKidoo = await prisma.kidoo.findUnique({
      where: { id },
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

    // Supprimer le kidoo
    await prisma.kidoo.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Kidoo supprimé avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du kidoo:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    
    return NextResponse.json(
      {
        success: false,
        error: 'Une erreur est survenue lors de la suppression du kidoo',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
