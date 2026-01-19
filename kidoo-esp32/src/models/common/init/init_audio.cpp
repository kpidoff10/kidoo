#include "../managers/init/init_manager.h"
#include "../managers/audio/audio_manager.h"

bool InitManager::initAudio() {
  systemStatus.audio = INIT_IN_PROGRESS;
  
  if (!AudioManager::init()) {
    systemStatus.audio = INIT_FAILED;
    
    // Afficher un warning si l'audio n'est pas opérationnel
    Serial.println("[INIT] WARNING: Audio non operationnel (module non detecte ou non configure)");
    
    return false;
  }
  
  if (!AudioManager::isAvailable()) {
    systemStatus.audio = INIT_FAILED;
    
    // Afficher un warning si l'audio n'est pas disponible
    Serial.println("[INIT] WARNING: Audio non disponible (hardware non operationnel ou SD non disponible)");
    
    return false;
  }
  
  systemStatus.audio = INIT_SUCCESS;
  Serial.println("[INIT] Audio operationnel");
  
  return true;
}
