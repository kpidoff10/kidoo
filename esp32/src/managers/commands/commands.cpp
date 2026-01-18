#include "commands.h"
#include "../ble_manager.h"
#include "setup/command.h"
#include "brightness/command.h"
#include "color/command.h"
#include "sleep_timeout/command.h"
#include "version/command.h"
#include "storage/command.h"
#include "nfc/command.h"
#include <ArduinoJson.h>

bool processBLECommand(JsonDocument& doc, String& bleBuffer) {
  String command = doc["command"] | "";
  
  if (command == "SETUP") {
    bool handled = handleSetupCommand(doc);
    if (handled) {
      bleBuffer = "";
    }
    return handled;
  } else if (command == "BRIGHTNESS_SET" || command == "BRIGHTNESS") {
    // Support des deux formats pour compatibilité (BRIGHTNESS sera déprécié)
    bool handled = handleBrightnessCommand(doc);
    if (handled) {
      bleBuffer = "";
    }
    return handled;
  } else if (command == "BRIGHTNESS_GET" || command == "GET_BRIGHTNESS") {
    // Support des deux formats pour compatibilité (GET_BRIGHTNESS sera déprécié)
    bool handled = handleGetBrightnessCommand(doc);
    if (handled) {
      bleBuffer = "";
    }
    return handled;
  } else if (command == "COLOR_SET" || command == "COLOR") {
    // Support des deux formats pour compatibilité (COLOR sera déprécié)
    bool handled = handleColorCommand(doc);
    if (handled) {
      bleBuffer = "";
    }
    return handled;
  } else if (command == "SLEEP_TIMEOUT_SET" || command == "SLEEP_TIMEOUT") {
    // Support des deux formats pour compatibilité (SLEEP_TIMEOUT sera déprécié)
    bool handled = handleSleepTimeoutCommand(doc);
    if (handled) {
      bleBuffer = "";
    }
    return handled;
  } else if (command == "SLEEP_TIMEOUT_GET" || command == "GET_SLEEP_TIMEOUT") {
    // Support des deux formats pour compatibilité (GET_SLEEP_TIMEOUT sera déprécié)
    bool handled = handleGetSleepTimeoutCommand(doc);
    if (handled) {
      bleBuffer = "";
    }
    return handled;
  } else if (command == "VERSION") {
    bool handled = handleVersionCommand(doc);
    if (handled) {
      bleBuffer = "";
    }
    return handled;
  } else if (command == "GET_STORAGE") {
    bool handled = handleGetStorageCommand(doc);
    if (handled) {
      bleBuffer = "";
    }
    return handled;
  } else if (command == "READ_NFC_TAG") {
    bool handled = handleReadNFCTagCommand(doc);
    if (handled) {
      bleBuffer = "";
    }
    return handled;
  } else if (command == "WRITE_NFC_TAG") {
    bool handled = handleWriteNFCTagCommand(doc);
    if (handled) {
      bleBuffer = "";
    }
    return handled;
  } else if (command == "TAG_ADD_SUCCESS") {
    bool handled = handleTagAddSuccessCommand(doc);
    if (handled) {
      bleBuffer = "";
    }
    return handled;
  } else {
    // Commande inconnue
    JsonDocument errorDoc;
    errorDoc["status"] = "error";
    errorDoc["message"] = "UNKNOWN_COMMAND";
    errorDoc["error"] = "Commande inconnue";
    String errorResponse;
    serializeJson(errorDoc, errorResponse);
    sendBLEData(errorResponse.c_str());
    Serial.print("[BLE] Commande inconnue: ");
    Serial.println(command);
    bleBuffer = "";
    return false;
  }
}
