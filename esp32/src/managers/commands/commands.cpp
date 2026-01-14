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
  } else if (command == "BRIGHTNESS") {
    bool handled = handleBrightnessCommand(doc);
    if (handled) {
      bleBuffer = "";
    }
    return handled;
  } else if (command == "GET_BRIGHTNESS") {
    bool handled = handleGetBrightnessCommand(doc);
    if (handled) {
      bleBuffer = "";
    }
    return handled;
  } else if (command == "COLOR") {
    bool handled = handleColorCommand(doc);
    if (handled) {
      bleBuffer = "";
    }
    return handled;
  } else if (command == "SLEEP_TIMEOUT") {
    bool handled = handleSleepTimeoutCommand(doc);
    if (handled) {
      bleBuffer = "";
    }
    return handled;
  } else if (command == "GET_SLEEP_TIMEOUT") {
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
