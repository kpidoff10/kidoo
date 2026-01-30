# Build APK release pour monorepo : force Metro a utiliser kidoo-app comme racine
# (sans cette variable, Metro utilise la racine du repo et ne trouve pas index.tsx)
$env:EXPO_NO_METRO_WORKSPACE_ROOT = "1"
npx expo run:android --variant release
