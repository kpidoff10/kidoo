import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Proxy pour gérer les requêtes réseau
 * 
 * Dans Next.js 16, la convention "middleware" a été remplacée par "proxy"
 * pour clarifier le rôle du fichier en tant qu'intermédiaire réseau.
 * 
 * Ce proxy gère :
 * - Les routes publiques (pas de vérification d'auth)
 * - Les routes API mobiles (authentification mobile)
 * - Les routes statiques et assets
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Routes publiques (pas de vérification d'auth nécessaire)
  const publicRoutes = [
    '/auth/signin',
    '/auth/signup',
    '/auth/signout',
    '/api/auth',
    '/api/auth/register',
    '/api/auth/mobile',
  ];
  
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  
  // Routes API mobiles publiques (authentification mobile)
  const isMobileAuthRoute = pathname.startsWith('/api/auth/mobile');

  // Routes statiques et assets
  const isStaticRoute =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|css|js)$/);

  // Pour les routes publiques et les routes statiques, pas de vérification
  if (isPublicRoute || isMobileAuthRoute || isStaticRoute) {
    return NextResponse.next();
  }

  // Pour les autres routes, laisser NextAuth gérer l'authentification via ses handlers
  // Le middleware NextAuth sera appliqué automatiquement via les route handlers
  return NextResponse.next();
}

// Configuration du matcher pour optimiser les performances
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
  // Note: Le proxy s'exécute toujours dans le runtime Node.js dans Next.js 16
  // La configuration runtime n'est plus nécessaire ici
};
