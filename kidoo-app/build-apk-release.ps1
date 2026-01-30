# Script PowerShell pour générer l'APK de production avec expo export préalable

Write-Host "=== Build APK de production Kidoo ===" -ForegroundColor Cyan

# Vérifier que nous sommes dans le bon répertoire
if (-not (Test-Path "package.json")) {
    Write-Host "Erreur: Ce script doit être exécuté depuis le répertoire kidoo-app" -ForegroundColor Red
    exit 1
}

# Étape 1 : Générer le bundle avec expo export
Write-Host "`nÉtape 1/2 : Génération du bundle avec expo export..." -ForegroundColor Green
Write-Host "Cela peut prendre quelques minutes..." -ForegroundColor Yellow

npx expo export --platform android

if ($LASTEXITCODE -ne 0) {
    Write-Host "Erreur lors de l'export Expo" -ForegroundColor Red
    exit 1
}

Write-Host "Bundle généré avec succès !" -ForegroundColor Green

# Étape 2 : Build Gradle
Write-Host "`nÉtape 2/2 : Build Gradle..." -ForegroundColor Green
Write-Host "Cela peut prendre plusieurs minutes..." -ForegroundColor Yellow

Set-Location android
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
