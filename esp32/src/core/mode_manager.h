#ifndef MODE_MANAGER_H
#define MODE_MANAGER_H

#include "state_manager.h"

class ModeManager {
public:
  // Déterminer le mode approprié en fonction de l'état actuel
  // Priorité: Mode manuel > Effets forcés (glossy/rainbow/pulse) > 
  //           WiFi domestique connecté (VERT) > Client AP (GLOSSY) > 
  //           Bluetooth (BLEU) > ROUGE (défaut)
  static Mode determineMode();
  
  // Appliquer le mode déterminé
  static void applyMode(Mode mode);
};

#endif // MODE_MANAGER_H
