#include "../managers/init/init_manager.h"
#include "../managers/led/led_manager.h"
#include "../../../../../color/colors.h"

bool InitManager::initLED() {
  systemStatus.led = INIT_IN_PROGRESS;
  
  if (!LEDManager::init()) {
    systemStatus.led = INIT_FAILED;
    return false;
  }
  
  systemStatus.led = INIT_SUCCESS;
  
  // Configuration initiale des LEDs : orange qui tourne (indique l'initialisation en cours)
  LEDManager::setColor(COLOR_ORANGE);
  LEDManager::setEffect(LED_EFFECT_ROTATE);
  
  return true;
}
