// Source - https://stackoverflow.com/a/79741695
// Configuration Metro pour monorepo avec Expo SDK 54+

const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const fs = require('fs');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// Add shared packages to watchFolders
config.watchFolders = [monorepoRoot];

// Ensure Metro resolves packages from the monorepo
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// Configurer les alias pour @shared et @/
config.resolver.alias = {
  ...config.resolver?.alias,
  '@shared': path.resolve(__dirname, '../shared/index.ts'),
  '@/shared': path.resolve(__dirname, '../shared/index.ts'),
  // Alias @/ pour pointer vers kidoo-app/src/
  '@': path.resolve(__dirname, 'src'),
  '@/': path.resolve(__dirname, 'src'),
};

// Résolution personnalisée pour AppEntry.js qui cherche ../../App
// Dans un monorepo, AppEntry.js est dans node_modules/expo/ à la racine
// et cherche ../../App, mais App.tsx est dans kidoo-app/
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Si AppEntry.js cherche ../../App depuis node_modules/expo/
  if (
    moduleName === '../../App' &&
    context.originModulePath &&
    context.originModulePath.includes('node_modules/expo/AppEntry.js')
  ) {
    // Résoudre vers kidoo-app/App.tsx
    const appPath = path.resolve(projectRoot, 'App');
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

  // Sinon, utiliser la résolution par défaut
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
