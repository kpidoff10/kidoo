#ifndef VERSION_COMMAND_H
#define VERSION_COMMAND_H

#include <Arduino.h>
#include <ArduinoJson.h>

// Traiter la commande VERSION (récupérer la version du firmware)
bool handleVersionCommand(JsonDocument& doc);

#endif // VERSION_COMMAND_H
