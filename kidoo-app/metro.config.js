// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Configuration pour résoudre le dossier shared
config.watchFolders = [
  path.resolve(__dirname, '.'),
  path.resolve(__dirname, '../shared'),
];

// Résolution des alias pour Metro
config.resolver = {
  ...config.resolver,
  alias: {
    '@': path.resolve(__dirname, '.'),
    '@/shared': path.resolve(__dirname, '../shared'),
  },
};

module.exports = config;
