import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Configuration Webpack pour résoudre les modules externes (shared/)
  // Cette configuration est utilisée avec --webpack flag
  webpack: (config) => {
    // Ajouter un alias pour résoudre @/shared depuis le dossier shared/
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias['@/shared'] = path.resolve(__dirname, '../shared');
    
    // Résoudre @prisma/client-runtime-utils depuis kidoo-server/node_modules
    // car le client Prisma généré dans shared/ en a besoin
    config.resolve.alias['@prisma/client-runtime-utils'] = path.resolve(
      __dirname,
      'node_modules/@prisma/client-runtime-utils'
    );
    
    // Ajouter node_modules de kidoo-server aux modules à résoudre
    // pour que les dépendances de shared/ puissent être trouvées
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      path.resolve(__dirname, 'node_modules'),
    ];
    
    return config;
  },
  
  // Note: Turbopack (utilisé par défaut) ne supporte pas bien les modules externes
  // Utilisez --webpack flag pour partager les fichiers depuis shared/
  // Configuration experimental.turbo n'est pas disponible dans Next.js 16
};

export default nextConfig;
