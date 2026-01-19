#include "../managers/init/init_manager.h"

bool InitManager::initSerial() {
  systemStatus.serial = INIT_IN_PROGRESS;
  
  Serial.begin(SERIAL_BAUD_RATE);
  
  // Attendre que le Serial soit prêt (avec timeout)
  unsigned long startTime = millis();
  while (!Serial && (millis() - startTime) < SERIAL_TIMEOUT_MS) {
    delay(10);
  }
  
  if (Serial) {
    delay(500); // Petite pause pour stabiliser
    systemStatus.serial = INIT_SUCCESS;
    return true;
  } else {
    systemStatus.serial = INIT_FAILED;
    return false;
  }
}
