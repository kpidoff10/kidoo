// Configuration Metro pour monorepo - Racine
// Utilise la configuration de kidoo-app mais ajuste projectRoot

const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const fs = require('fs');

const monorepoRoot = __dirname;
const kidooAppRoot = path.resolve(monorepoRoot, 'kidoo-app');

const config = getDefaultConfig(kidooAppRoot);

// Add shared packages to watchFolders
config.watchFolders = [monorepoRoot];

// Ensure Metro resolves packages from the monorepo
config.resolver.nodeModulesPaths = [
  path.resolve(kidooAppRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// Configurer les alias pour @shared et @/
config.resolver.alias = {
  ...config.resolver?.alias,
  '@shared': path.resolve(monorepoRoot, 'shared/index.ts'),
  '@/shared': path.resolve(monorepoRoot, 'shared/index.ts'),
  // Alias @/ pour pointer vers kidoo-app/src/
  '@': path.resolve(kidooAppRoot, 'src'),
  '@/': path.resolve(kidooAppRoot, 'src'),
};

// Résolution personnalisée pour AppEntry.js et les alias @/
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Si AppEntry.js cherche ../../App depuis node_modules/expo/
  if (
    moduleName === '../../App' &&
    context.originModulePath &&
    context.originModulePath.includes('node_modules/expo/AppEntry.js')
  ) {
    // Résoudre vers App.tsx à la racine du monorepo
    const appPath = path.resolve(monorepoRoot, 'App');
    const extensions = ['tsx', 'ts', 'jsx', 'js'];
    for (const ext of extensions) {
      const fullPath = `${appPath}.${ext}`;
      if (fs.existsSync(fullPath)) {
        return {
          filePath: fullPath,
          type: 'sourceFile',
        };
      }
    }
  }

  // Résoudre les imports vers kidoo-app/ depuis la racine du monorepo
  // Ex: ./kidoo-app/src/App, ./kidoo-app/index, etc.
  if (moduleName.startsWith('./kidoo-app/') || moduleName.startsWith('../kidoo-app/')) {
    const relativePath = moduleName.replace(/^(\.\.?\/)+kidoo-app\//, '');
    const correctPath = path.resolve(kidooAppRoot, relativePath);
    const extensions = ['tsx', 'ts', 'jsx', 'js', 'json'];
    
    // Essayer d'abord comme fichier avec extension
    for (const ext of extensions) {
      const fullPath = `${correctPath}.${ext}`;
      if (fs.existsSync(fullPath)) {
        return {
          filePath: fullPath,
          type: 'sourceFile',
        };
      }
    }
    
    // Essayer aussi comme répertoire avec index
    for (const ext of extensions) {
      const fullPath = path.join(correctPath, `index.${ext}`);
      if (fs.existsSync(fullPath)) {
        return {
          filePath: fullPath,
          type: 'sourceFile',
        };
      }
    }
  }

  // Corriger tous les chemins ../src/ (quel que soit le nombre de ../) qui pointent vers kidoo-app/src/
  // Cela se produit quand Babel transforme @/theme en ../../src/theme, @/api en ../../../src/api, etc.
  // Pattern: un ou plusieurs ../ suivis de src/
  const srcPathMatch = moduleName.match(/^(\.\.\/)+src\/(.+)$/);
  if (srcPathMatch) {
    const relativePath = srcPathMatch[2]; // Le chemin après src/
    const correctPath = path.resolve(kidooAppRoot, 'src', relativePath);
    const extensions = ['tsx', 'ts', 'jsx', 'js', 'json'];
    
    // Essayer d'abord comme fichier avec extension
    for (const ext of extensions) {
      const fullPath = `${correctPath}.${ext}`;
      if (fs.existsSync(fullPath)) {
        return {
          filePath: fullPath,
          type: 'sourceFile',
        };
      }
    }
    
    // Essayer aussi comme répertoire avec index
    for (const ext of extensions) {
      const fullPath = path.join(correctPath, `index.${ext}`);
      if (fs.existsSync(fullPath)) {
        return {
          filePath: fullPath,
          type: 'sourceFile',
        };
      }
    }
  }

  // Corriger les chemins relatifs ./ depuis kidoo-app/src/ quand le contexte est incorrect
  // Cela se produit quand un fichier dans kidoo-app/src/ est importé depuis App.tsx à la racine
  if (
    moduleName.startsWith('./') &&
    context.originModulePath &&
    context.originModulePath.includes('kidoo-app/src/')
  ) {
    // Résoudre depuis le répertoire du fichier d'origine
    const originDir = path.dirname(context.originModulePath);
    const relativePath = path.resolve(originDir, moduleName);
    const extensions = ['tsx', 'ts', 'jsx', 'js', 'json'];
    
    // Essayer d'abord comme fichier avec extension
    for (const ext of extensions) {
      const fullPath = `${relativePath}.${ext}`;
      if (fs.existsSync(fullPath)) {
        return {
          filePath: fullPath,
          type: 'sourceFile',
        };
      }
    }
    
    // Essayer aussi comme répertoire avec index
    for (const ext of extensions) {
      const fullPath = path.join(relativePath, `index.${ext}`);
      if (fs.existsSync(fullPath)) {
        return {
          filePath: fullPath,
          type: 'sourceFile',
        };
      }
    }
  }

  // Sinon, utiliser la résolution par défaut
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
