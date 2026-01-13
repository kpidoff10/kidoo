#ifndef STORAGE_COMMAND_H
#define STORAGE_COMMAND_H

#include <Arduino.h>
#include <ArduinoJson.h>

bool handleGetStorageCommand(JsonDocument& doc);

#endif // STORAGE_COMMAND_H
