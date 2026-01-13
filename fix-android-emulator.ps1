# Script pour réparer un émulateur Android planté
# À exécuter dans PowerShell

Write-Host "=== Réparation de l'émulateur Android ===" -ForegroundColor Cyan
Write-Host ""

# Initialiser les variables d'environnement Android
$sdkPath = "$env:LOCALAPPDATA\Android\Sdk"
if (Test-Path "$sdkPath\platform-tools\adb.exe") {
    $env:ANDROID_HOME = $sdkPath
    $env:PATH = "$sdkPath\platform-tools;$env:PATH"
} else {
    Write-Host "ERREUR: Android SDK non trouve a $sdkPath" -ForegroundColor Red
    Write-Host "Verifiez que Android Studio est installe." -ForegroundColor Yellow
    exit 1
}

Write-Host "1. Redemarrage du serveur ADB..." -ForegroundColor Yellow
& adb kill-server
Start-Sleep -Seconds 2
& adb start-server
Start-Sleep -Seconds 2

Write-Host "`n2. Liste des appareils connectes:" -ForegroundColor Yellow
& adb devices

Write-Host "`n3. Tentative de redemarrage de l'emulateur..." -ForegroundColor Yellow
# Obtenir la liste des émulateurs disponibles
$emulators = & "$sdkPath\emulator\emulator" -list-avds 2>&1
if ($LASTEXITCODE -eq 0 -and $emulators) {
    Write-Host "Emulateurs disponibles:" -ForegroundColor Cyan
    $emulators | ForEach-Object { Write-Host "  - $_" -ForegroundColor White }
    
    # Essayer de redémarrer le premier émulateur trouvé
    $firstEmulator = ($emulators | Select-Object -First 1).Trim()
    if ($firstEmulator) {
        Write-Host "`nRedemarrage de l'emulateur: $firstEmulator" -ForegroundColor Green
        Write-Host "Fermeture de l'emulateur existant..." -ForegroundColor Yellow
        
        # Tuer tous les processus qemu (émulateur)
        Get-Process | Where-Object { $_.ProcessName -like "*qemu*" -or $_.ProcessName -like "*emulator*" } | Stop-Process -Force -ErrorAction SilentlyContinue
        
        Start-Sleep -Seconds 3
        
        Write-Host "Demarrage de l'emulateur..." -ForegroundColor Yellow
        Start-Process -FilePath "$sdkPath\emulator\emulator.exe" -ArgumentList "-avd", $firstEmulator -WindowStyle Minimized
        
        Write-Host "Attente du demarrage de l'emulateur (30 secondes)..." -ForegroundColor Yellow
        Start-Sleep -Seconds 30
        
        Write-Host "`n4. Verification de la connexion:" -ForegroundColor Yellow
        & adb devices
        
        Write-Host "`n=== Termine ===" -ForegroundColor Green
        Write-Host "Si l'emulateur ne repond toujours pas, essayez:" -ForegroundColor Yellow
        Write-Host "  - Fermer l'emulateur depuis Android Studio" -ForegroundColor White
        Write-Host "  - Redemarrer votre ordinateur" -ForegroundColor White
    }
} else {
    Write-Host "Aucun emulateur trouve." -ForegroundColor Yellow
    Write-Host "`n4. Fermeture forcee des processus emulator..." -ForegroundColor Yellow
    
    # Tuer tous les processus liés à l'émulateur
    $processes = Get-Process | Where-Object { 
        $_.ProcessName -like "*qemu*" -or 
        $_.ProcessName -like "*emulator*" -or
        $_.ProcessName -like "*adb*"
    }
    
    if ($processes) {
        Write-Host "Processus trouves:" -ForegroundColor Cyan
        $processes | ForEach-Object { Write-Host "  - $($_.ProcessName) (PID: $($_.Id))" -ForegroundColor White }
        
        $processes | Stop-Process -Force -ErrorAction SilentlyContinue
        Write-Host "Processus fermes." -ForegroundColor Green
    } else {
        Write-Host "Aucun processus emulator trouve." -ForegroundColor Yellow
    }
    
    Write-Host "`nVous pouvez maintenant redemarrer l'emulateur depuis Android Studio." -ForegroundColor Green
}

Write-Host "`n5. Commandes utiles:" -ForegroundColor Cyan
Write-Host "  - Redemarrer ADB: adb kill-server && adb start-server" -ForegroundColor White
Write-Host "  - Lister les appareils: adb devices" -ForegroundColor White
Write-Host "  - Redemarrer l'emulateur: adb reboot" -ForegroundColor White
Write-Host "  - Forcer l'arret: adb emu kill" -ForegroundColor White
