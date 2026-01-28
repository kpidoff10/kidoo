/**
 * Script d'installation pour Vercel avec npm workspaces
 * Installe depuis la racine du monorepo pour avoir accès à shared/
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Le script s'exécute depuis kidoo-server/scripts/
// On monte de 2 niveaux pour atteindre la racine du monorepo
const rootDir = path.resolve(__dirname, '../..');
const currentDir = __dirname.replace(/[\\/]scripts$/, '');

console.log('[INSTALL-WORKSPACES] ==========================================');
console.log('[INSTALL-WORKSPACES] Installation des workspaces npm...');
console.log(`[INSTALL-WORKSPACES] Root monorepo: ${rootDir}`);
console.log(`[INSTALL-WORKSPACES] Dossier actuel: ${currentDir}`);
console.log(`[INSTALL-WORKSPACES] CWD avant: ${process.cwd()}`);

// Vérifier si on est dans un contexte monorepo (racine avec package.json et shared/)
const rootPackageJson = path.join(rootDir, 'package.json');
const sharedDir = path.join(rootDir, 'shared');

console.log(`[INSTALL-WORKSPACES] Root package.json existe: ${fs.existsSync(rootPackageJson)}`);
console.log(`[INSTALL-WORKSPACES] Shared dir existe: ${fs.existsSync(sharedDir)}`);

if (fs.existsSync(rootPackageJson) && fs.existsSync(sharedDir)) {
  console.log('[INSTALL-WORKSPACES] Installation depuis la racine du monorepo...');
  process.chdir(rootDir);
  console.log(`[INSTALL-WORKSPACES] CWD après chdir: ${process.cwd()}`);
  execSync('npm install', { stdio: 'inherit' });
  console.log('[INSTALL-WORKSPACES] Installation terminée depuis la racine');
} else {
  console.log('[INSTALL-WORKSPACES] Installation locale dans kidoo-server...');
  process.chdir(currentDir);
  console.log(`[INSTALL-WORKSPACES] CWD après chdir: ${process.cwd()}`);
  execSync('npm install', { stdio: 'inherit' });
  console.log('[INSTALL-WORKSPACES] Installation terminée localement');
}
console.log('[INSTALL-WORKSPACES] ==========================================');
