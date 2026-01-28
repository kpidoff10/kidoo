import type { NextConfig } from "next";
import path from "path";
import fs from "fs";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Configuration Webpack pour résoudre les modules externes (shared/)
  // Cette configuration est utilisée avec --webpack flag
  webpack: (config, { isServer }) => {
    // Ajouter un alias pour résoudre @/shared depuis le workspace npm
    // Avec npm workspaces, @kidoo/shared est disponible dans node_modules
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    
    // Essayer d'abord le workspace npm, puis le dossier parent (fallback pour dev local sans workspace)
    try {
      const workspaceShared = require.resolve('@kidoo/shared');
      config.resolve.alias['@/shared'] = path.dirname(workspaceShared);
    } catch {
      // Fallback vers le dossier parent si le workspace n'est pas disponible
      config.resolve.alias['@/shared'] = path.resolve(__dirname, '../shared');
    }
    
    // Résoudre @prisma/client-runtime-utils depuis kidoo-server/node_modules
    // car le client Prisma généré dans shared/ en a besoin
    const serverNodeModules = path.resolve(__dirname, 'node_modules');
    const runtimeUtilsPath = path.join(serverNodeModules, '@prisma/client-runtime-utils');
    
    if (fs.existsSync(runtimeUtilsPath)) {
      // Résoudre vers le package réel
      try {
        const resolvedPath = require.resolve('@prisma/client-runtime-utils', {
          paths: [serverNodeModules]
        });
        config.resolve.alias['@prisma/client-runtime-utils'] = resolvedPath;
      } catch {
        // Si require.resolve échoue, utiliser le chemin direct
        config.resolve.alias['@prisma/client-runtime-utils'] = runtimeUtilsPath;
      }
    }
    
    // Ajouter node_modules de kidoo-server en PRIORITÉ aux modules à résoudre
    // pour que les dépendances de shared/ puissent être trouvées
    config.resolve.modules = [
      serverNodeModules,
      'node_modules',
      ...(config.resolve.modules || []).filter(
        (mod: string) => mod !== serverNodeModules && mod !== 'node_modules'
      ),
    ];
    
    // Pour le serveur, s'assurer que les modules externes sont résolus depuis kidoo-server
    if (isServer) {
      config.externals = config.externals || [];
      // Ne pas externaliser @prisma/client-runtime-utils
      if (Array.isArray(config.externals)) {
        config.externals = config.externals.filter(
          (ext: string | RegExp) => ext !== '@prisma/client-runtime-utils'
        );
      }
    }
    
    return config;
  },
  
  // Note: Turbopack (utilisé par défaut) ne supporte pas bien les modules externes
  // Utilisez --webpack flag pour partager les fichiers depuis shared/
  // Configuration experimental.turbo n'est pas disponible dans Next.js 16
};

export default nextConfig;
