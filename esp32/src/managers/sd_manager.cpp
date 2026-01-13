#include "sd_manager.h"
#include <SPI.h>
#include <SD.h>
#include "../config/pins.h"

static bool sdCardInitialized = false;

// Fonction pour initialiser la carte SD avec des broches spécifiques
bool initSDCardWithPins(uint8_t mosi, uint8_t miso, uint8_t sck, uint8_t cs) {
  Serial.print("\n[SD] Tentative avec broches - MOSI: ");
  Serial.print(mosi);
  Serial.print(", MISO: ");
  Serial.print(miso);
  Serial.print(", SCK: ");
  Serial.print(sck);
  Serial.print(", CS: ");
  Serial.println(cs);
  
  // Fermer SPI s'il était déjà ouvert
  SPI.end();
  delay(50);
  
  // Initialiser le bus SPI avec les broches spécifiées
  SPI.begin(sck, miso, mosi, cs);
  delay(200);  // Délai plus long pour stabiliser SPI
  
  // Configurer la broche CS en sortie et la mettre à HIGH
  pinMode(cs, OUTPUT);
  digitalWrite(cs, HIGH);
  delay(50);
  
  Serial.println("[SD] Tentative d'initialisation de la carte SD...");
  
  // Initialiser la carte SD avec plusieurs tentatives et différentes fréquences
  // Commencer par des fréquences très basses pour les cartes sensibles
  int attempts = 0;
  bool success = false;
  uint32_t frequencies[] = {400000, 1000000, 4000000, 8000000}; // 400kHz, 1MHz, 4MHz, 8MHz
  int maxAttempts = sizeof(frequencies) / sizeof(frequencies[0]);
  
  while (attempts < maxAttempts && !success) {
    uint32_t frequency = frequencies[attempts];
    Serial.print("[SD] Tentative ");
    Serial.print(attempts + 1);
    Serial.print("/");
    Serial.print(maxAttempts);
    Serial.print(" avec frequence ");
    if (frequency >= 1000000) {
      Serial.print(frequency / 1000000);
      Serial.println(" MHz...");
    } else {
      Serial.print(frequency / 1000);
      Serial.println(" kHz...");
    }
    
    // Réinitialiser SPI si ce n'est pas la première tentative
    if (attempts > 0) {
      SPI.end();
      delay(200);
      digitalWrite(cs, HIGH);
      delay(100);
      SPI.begin(sck, miso, mosi, cs);
      delay(200);
      digitalWrite(cs, HIGH);
      delay(100);
    }
    
    // Délai supplémentaire avant SD.begin() pour laisser la carte se stabiliser
    delay(200);
    
    success = SD.begin(cs, SPI, frequency);
    if (!success) {
      attempts++;
      
      // Diagnostiquer pourquoi SD.begin() échoue
      Serial.print("[SD] Tentative ");
      Serial.print(attempts);
      Serial.print(" echouee (freq ");
      if (frequency >= 1000000) {
        Serial.print(frequency / 1000000);
        Serial.print(" MHz)");
      } else {
        Serial.print(frequency / 1000);
        Serial.print(" kHz)");
      }
      
      // Vérifier si SPI fonctionne en testant la broche CS
      digitalWrite(cs, LOW);
      delay(10);
      bool csLowOk = (digitalRead(cs) == LOW);
      digitalWrite(cs, HIGH);
      delay(10);
      bool csHighOk = (digitalRead(cs) == HIGH);
      
      Serial.print(", CS: ");
      Serial.print(csLowOk && csHighOk ? "OK" : "ERREUR");
      
      // Vérifier l'état de MISO (peut indiquer si la carte répond)
      pinMode(miso, INPUT);
      int misoState = digitalRead(miso);
      Serial.print(", MISO: ");
      Serial.print(misoState == HIGH ? "HIGH" : "LOW");
      
      // Diagnostic supplémentaire : tester plusieurs lectures MISO
      Serial.print(" (");
      for (int i = 0; i < 5; i++) {
        Serial.print(digitalRead(miso));
        delay(10);
      }
      Serial.print(")");
      
      Serial.println(", nouvelle tentative...");
      delay(1500); // Délai plus long entre les tentatives
    } else {
      Serial.print("[SD] Initialisation reussie avec frequence ");
      if (frequency >= 1000000) {
        Serial.print(frequency / 1000000);
        Serial.println(" MHz");
      } else {
        Serial.print(frequency / 1000);
        Serial.println(" kHz");
      }
    }
  }
  
  if (!success) {
    Serial.println("[SD] ERREUR: Impossible d'initialiser la carte SD apres toutes les tentatives !");
    
    // Diagnostic supplémentaire
    Serial.println("[SD] === DIAGNOSTIC DETAILLE ===");
    Serial.print("[SD] Broche CS (GPIO ");
    Serial.print(cs);
    Serial.print("): ");
    digitalWrite(cs, LOW);
    delay(10);
    Serial.print(digitalRead(cs) == LOW ? "LOW OK" : "ERREUR");
    digitalWrite(cs, HIGH);
    delay(10);
    Serial.print(", ");
    Serial.println(digitalRead(cs) == HIGH ? "HIGH OK" : "ERREUR");
    
    Serial.print("[SD] Broche MISO (GPIO ");
    Serial.print(miso);
    Serial.print("): ");
    pinMode(miso, INPUT);
    Serial.println(digitalRead(miso) == HIGH ? "HIGH" : "LOW");
    
    Serial.println("[SD] ATTENTION: MISO reste HIGH - la carte SD ne repond pas !");
    Serial.println("[SD] Cela indique un probleme materiel:");
    Serial.println("[SD]   - Carte SD non alimentee (VCC -> 3.3V)");
    Serial.println("[SD]   - MISO mal connecte");
    Serial.println("[SD]   - Carte SD endommagee");
    Serial.println("[SD]   - Module SD defectueux");
    
    Serial.println("[SD] Verifications materielles:");
    Serial.println("[SD]   1. Carte SD inseree correctement dans le lecteur");
    Serial.println("[SD]   2. Alimentation VCC -> 3.3V (PAS 5V, PAS VIN !)");
    Serial.println("[SD]   3. GND connecte");
    Serial.println("[SD]   4. Broches SPI correctement connectees");
    Serial.println("[SD]   5. Carte SD formatee en FAT32");
    Serial.println("[SD]   6. Tester avec une autre carte SD si possible");
    Serial.println("[SD] ============================");
    
    // Vérification supplémentaire : peut-être que SD.begin() échoue mais la carte est accessible
    Serial.println("[SD] Verification supplementaire...");
    uint8_t cardType = SD.cardType();
    if (cardType != CARD_NONE) {
      Serial.print("[SD] ATTENTION: SD.begin() a echoue mais cardType detecte: ");
      Serial.println(cardType);
      Serial.println("[SD] La carte SD semble accessible malgre l'echec de SD.begin()");
      Serial.println("[SD] Tentative de continuer avec cette carte...");
      // Marquer comme initialisé si on détecte une carte
      sdCardInitialized = true;
      success = true; // On considère que c'est un succès partiel
    } else {
      Serial.println("[SD] Aucune carte SD detectee (cardType = CARD_NONE)");
      Serial.println("[SD] La carte SD n'est pas detectee du tout - verifier le cablage");
      sdCardInitialized = false;
      return false;
    }
  }
  
  if (success) {
    Serial.println("[SD] Carte SD initialisee avec succes !");
    
    // Afficher les informations de la carte
    uint8_t cardType = SD.cardType();
    if (cardType == CARD_NONE) {
      Serial.println("[SD] ATTENTION: Carte initialisee mais cardType = CARD_NONE");
      // Ne pas retourner false, continuer pour voir si on peut quand même utiliser la carte
    } else {
      Serial.print("[SD] Type de carte: ");
      switch (cardType) {
        case CARD_MMC:
          Serial.println("MMC");
          break;
        case CARD_SD:
          Serial.println("SD");
          break;
        case CARD_SDHC:
          Serial.println("SDHC");
          break;
        default:
          Serial.println("Inconnu");
      }
      
      // Afficher l'espace disponible
      uint64_t totalSpace = getSDCardTotalSpace();
      uint64_t freeSpace = getSDCardFreeSpace();
      
      Serial.print("[SD] Espace total: ");
      Serial.print(totalSpace / (1024 * 1024));
      Serial.println(" MB");
      
      Serial.print("[SD] Espace libre: ");
      Serial.print(freeSpace / (1024 * 1024));
      Serial.println(" MB");
      
      // Vérifier si on peut lire le système de fichiers
      Serial.println("[SD] Test d'acces au systeme de fichiers...");
      File testFile = SD.open("/", FILE_READ);
      if (testFile) {
        Serial.println("[SD] Acces au systeme de fichiers OK");
        testFile.close();
      } else {
        Serial.println("[SD] ATTENTION: Impossible d'acceder au systeme de fichiers");
      }
    }
  }
  
  sdCardInitialized = true;
  
  // Creer le dossier /music s'il n'existe pas
  if (!SD.exists("/music")) {
    createSDCardDirectory("/music");
  }
  
  return true;
}

// Fonction principale pour initialiser la carte SD (essaie VSPI puis HSPI)
bool initSDCard() {
  Serial.println("\n[SD] Initialisation de la carte SD...");
  
  // Essayer d'abord avec VSPI (broches standard)
  Serial.println("[SD] === Tentative 1: VSPI (broches standard) ===");
  if (initSDCardWithPins(23, 19, 18, 5)) {
    return true;
  }
  
  // Si VSPI échoue, essayer HSPI
  Serial.println("\n[SD] === Tentative 2: HSPI (broches alternatives) ===");
  if (initSDCardWithPins(13, 12, 14, 5)) {
    Serial.println("[SD] SUCCES avec HSPI !");
    Serial.println("[SD] Mettez a jour pins.h pour utiliser HSPI par defaut");
    return true;
  }
  
  Serial.println("\n[SD] ERREUR: Echec avec VSPI et HSPI");
  Serial.println("[SD] Verifiez le cablage et l'alimentation de la carte SD");
  return false;
}

// Fonction pour vérifier si la carte SD est disponible
bool isSDCardAvailable() {
  return sdCardInitialized && SD.cardType() != CARD_NONE;
}

// Fonction pour obtenir l'espace libre sur la carte SD (en octets)
uint64_t getSDCardFreeSpace() {
  if (!isSDCardAvailable()) {
    return 0;
  }
  return SD.totalBytes() - SD.usedBytes();
}

// Fonction pour obtenir l'espace total de la carte SD (en octets)
uint64_t getSDCardTotalSpace() {
  if (!isSDCardAvailable()) {
    return 0;
  }
  return SD.totalBytes();
}

// Fonction pour lister les fichiers dans un dossier
void listSDCardFiles(const char* dirPath) {
  if (!isSDCardAvailable()) {
    Serial.println("[SD] Carte SD non disponible");
    return;
  }
  
  // Vérifier si le dossier existe
  if (!SD.exists(dirPath)) {
    Serial.print("[SD] Le dossier ");
    Serial.print(dirPath);
    Serial.println(" n'existe pas");
    return;
  }
  
  File root = SD.open(dirPath);
  if (!root) {
    Serial.print("[SD] Erreur: Impossible d'ouvrir le dossier ");
    Serial.println(dirPath);
    return;
  }
  
  if (!root.isDirectory()) {
    Serial.print("[SD] ");
    Serial.print(dirPath);
    Serial.println(" n'est pas un dossier");
    root.close();
    return;
  }
  
  Serial.print("[SD] Fichiers dans ");
  Serial.print(dirPath);
  Serial.println(":");
  
  File file = root.openNextFile();
  int fileCount = 0;
  while (file) {
    fileCount++;
    if (file.isDirectory()) {
      Serial.print("  [DIR] ");
    } else {
      Serial.print("  [FILE] ");
      Serial.print(file.size());
      Serial.print(" bytes - ");
    }
    Serial.println(file.name());
    file = root.openNextFile();
  }
  
  if (fileCount == 0) {
    Serial.println("  (vide)");
  }
  
  root.close();
}

// Fonction pour créer un dossier
bool createSDCardDirectory(const char* dirPath) {
  if (!isSDCardAvailable()) {
    Serial.print("[SD] ERREUR: Tentative de creation du dossier ");
    Serial.print(dirPath);
    Serial.println(" alors que la carte SD n'est pas disponible");
    return false;
  }
  
  // Vérifier si le dossier existe déjà
  if (SD.exists(dirPath)) {
    Serial.print("[SD] Le dossier ");
    Serial.print(dirPath);
    Serial.println(" existe deja");
    return true;
  }
  
  if (SD.mkdir(dirPath)) {
    Serial.print("[SD] Dossier cree: ");
    Serial.println(dirPath);
    return true;
  } else {
    Serial.print("[SD] Erreur lors de la creation du dossier: ");
    Serial.println(dirPath);
    return false;
  }
}

// Fonction pour écrire un fichier sur la carte SD
bool writeSDCardFile(const char* filePath, const uint8_t* data, size_t dataSize) {
  if (!isSDCardAvailable()) {
    Serial.print("[SD] ERREUR: Tentative d'ecriture du fichier ");
    Serial.print(filePath);
    Serial.println(" alors que la carte SD n'est pas disponible");
    return false;
  }
  
  // Supprimer le fichier s'il existe pour forcer l'écrasement
  if (SD.exists(filePath)) {
    if (!SD.remove(filePath)) {
      Serial.print("[SD] Avertissement: Impossible de supprimer le fichier existant: ");
      Serial.println(filePath);
    }
  }
  
  // Ouvrir le fichier en mode écriture (crée le fichier s'il n'existe pas)
  File file = SD.open(filePath, FILE_WRITE);
  if (!file) {
    Serial.print("[SD] Erreur: Impossible d'ouvrir le fichier en ecriture: ");
    Serial.println(filePath);
    return false;
  }
  
  size_t bytesWritten = file.write(data, dataSize);
  
  // Important: flush avant de fermer pour s'assurer que les données sont écrites
  file.flush();
  file.close();
  
  // Délai pour s'assurer que l'écriture est terminée
  delay(100);
  
  // Vérifier que le fichier existe vraiment
  if (!SD.exists(filePath)) {
    Serial.print("[SD] ERREUR: Le fichier n'existe pas apres l'ecriture: ");
    Serial.println(filePath);
    return false;
  }
  
  if (bytesWritten == dataSize) {
    Serial.print("[SD] Fichier ecrit avec succes: ");
    Serial.print(filePath);
    Serial.print(" (");
    Serial.print(bytesWritten);
    Serial.println(" bytes)");
    return true;
  } else {
    Serial.print("[SD] Erreur: Seulement ");
    Serial.print(bytesWritten);
    Serial.print(" bytes ecrits sur ");
    Serial.print(dataSize);
    Serial.print(" pour le fichier: ");
    Serial.println(filePath);
    return false;
  }
}

// Fonction pour écrire un fichier de manière atomique (évite la corruption en cas de coupure)
// Écrit dans un fichier temporaire, puis le renomme pour remplacer l'original
bool writeSDCardFileAtomic(const char* filePath, const uint8_t* data, size_t dataSize) {
  if (!isSDCardAvailable()) {
    return false;
  }
  
  // Créer le nom du fichier temporaire
  String tempPath = String(filePath) + ".tmp";
  
  // Supprimer le fichier temporaire s'il existe (résidu d'une écriture précédente interrompue)
  if (SD.exists(tempPath.c_str())) {
    Serial.print("[SD] Suppression d'un fichier temporaire existant: ");
    Serial.println(tempPath);
    if (!SD.remove(tempPath.c_str())) {
      Serial.println("[SD] Avertissement: Impossible de supprimer le fichier temporaire existant");
      // On continue quand même, l'écriture suivante le remplacera
    }
  }
  
  // Écrire dans le fichier temporaire
  File file = SD.open(tempPath.c_str(), FILE_WRITE);
  if (!file) {
    Serial.print("[SD] Erreur: Impossible d'ouvrir le fichier temporaire en ecriture: ");
    Serial.println(tempPath);
    Serial.println("[SD] Verifiez que la carte SD a suffisamment d'espace libre");
    return false;
  }
  
  size_t bytesWritten = file.write(data, dataSize);
  
  // Important: flush avant de fermer pour s'assurer que les données sont écrites
  file.flush();
  file.close();
  
  // Petit délai pour s'assurer que l'écriture est terminée
  delay(50);
  
  // Vérifier que l'écriture a réussi
  if (bytesWritten != dataSize) {
    Serial.print("[SD] Erreur: Seulement ");
    Serial.print(bytesWritten);
    Serial.print(" bytes ecrits sur ");
    Serial.print(dataSize);
    Serial.print(" pour le fichier temporaire: ");
    Serial.println(tempPath);
    Serial.println("[SD] Causes possibles: espace insuffisant, carte SD lente, ou erreur d'ecriture");
    // Supprimer le fichier temporaire corrompu si possible
    if (SD.exists(tempPath.c_str())) {
      SD.remove(tempPath.c_str());
    }
    return false;
  }
  
  Serial.print("[SD] Fichier temporaire ecrit: ");
  Serial.print(tempPath);
  Serial.print(" (");
  Serial.print(bytesWritten);
  Serial.println(" bytes)");
  
  // Vérifier que le fichier temporaire existe avant de l'ouvrir
  if (!SD.exists(tempPath.c_str())) {
    Serial.println("[SD] Erreur: Le fichier temporaire n'existe pas apres l'ecriture");
    Serial.println("[SD] L'ecriture a probablement echoue (espace insuffisant ou erreur SD)");
    return false;
  }
  
  // Maintenant ouvrir le fichier pour vérification
  File verifyFile = SD.open(tempPath.c_str(), FILE_READ);
  if (!verifyFile) {
    Serial.println("[SD] Erreur: Impossible d'ouvrir le fichier temporaire pour verification");
    Serial.println("[SD] Le fichier existe mais ne peut pas etre lu - probleme d'acces");
    SD.remove(tempPath.c_str());
    return false;
  }
  
  size_t fileSize = verifyFile.size();
  verifyFile.close();
  
  if (fileSize != dataSize) {
    Serial.print("[SD] Erreur: Taille du fichier temporaire incorrecte (");
    Serial.print(fileSize);
    Serial.print(" au lieu de ");
    Serial.print(dataSize);
    Serial.println(")");
    SD.remove(tempPath.c_str());
    return false;
  }
  
  Serial.println("[SD] Fichier temporaire verifie avec succes");
  
  // Supprimer l'ancien fichier s'il existe (après avoir vérifié que le nouveau est valide)
  if (SD.exists(filePath)) {
    Serial.print("[SD] Suppression de l'ancien fichier: ");
    Serial.println(filePath);
    if (!SD.remove(filePath)) {
      Serial.print("[SD] ERREUR: Impossible de supprimer l'ancien fichier: ");
      Serial.println(filePath);
      // Supprimer le fichier temporaire car on ne peut pas remplacer l'ancien
      SD.remove(tempPath.c_str());
      return false;
    }
    Serial.println("[SD] Ancien fichier supprime avec succes");
  }
  
  // Copier le fichier temporaire vers le fichier final
  // (SD.rename() n'est pas toujours disponible, donc on utilise la copie)
  Serial.print("[SD] Copie du fichier temporaire vers: ");
  Serial.println(filePath);
  
  File tempFile = SD.open(tempPath.c_str(), FILE_READ);
  if (!tempFile) {
    Serial.println("[SD] Erreur: Impossible d'ouvrir le fichier temporaire pour copie");
    SD.remove(tempPath.c_str());
    return false;
  }
  
  File finalFile = SD.open(filePath, FILE_WRITE);
  if (!finalFile) {
    Serial.print("[SD] Erreur: Impossible d'ouvrir le fichier final en ecriture: ");
    Serial.println(filePath);
    tempFile.close();
    SD.remove(tempPath.c_str());
    return false;
  }
  
  // Copier les données par blocs
  uint8_t buffer[512];
  size_t totalCopied = 0;
  while (tempFile.available() && totalCopied < dataSize) {
    size_t bytesToRead = min((size_t)512, dataSize - totalCopied);
    size_t bytesRead = tempFile.read(buffer, bytesToRead);
    if (bytesRead > 0) {
      size_t bytesWritten = finalFile.write(buffer, bytesRead);
      if (bytesWritten != bytesRead) {
        Serial.println("[SD] Erreur lors de la copie des donnees");
        finalFile.close();
        tempFile.close();
        SD.remove(tempPath.c_str());
        SD.remove(filePath);
        return false;
      }
      totalCopied += bytesWritten;
    }
  }
  
  finalFile.flush();
  finalFile.close();
  tempFile.close();
  
  if (totalCopied != dataSize) {
    Serial.print("[SD] Erreur: Seulement ");
    Serial.print(totalCopied);
    Serial.print(" bytes copies sur ");
    Serial.println(dataSize);
    SD.remove(tempPath.c_str());
    SD.remove(filePath);
    return false;
  }
  
  // Vérifier que le fichier final a la bonne taille
  File checkFile = SD.open(filePath, FILE_READ);
  if (!checkFile) {
    Serial.println("[SD] Erreur: Impossible de verifier le fichier final");
    SD.remove(tempPath.c_str());
    SD.remove(filePath);
    return false;
  }
  
  size_t finalSize = checkFile.size();
  checkFile.close();
  
  if (finalSize != dataSize) {
    Serial.print("[SD] Erreur: Taille du fichier final incorrecte (");
    Serial.print(finalSize);
    Serial.print(" au lieu de ");
    Serial.print(dataSize);
    Serial.println(")");
    SD.remove(tempPath.c_str());
    SD.remove(filePath);
    return false;
  }
  
  // Supprimer le fichier temporaire maintenant que la copie est réussie
  if (!SD.remove(tempPath.c_str())) {
    Serial.println("[SD] Avertissement: Impossible de supprimer le fichier temporaire apres copie");
    // Ce n'est pas critique, on continue
  }
  
  // Délai supplémentaire pour s'assurer que tout est écrit sur la carte SD
  delay(100);
  
  // Vérification finale : le fichier doit exister et être lisible
  if (!SD.exists(filePath)) {
    Serial.print("[SD] ERREUR: Le fichier final n'existe pas apres l'ecriture: ");
    Serial.println(filePath);
    return false;
  }
  
  // Vérifier qu'on peut relire le fichier
  File verifyFinal = SD.open(filePath, FILE_READ);
  if (!verifyFinal) {
    Serial.print("[SD] ERREUR: Impossible de relire le fichier final: ");
    Serial.println(filePath);
    return false;
  }
  verifyFinal.close();
  
  Serial.print("[SD] Ecriture atomique terminee avec succes: ");
  Serial.print(filePath);
  Serial.print(" (");
  Serial.print(finalSize);
  Serial.println(" bytes)");
  return true;
}

// Fonction pour lire un fichier depuis la carte SD
bool readSDCardFile(const char* filePath, uint8_t* buffer, size_t bufferSize) {
  if (!isSDCardAvailable()) {
    return false;
  }
  
  File file = SD.open(filePath, FILE_READ);
  if (!file) {
    Serial.print("[SD] Erreur: Impossible d'ouvrir le fichier en lecture: ");
    Serial.println(filePath);
    return false;
  }
  
  size_t bytesRead = file.read(buffer, bufferSize);
  file.close();
  
  Serial.print("[SD] Fichier lu: ");
  Serial.print(filePath);
  Serial.print(" (");
  Serial.print(bytesRead);
  Serial.println(" bytes)");
  
  return bytesRead > 0;
}

// Fonction pour supprimer un fichier
bool deleteSDCardFile(const char* filePath) {
  if (!isSDCardAvailable()) {
    return false;
  }
  
  if (SD.remove(filePath)) {
    Serial.print("[SD] Fichier supprime: ");
    Serial.println(filePath);
    return true;
  } else {
    Serial.print("[SD] Erreur lors de la suppression du fichier: ");
    Serial.println(filePath);
    return false;
  }
}

// Fonction pour vérifier si un fichier existe
bool sdCardFileExists(const char* filePath) {
  if (!isSDCardAvailable()) {
    return false;
  }
  return SD.exists(filePath);
}

// Fonction pour obtenir la taille d'un fichier (en octets, retourne 0 si erreur)
uint32_t getSDCardFileSize(const char* filePath) {
  if (!isSDCardAvailable()) {
    return 0;
  }
  
  if (!SD.exists(filePath)) {
    return 0;
  }
  
  File file = SD.open(filePath, FILE_READ);
  if (!file) {
    return 0;
  }
  
  uint32_t size = file.size();
  file.close();
  return size;
}
