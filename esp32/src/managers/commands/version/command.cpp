#include "command.h"
#include "../../ble_manager.h"
#include "../../../config/version.h"
#include "../../../config/config.h"

bool handleVersionCommand(JsonDocument& doc) {
  // Commande pour récupérer la version du firmware
  JsonDocument versionDoc;
  versionDoc["status"] = "success";
  versionDoc["message"] = "VERSION";
  versionDoc["firmwareVersion"] = FIRMWARE_VERSION_STRING;
  versionDoc["model"] = KIDOO_MODEL;
  String versionResponse;
  serializeJson(versionDoc, versionResponse);
  sendBLEData(versionResponse.c_str());
  Serial.print("[BLE] Version envoyee: ");
  Serial.println(FIRMWARE_VERSION_STRING);
  
  return true;
}
