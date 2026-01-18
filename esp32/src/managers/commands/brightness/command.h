#ifndef BRIGHTNESS_COMMAND_H
#define BRIGHTNESS_COMMAND_H

#include <Arduino.h>
#include <ArduinoJson.h>

// Traiter la commande BRIGHTNESS (définir la luminosité)
bool handleBrightnessCommand(JsonDocument& doc);

// Traiter la commande BRIGHTNESS_GET (récupérer la luminosité)
bool handleGetBrightnessCommand(JsonDocument& doc);

#endif // BRIGHTNESS_COMMAND_H
