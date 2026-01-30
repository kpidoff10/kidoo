# Script PowerShell pour générer l'APK de production

Write-Host "=== Build APK de production Kidoo ===" -ForegroundColor Cyan

# Vérifier que nous sommes dans le bon répertoire
if (-not (Test-Path "package.json")) {
    Write-Host "Erreur: Ce script doit être exécuté depuis le répertoire kidoo-app" -ForegroundColor Red
    exit 1
}

# Vérifier que le dossier android existe
if (-not (Test-Path "android")) {
    Write-Host "Le dossier android n'existe pas. Exécution de prebuild..." -ForegroundColor Yellow
    npm run prebuild
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Erreur lors du prebuild" -ForegroundColor Red
        exit 1
    }
}

# Aller dans le dossier android
Set-Location android

Write-Host "`nGénération de l'APK de production..." -ForegroundColor Green
Write-Host "Cela peut prendre plusieurs minutes..." -ForegroundColor Yellow

# Exécuter le build
.\gradlew.bat assembleRelease

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n=== Build réussi ! ===" -ForegroundColor Green
    $apkPath = "app\build\outputs\apk\release\app-release.apk"
    if (Test-Path $apkPath) {
        $fullPath = (Resolve-Path $apkPath).Path
        Write-Host "APK généré : $fullPath" -ForegroundColor Cyan
        Write-Host "`nPour installer sur votre téléphone :" -ForegroundColor Yellow
        Write-Host "1. Transférez le fichier APK sur votre téléphone" -ForegroundColor White
        Write-Host "2. Activez 'Sources inconnues' dans les paramètres Android" -ForegroundColor White
        Write-Host "3. Ouvrez le fichier APK pour l'installer" -ForegroundColor White
        
        # Ouvrir l'explorateur Windows sur le dossier de l'APK
        $apkDir = Split-Path $fullPath
        Start-Process explorer.exe -ArgumentList $apkDir
    } else {
        Write-Host "Erreur: L'APK n'a pas été trouvé à l'emplacement attendu" -ForegroundColor Red
    }
} else {
    Write-Host "`n=== Erreur lors du build ===" -ForegroundColor Red
    Write-Host "Vérifiez les erreurs ci-dessus" -ForegroundColor Yellow
    exit 1
}

# Retourner au répertoire parent
Set-Location ..
