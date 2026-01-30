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
    // IMPORTANT: S'assurer que React est résolu depuis kidoo-server/node_modules
    const rootNodeModules = path.resolve(__dirname, '../../node_modules');
    config.resolve.modules = [
      serverNodeModules,
      rootNodeModules, // Ajouter aussi la racine pour trouver React si hoisted
      'node_modules',
      ...(config.resolve.modules || []).filter(
        (mod: string) => mod !== serverNodeModules && mod !== rootNodeModules && mod !== 'node_modules'
      ),
    ];
    
    // Forcer la résolution de React depuis kidoo-server/node_modules
    // Cela garantit que Next.js trouve React même si npm workspaces l'a hoisted à la racine
    let reactResolved = false;
    
    // Essayer d'abord depuis kidoo-server/node_modules
    const reactLocalPath = path.join(serverNodeModules, 'react');
    if (fs.existsSync(reactLocalPath)) {
      const reactPackageJson = path.join(reactLocalPath, 'package.json');
      if (fs.existsSync(reactPackageJson)) {
        config.resolve.alias['react'] = reactLocalPath;
        // Résoudre react/jsx-runtime en utilisant require.resolve pour trouver le bon chemin
        try {
          const jsxRuntimePath = require.resolve('react/jsx-runtime', { paths: [serverNodeModules] });
          config.resolve.alias['react/jsx-runtime'] = jsxRuntimePath;
          // // console.log(`[Next.js Config] react/jsx-runtime résolu: ${jsxRuntimePath}`);
        } catch (err) {
          // Fallback: essayer les chemins possibles
          const possiblePaths = [
            path.join(reactLocalPath, 'jsx-runtime.js'),
            path.join(reactLocalPath, 'jsx-runtime'),
            path.join(reactLocalPath, 'jsx-runtime.mjs'),
          ];
          for (const possiblePath of possiblePaths) {
            if (fs.existsSync(possiblePath)) {
              config.resolve.alias['react/jsx-runtime'] = possiblePath;
              // console.log(`[Next.js Config] react/jsx-runtime trouvé: ${possiblePath}`);
              break;
            }
          }
        }
        
        try {
          const jsxDevRuntimePath = require.resolve('react/jsx-dev-runtime', { paths: [serverNodeModules] });
          config.resolve.alias['react/jsx-dev-runtime'] = jsxDevRuntimePath;
          // // console.log(`[Next.js Config] react/jsx-dev-runtime résolu: ${jsxDevRuntimePath}`);
        } catch (err) {
          const possiblePaths = [
            path.join(reactLocalPath, 'jsx-dev-runtime.js'),
            path.join(reactLocalPath, 'jsx-dev-runtime'),
            path.join(reactLocalPath, 'jsx-dev-runtime.mjs'),
          ];
          for (const possiblePath of possiblePaths) {
            if (fs.existsSync(possiblePath)) {
              config.resolve.alias['react/jsx-dev-runtime'] = possiblePath;
              // console.log(`[Next.js Config] react/jsx-dev-runtime trouvé: ${possiblePath}`);
              break;
            }
          }
        }
        // Ne pas utiliser // console.log dans la config Webpack lors du build
        // // console.log(`[Next.js Config] React résolu depuis kidoo-server: ${reactLocalPath}`);
        reactResolved = true;
      }
    }
    
    // Si pas trouvé localement, essayer depuis la racine
    if (!reactResolved) {
      const rootNodeModules = path.resolve(__dirname, '../../node_modules');
      const reactRootPath = path.join(rootNodeModules, 'react');
      if (fs.existsSync(reactRootPath)) {
        const reactPackageJson = path.join(reactRootPath, 'package.json');
        if (fs.existsSync(reactPackageJson)) {
          config.resolve.alias['react'] = reactRootPath;
          // Résoudre react/jsx-runtime depuis la racine
          try {
            const jsxRuntimePath = require.resolve('react/jsx-runtime', { paths: [rootNodeModules] });
            config.resolve.alias['react/jsx-runtime'] = jsxRuntimePath;
            // // console.log(`[Next.js Config] react/jsx-runtime résolu depuis racine: ${jsxRuntimePath}`);
          } catch (err) {
            const possiblePaths = [
              path.join(reactRootPath, 'jsx-runtime.js'),
              path.join(reactRootPath, 'jsx-runtime'),
              path.join(reactRootPath, 'jsx-runtime.mjs'),
            ];
            for (const possiblePath of possiblePaths) {
              if (fs.existsSync(possiblePath)) {
                config.resolve.alias['react/jsx-runtime'] = possiblePath;
                // // console.log(`[Next.js Config] react/jsx-runtime trouvé: ${possiblePath}`);
                break;
              }
            }
          }
          
          try {
            const jsxDevRuntimePath = require.resolve('react/jsx-dev-runtime', { paths: [rootNodeModules] });
            config.resolve.alias['react/jsx-dev-runtime'] = jsxDevRuntimePath;
            // // console.log(`[Next.js Config] react/jsx-dev-runtime résolu depuis racine: ${jsxDevRuntimePath}`);
          } catch (err) {
            const possiblePaths = [
              path.join(reactRootPath, 'jsx-dev-runtime.js'),
              path.join(reactRootPath, 'jsx-dev-runtime'),
              path.join(reactRootPath, 'jsx-dev-runtime.mjs'),
            ];
            for (const possiblePath of possiblePaths) {
              if (fs.existsSync(possiblePath)) {
                config.resolve.alias['react/jsx-dev-runtime'] = possiblePath;
                // // console.log(`[Next.js Config] react/jsx-dev-runtime trouvé: ${possiblePath}`);
                break;
              }
            }
          }
          // // console.log(`[Next.js Config] React résolu depuis la racine: ${reactRootPath}`);
          reactResolved = true;
        }
      }
    }
    
    if (!reactResolved) {
      // // console.error(`[Next.js Config] ERREUR: React non trouvé nulle part!`);
      // // console.error(`[Next.js Config] Cherché dans: ${serverNodeModules}`);
      // // console.error(`[Next.js Config] Cherché dans: ${path.resolve(__dirname, '../../node_modules')}`);
    }
    
    // Résoudre react-dom
    let reactDomResolved = false;
    const reactDomLocalPath = path.join(serverNodeModules, 'react-dom');
    if (fs.existsSync(reactDomLocalPath)) {
      const reactDomPackageJson = path.join(reactDomLocalPath, 'package.json');
      if (fs.existsSync(reactDomPackageJson)) {
        config.resolve.alias['react-dom'] = reactDomLocalPath;
        
        // Résoudre react-dom/client
        try {
          const reactDomClientPath = require.resolve('react-dom/client', { paths: [serverNodeModules] });
          config.resolve.alias['react-dom/client'] = reactDomClientPath;
          // // console.log(`[Next.js Config] react-dom/client résolu: ${reactDomClientPath}`);
        } catch (err) {
          const possiblePaths = [
            path.join(reactDomLocalPath, 'client.js'),
            path.join(reactDomLocalPath, 'client'),
            path.join(reactDomLocalPath, 'client.mjs'),
            path.join(reactDomLocalPath, 'client', 'index.js'),
          ];
          for (const possiblePath of possiblePaths) {
            if (fs.existsSync(possiblePath)) {
              config.resolve.alias['react-dom/client'] = possiblePath;
              // console.log(`[Next.js Config] react-dom/client trouvé: ${possiblePath}`);
              break;
            }
          }
        }
        
        // Résoudre react-dom/server
        try {
          const reactDomServerPath = require.resolve('react-dom/server', { paths: [serverNodeModules] });
          config.resolve.alias['react-dom/server'] = reactDomServerPath;
          // // console.log(`[Next.js Config] react-dom/server résolu: ${reactDomServerPath}`);
        } catch (err) {
          const possiblePaths = [
            path.join(reactDomLocalPath, 'server.js'),
            path.join(reactDomLocalPath, 'server'),
            path.join(reactDomLocalPath, 'server.mjs'),
            path.join(reactDomLocalPath, 'server', 'index.js'),
          ];
          for (const possiblePath of possiblePaths) {
            if (fs.existsSync(possiblePath)) {
              config.resolve.alias['react-dom/server'] = possiblePath;
              // console.log(`[Next.js Config] react-dom/server trouvé: ${possiblePath}`);
              break;
            }
          }
        }
        
        // // console.log(`[Next.js Config] React-dom résolu depuis kidoo-server: ${reactDomLocalPath}`);
        reactDomResolved = true;
      }
    }
    
    // Si pas trouvé localement, essayer depuis la racine
    if (!reactDomResolved) {
      const reactDomRootPath = path.join(rootNodeModules, 'react-dom');
      if (fs.existsSync(reactDomRootPath)) {
        const reactDomPackageJson = path.join(reactDomRootPath, 'package.json');
        if (fs.existsSync(reactDomPackageJson)) {
          config.resolve.alias['react-dom'] = reactDomRootPath;
          
          // Résoudre react-dom/client depuis la racine
          try {
            const reactDomClientPath = require.resolve('react-dom/client', { paths: [rootNodeModules] });
            config.resolve.alias['react-dom/client'] = reactDomClientPath;
            // // console.log(`[Next.js Config] react-dom/client résolu depuis racine: ${reactDomClientPath}`);
          } catch (err) {
            const possiblePaths = [
              path.join(reactDomRootPath, 'client.js'),
              path.join(reactDomRootPath, 'client'),
              path.join(reactDomRootPath, 'client.mjs'),
              path.join(reactDomRootPath, 'client', 'index.js'),
            ];
            for (const possiblePath of possiblePaths) {
              if (fs.existsSync(possiblePath)) {
                config.resolve.alias['react-dom/client'] = possiblePath;
                // // console.log(`[Next.js Config] react-dom/client trouvé: ${possiblePath}`);
                break;
              }
            }
          }
          
          // Résoudre react-dom/server depuis la racine
          try {
            const reactDomServerPath = require.resolve('react-dom/server', { paths: [rootNodeModules] });
            config.resolve.alias['react-dom/server'] = reactDomServerPath;
            // // console.log(`[Next.js Config] react-dom/server résolu depuis racine: ${reactDomServerPath}`);
          } catch (err) {
            const possiblePaths = [
              path.join(reactDomRootPath, 'server.js'),
              path.join(reactDomRootPath, 'server'),
              path.join(reactDomRootPath, 'server.mjs'),
              path.join(reactDomRootPath, 'server', 'index.js'),
            ];
            for (const possiblePath of possiblePaths) {
              if (fs.existsSync(possiblePath)) {
                config.resolve.alias['react-dom/server'] = possiblePath;
                // // console.log(`[Next.js Config] react-dom/server trouvé: ${possiblePath}`);
                break;
              }
            }
          }
          
          // // console.log(`[Next.js Config] React-dom résolu depuis la racine: ${reactDomRootPath}`);
          reactDomResolved = true;
        }
      }
    }
    
    if (!reactDomResolved) {
      // // console.error(`[Next.js Config] ERREUR: React-dom non trouvé nulle part!`);
    }
    
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
