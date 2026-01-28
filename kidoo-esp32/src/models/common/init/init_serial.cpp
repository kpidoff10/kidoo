#include "../managers/init/init_manager.h"

bool InitManager::initSerial() {
  systemStatus.serial = INIT_IN_PROGRESS;
  
  Serial.begin(SERIAL_BAUD_RATE);
  
  // Sur ESP32 avec USB CDC, Serial peut ne pas être disponible si USB n'est pas connecté
  // Ne pas bloquer le démarrage - le système peut fonctionner sans Serial
  // Attendre seulement un court instant pour que Serial se connecte si USB est présent
  unsigned long startTime = millis();
  while (!Serial && (millis() - startTime) < 100) {  // Timeout réduit à 100ms
    delay(10);
  }
  
  if (Serial) {
    delay(100); // Petite pause pour stabiliser (réduite de 500ms à 100ms)
    systemStatus.serial = INIT_SUCCESS;
    return true;
  } else {
    // Serial non disponible (USB non connecté) - ne pas bloquer le démarrage
    // Le système peut fonctionner sans Serial
    systemStatus.serial = INIT_FAILED;
    return false;  // Retourne false mais le système continue
  }
}
