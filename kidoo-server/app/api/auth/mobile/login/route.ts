import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { loginSchema } from '@/shared';

/**
 * POST /api/auth/mobile/login
 * Authentification mobile avec retour d'informations utilisateur
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation des données
    const validationResult = loginSchema.safeParse(body);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return NextResponse.json(
        {
          success: false,
          error: firstError.message,
          field: firstError.path[0],
        },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    // Rechercher l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email ou mot de passe incorrect',
          field: 'credentials',
        },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email ou mot de passe incorrect',
          field: 'credentials',
        },
        { status: 401 }
      );
    }

    // Retourner les informations utilisateur (sans le mot de passe)
    return NextResponse.json({
      success: true,
      message: 'Connexion réussie',
      user: {
        id: user.id,
        email: user.email,
        name: user.name || '',
      },
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Une erreur est survenue lors de la connexion',
      },
      { status: 500 }
    );
  }
}
