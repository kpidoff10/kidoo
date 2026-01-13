#ifndef BLE_COMMANDS_H
#define BLE_COMMANDS_H

#include <Arduino.h>
#include <ArduinoJson.h>

// Fonction pour traiter une commande BLE parsée
// Prend le document JSON déjà parsé et le buffer original
// Retourne true si la commande a été traitée, false sinon
bool processBLECommand(JsonDocument& doc, String& bleBuffer);

#endif // BLE_COMMANDS_H
