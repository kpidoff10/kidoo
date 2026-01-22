const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Ajouter le dossier shared aux watchFolders pour que Metro le surveille
config.watchFolders = [path.resolve(__dirname, '../shared')];

// Configurer la résolution des modules pour @shared
config.resolver = {
  ...config.resolver,
  alias: {
    ...config.resolver?.alias,
    '@shared': path.resolve(__dirname, '../shared/index.ts'),
    '@/shared': path.resolve(__dirname, '../shared/index.ts'),
  },
  extraNodeModules: {
    ...config.resolver?.extraNodeModules,
  },
};

module.exports = config;
