#include "command.h"
#include "../../ble_manager.h"
#include "../../../core/state_manager.h"
#include "../../../core/led_controller.h"
#include "../../../effects/led_effects.h"

bool handleColorCommand(JsonDocument& doc) {
  Serial.println("[BLE] Commande COLOR (JSON) recue");
  
  uint8_t r = doc["r"] | 255;
  uint8_t g = doc["g"] | 255;
  uint8_t b = doc["b"] | 255;
  
  // Valider les valeurs RGB (0-255)
  if (r > 255) r = 255;
  if (g > 255) g = 255;
  if (b > 255) b = 255;
  
  Serial.print("[BLE] Definition de la couleur RGB: (");
  Serial.print(r);
  Serial.print(", ");
  Serial.print(g);
  Serial.print(", ");
  Serial.print(b);
  Serial.println(")");
  
  // Activer le mode manuel pour appliquer la couleur
  StateManager::resetForceModes();
  StateManager::setForceManualMode(true);
  
  // Appliquer immédiatement la couleur
  CRGB* leds = LEDController::getLeds();
  int numLeds = LEDController::getNumLeds();
  CRGB color = CRGB(r, g, b);
  setColor(leds, numLeds, color);
  
  // Créer la réponse JSON
  JsonDocument responseDoc;
  responseDoc["status"] = "success";
  responseDoc["message"] = "COLOR_SET";
  responseDoc["r"] = r;
  responseDoc["g"] = g;
  responseDoc["b"] = b;
  
  String response;
  serializeJson(responseDoc, response);
  sendBLEData(response.c_str());
  Serial.print("[BLE] Reponse envoyee: COLOR_SET (");
  Serial.print(r);
  Serial.print(", ");
  Serial.print(g);
  Serial.print(", ");
  Serial.print(b);
  Serial.println(")");
  
  return true;
}
