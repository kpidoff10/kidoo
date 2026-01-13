#ifndef SLEEP_TIMEOUT_COMMAND_H
#define SLEEP_TIMEOUT_COMMAND_H

#include <Arduino.h>
#include <ArduinoJson.h>

// Traiter la commande SLEEP_TIMEOUT (définir le timeout de sommeil)
bool handleSleepTimeoutCommand(JsonDocument& doc);

// Traiter la commande GET_SLEEP_TIMEOUT (récupérer le timeout de sommeil)
bool handleGetSleepTimeoutCommand(JsonDocument& doc);

#endif // SLEEP_TIMEOUT_COMMAND_H
