/**
 * Route API pour vérifier si un tag existe déjà
 * GET /api/tags/check?tagId=xxx&uid=xxx&kidooId=xxx - Vérifier si un tagId ou UID existe déjà
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';

/**
 * GET /api/tags/check
 * Vérifie si un tagId ou UID existe déjà
 */
export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const authResult = requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const { searchParams } = new URL(request.url);
    const tagId = searchParams.get('tagId');
    const uid = searchParams.get('uid');
    const kidooId = searchParams.get('kidooId');

    if (!tagId && !uid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Au moins un paramètre tagId ou uid est requis',
          errorCode: 'TAG_CHECK_MISSING_PARAMS',
        },
        { status: 400 }
      );
    }

    const results: {
      tagIdExists: boolean;
      uidExists: boolean;
      errorCode?: string;
    } = {
      tagIdExists: false,
      uidExists: false,
    };

    // Vérifier si le tagId existe déjà
    if (tagId) {
      const existingTagById = await prisma.tag.findFirst({
        where: {
          tagId,
        },
        select: {
          id: true,
          tagId: true,
        },
      });
      results.tagIdExists = !!existingTagById;
      if (results.tagIdExists) {
        results.errorCode = 'TAG_ID_ALREADY_EXISTS';
      }
    }

    // Vérifier si l'UID existe déjà pour ce Kidoo
    if (uid && kidooId) {
      const existingTagByUid = await prisma.tag.findFirst({
        where: {
          uid,
          kidooId,
        },
        select: {
          id: true,
          uid: true,
        },
      });
      results.uidExists = !!existingTagByUid;
      if (results.uidExists) {
        results.errorCode = 'TAG_UID_ALREADY_EXISTS';
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('Erreur lors de la vérification du tag:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Une erreur est survenue lors de la vérification du tag',
      },
      { status: 500 }
    );
  }
}
