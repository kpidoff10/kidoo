#ifndef COLOR_COMMAND_H
#define COLOR_COMMAND_H

#include <Arduino.h>
#include <ArduinoJson.h>

// Traiter la commande COLOR (définir la couleur RGB)
bool handleColorCommand(JsonDocument& doc);

#endif // COLOR_COMMAND_H
