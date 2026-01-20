#include "audio_manager.h"
#include "../../../model_config.h"
#include "../sd/sd_manager.h"
#include <Arduino.h>
#include <SD.h>
#include "Audio.h"

// Variables statiques
bool AudioManager::initialized = false;
bool AudioManager::available = false;
uint8_t AudioManager::currentVolume = AUDIO_DEFAULT_VOLUME;
bool AudioManager::isPaused = false;
TaskHandle_t AudioManager::taskHandle = nullptr;

// Instance audio (créée dynamiquement)
static Audio* audio = nullptr;

bool AudioManager::init() {
  if (initialized) {
    return available;
  }
  
  initialized = true;
  available = false;
  currentVolume = AUDIO_DEFAULT_VOLUME;
  isPaused = false;
  
  // Vérifier si le modèle supporte l'audio
  #ifndef HAS_AUDIO
    return false;
  #endif
  
  #if !HAS_AUDIO
    return false;
  #endif
  
  // Tester le hardware audio
  available = testHardware();
  
  if (!available) {
    Serial.println("[AUDIO] WARNING: Audio non disponible");
    return false;
  }
  
  // Créer le thread dédié pour le traitement audio
  BaseType_t result = xTaskCreatePinnedToCore(
    audioTask,
    "AudioTask",
    TASK_STACK_SIZE,
    nullptr,
    TASK_PRIORITY,
    &taskHandle,
    0  // Core 0 pour éviter les conflits avec le thread LED (core 1)
  );
  
  if (result != pdPASS) {
    Serial.println("[AUDIO] ERREUR: Echec de creation du thread audio");
    available = false;
    return false;
  }
  
  Serial.println("[AUDIO] Audio initialise avec succes (thread dedie)");
  return true;
}

bool AudioManager::isAvailable() {
  return initialized && available;
}

bool AudioManager::isInitialized() {
  return initialized;
}

bool AudioManager::testHardware() {
  // Pour l'audio I2S, on ne peut pas vraiment tester le hardware
  // sans jouer un son. On considère que c'est disponible si la SD est disponible
  // car on a besoin de la SD pour lire les fichiers audio
  
  // Vérifier que la SD est disponible
  if (!SDManager::isAvailable()) {
    Serial.println("[AUDIO] ERREUR: Carte SD non disponible (requis pour l'audio)");
    return false;
  }
  
  // NE PAS initialiser l'I2S au démarrage pour éviter le grésillement
  // L'I2S sera initialisé uniquement lors de la première lecture d'un fichier
  // Cela évite le bruit au démarrage
  
  #if AUDIO_MODE == 2
    Serial.println("[AUDIO] Mode: STEREO (2 haut-parleurs)");
  #else
    Serial.println("[AUDIO] Mode: MONO (1 haut-parleur)");
  #endif
  
  Serial.print("[AUDIO] Pins I2S configures - BCLK: GPIO");
  Serial.print(AUDIO_I2S_BCLK_PIN);
  Serial.print(", LRC: GPIO");
  Serial.print(AUDIO_I2S_LRC_PIN);
  Serial.print(", DIN: GPIO");
  Serial.println(AUDIO_I2S_DIN_PIN);
  
  Serial.println("[AUDIO] I2S sera initialise lors de la premiere lecture (pas de gresillement au demarrage)");
  
  return true;
}

bool AudioManager::playFile(const char* filePath) {
  if (!isAvailable()) {
    Serial.println("[AUDIO] ERREUR: Audio non disponible");
    return false;
  }
  
  // Arrêter la lecture en cours si nécessaire
  stop();
  
  // Vérifier que le fichier existe
  if (!SD.exists(filePath)) {
    Serial.print("[AUDIO] ERREUR: Fichier non trouve: ");
    Serial.println(filePath);
    return false;
  }
  
  // Initialiser l'I2S uniquement lors de la première lecture (évite le grésillement au démarrage)
  if (audio == nullptr) {
    Serial.println("[AUDIO] Initialisation I2S (premiere lecture)...");
    
    // Afficher la mémoire disponible avant allocation
    Serial.print("[AUDIO] RAM libre avant allocation: ");
    Serial.print(ESP.getFreeHeap());
    Serial.println(" bytes");
    
    audio = new Audio();
    
    if (audio == nullptr) {
      Serial.println("[AUDIO] ERREUR: Echec de creation Audio");
      Serial.print("[AUDIO] RAM libre: ");
      Serial.print(ESP.getFreeHeap());
      Serial.println(" bytes");
      return false;
    }
    
    // Configurer les pins I2S pour MAX98357
    // setPinout(BCLK, LRC, DOUT) - ordre important !
    // Note: DOUT = Data Out (DIN dans notre config)
    audio->setPinout(AUDIO_I2S_BCLK_PIN, AUDIO_I2S_LRC_PIN, AUDIO_I2S_DIN_PIN);
    
    // NOTE: La bibliothèque esphome/ESP32-audioI2S ne permet PAS de configurer
    // les buffers DMA directement (pas de setBufsize() ou setBufferSize()).
    // Les buffers sont gérés en interne par la bibliothèque.
    // C'est pourquoi on doit appeler loop() plusieurs fois pour maintenir
    // les buffers remplis - c'est la conception de la bibliothèque.
    
    // Configurer le volume (0-100, pas 0-21)
    // Convertir notre volume 0-21 en 0-100
    uint8_t volumePercent = (currentVolume * 100) / 21;
    audio->setVolume(volumePercent);
    
    Serial.print("[AUDIO] Volume: ");
    Serial.print(volumePercent);
    Serial.println("% (converti depuis 0-21)");
    
    // Note: forceMono() n'est pas appelé dans le code qui fonctionne
    // On le laisse en stéréo par défaut, la bibliothèque gère automatiquement
    
    Serial.print("[AUDIO] Configuration I2S - BCLK: GPIO");
    Serial.print(AUDIO_I2S_BCLK_PIN);
    Serial.print(", LRC: GPIO");
    Serial.print(AUDIO_I2S_LRC_PIN);
    Serial.print(", DIN: GPIO");
    Serial.println(AUDIO_I2S_DIN_PIN);
    
    Serial.println("[AUDIO] I2S initialise");
  }
  
  // Déterminer le type de fichier
  String path = String(filePath);
  path.toLowerCase();
  
  Serial.print("[AUDIO] Lecture du fichier: ");
  Serial.println(filePath);
  
  // Jouer le fichier
  bool result = false;
  if (path.endsWith(".mp3")) {
    result = audio->connecttoFS(SD, filePath);
    Serial.println("[AUDIO] Format: MP3");
  } else if (path.endsWith(".wav")) {
    result = audio->connecttoFS(SD, filePath);
    Serial.println("[AUDIO] Format: WAV");
  } else {
    Serial.print("[AUDIO] ERREUR: Format non supporte: ");
    Serial.println(filePath);
    return false;
  }
  
  if (!result) {
    Serial.println("[AUDIO] ERREUR: Echec du demarrage de la lecture");
    Serial.println("[AUDIO] Verifiez:");
    Serial.println("[AUDIO]   - Que le fichier est valide");
    Serial.println("[AUDIO]   - Que les pins I2S sont correctement connectees");
    Serial.println("[AUDIO]   - Que le module MAX98357 est alimente");
    return false;
  }
  
  isPaused = false;
  Serial.println("[AUDIO] Lecture demarree avec succes");
  return true;
}

void AudioManager::stop() {
  if (audio) {
    audio->stopSong();
  }
  
  isPaused = false;
}

bool AudioManager::isPlaying() {
  if (!audio) {
    return false;
  }
  
  return audio->isRunning() && !isPaused;
}

void AudioManager::pause(bool pause) {
  if (!audio) {
    return;
  }
  
  isPaused = pause;
  if (pause) {
    audio->pauseResume();
  } else {
    audio->pauseResume();
  }
}

bool AudioManager::setVolume(uint8_t volume) {
  if (volume > 21) {
    volume = 21;
  }
  
  currentVolume = volume;
  
  if (audio) {
    // Convertir notre volume 0-21 en 0-100 pour la bibliothèque
    uint8_t volumePercent = (volume * 100) / 21;
    audio->setVolume(volumePercent);
    
    Serial.print("[AUDIO] Volume: ");
    Serial.print(volume);
    Serial.print("/21 (");
    Serial.print(volumePercent);
    Serial.println("%)");
    
    return true;
  }
  
  return false;
}

uint8_t AudioManager::getVolume() {
  return currentVolume;
}

void AudioManager::update() {
  // Le thread audio gère maintenant les mises à jour automatiquement
  // Cette fonction est conservée pour compatibilité mais ne fait plus rien
  // Le thread audio appelle audio->loop() en continu avec un timing optimal
}

void AudioManager::audioTask(void* parameter) {
  // Ce thread tourne en continu et gère le traitement audio avec priorité élevée
  Serial.println("[AUDIO] Thread audio demarre");
  
  while (true) {
    // Vérifier si l'audio est disponible et initialisé
    if (audio != nullptr && isAvailable() && !isPaused) {
      // La bibliothèque audio traite seulement une petite quantité de données par appel
      // Il faut donc appeler loop() plusieurs fois pour maintenir les buffers remplis
      // Avec un thread dédié toutes les 1ms, 3 appels = 3000 traitements/seconde
      // C'est optimal pour éviter les saccades tout en ne surchargeant pas le CPU
      for (int i = 0; i < AUDIO_LOOPS_PER_UPDATE; i++) {
        audio->loop();
      }
    }
    
    // Pause de 1ms pour un timing régulier
    // 1000 mises à jour/seconde × 3 appels = 3000 traitements/seconde
    // C'est largement suffisant pour maintenir les buffers audio remplis
    vTaskDelay(pdMS_TO_TICKS(AUDIO_UPDATE_INTERVAL_MS));
  }
  
  // Ne devrait jamais arriver ici
  vTaskDelete(nullptr);
}

void AudioManager::printInfo() {
  Serial.println("");
  Serial.println("========== Etat Audio ==========");
  Serial.print("[AUDIO] Initialise: ");
  Serial.println(initialized ? "Oui" : "Non");
  Serial.print("[AUDIO] Disponible: ");
  Serial.println(available ? "Oui" : "Non");
  
  if (available) {
    Serial.print("[AUDIO] Mode: ");
    #if AUDIO_MODE == 2
      Serial.println("STEREO (2 haut-parleurs)");
    #else
      Serial.println("MONO (1 haut-parleur)");
    #endif
    
    Serial.print("[AUDIO] Volume: ");
    Serial.print(currentVolume);
    Serial.println("/21");
    
    Serial.print("[AUDIO] Pins I2S - BCLK: GPIO");
    Serial.print(AUDIO_I2S_BCLK_PIN);
    Serial.print(", LRC: GPIO");
    Serial.print(AUDIO_I2S_LRC_PIN);
    Serial.print(", DIN: GPIO");
    Serial.println(AUDIO_I2S_DIN_PIN);
    
    Serial.print("[AUDIO] En cours de lecture: ");
    Serial.println(isPlaying() ? "Oui" : "Non");
    
    if (audio && audio->isRunning()) {
      Serial.print("[AUDIO] Bitrate: ");
      Serial.print(audio->getBitRate());
      Serial.println(" kbps");
      Serial.print("[AUDIO] Sample rate: ");
      Serial.print(audio->getSampleRate());
      Serial.println(" Hz");
    }
    
    if (isPaused) {
      Serial.println("[AUDIO] En pause");
    }
  }
  
  Serial.println("=================================");
}
