# Script pour regenerer les icones Android
Write-Host "=== Regeneration des icones Android ===" -ForegroundColor Cyan
Write-Host ""

# Verifier que les fichiers d'icones existent
if (-not (Test-Path "assets\icon.png")) {
    Write-Host "ERREUR: assets\icon.png n'existe pas!" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "assets\adaptive-icon.png")) {
    Write-Host "ERREUR: assets\adaptive-icon.png n'existe pas!" -ForegroundColor Red
    exit 1
}

Write-Host "Fichiers d'icones trouves" -ForegroundColor Green
Write-Host ""

# Nettoyer les caches Android
Write-Host "Nettoyage des caches Android..." -ForegroundColor Yellow
if (Test-Path "android\app\build") {
    Remove-Item -Recurse -Force "android\app\build"
    Write-Host "  Cache app\build supprime" -ForegroundColor Green
}
if (Test-Path "android\build") {
    Remove-Item -Recurse -Force "android\build"
    Write-Host "  Cache build racine supprime" -ForegroundColor Green
}
if (Test-Path "android\.gradle") {
    Remove-Item -Recurse -Force "android\.gradle"
    Write-Host "  Cache Gradle supprime" -ForegroundColor Green
}
Write-Host ""

# Supprimer les icones existantes pour forcer la regeneration
Write-Host "Suppression des icones existantes..." -ForegroundColor Yellow
$mipmapDirs = Get-ChildItem "android\app\src\main\res" -Filter "mipmap-*" -Directory
foreach ($dir in $mipmapDirs) {
    $webpFiles = Get-ChildItem $dir.FullName -Filter "*.webp"
    foreach ($file in $webpFiles) {
        Remove-Item $file.FullName -Force
        Write-Host "  Supprime: $($file.Name)" -ForegroundColor Gray
    }
}
Write-Host ""

# Regenerer les fichiers natifs avec Expo prebuild
Write-Host "Regeneration des fichiers natifs avec Expo prebuild..." -ForegroundColor Yellow
Write-Host "  Commande: npx expo prebuild --platform android --clean" -ForegroundColor Gray
Write-Host ""

npx expo prebuild --platform android --clean

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Regeneration terminee avec succes!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Prochaines etapes:" -ForegroundColor Cyan
    Write-Host "  1. Reconstruire l'application: npm run android" -ForegroundColor White
    Write-Host "  2. Ou build release: npm run android:release" -ForegroundColor White
    Write-Host ""
    Write-Host "Note: Si l'icone n'apparait pas immediatement:" -ForegroundColor Yellow
    Write-Host "  - Desinstallez l'ancienne version de l'app" -ForegroundColor White
    Write-Host "  - Reinstallez la nouvelle version" -ForegroundColor White
    Write-Host "  - Videz le cache du launcher Android si necessaire" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "ERREUR: La regeneration a echoue!" -ForegroundColor Red
    exit 1
}
