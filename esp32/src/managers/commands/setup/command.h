#ifndef SETUP_COMMAND_H
#define SETUP_COMMAND_H

#include <Arduino.h>
#include <ArduinoJson.h>

// Traiter la commande SETUP (configuration WiFi)
bool handleSetupCommand(JsonDocument& doc);

#endif // SETUP_COMMAND_H
