#ifndef NFC_COMMAND_H
#define NFC_COMMAND_H

#include <Arduino.h>
#include <ArduinoJson.h>

// Commande pour lire un tag NFC
bool handleReadNFCTagCommand(JsonDocument& doc);

// Commande pour écrire sur un tag NFC
bool handleWriteNFCTagCommand(JsonDocument& doc);

// Commande pour afficher l'effet de succès lors de l'ajout d'un tag
bool handleTagAddSuccessCommand(JsonDocument& doc);

// Initialiser la tâche NFC (à appeler dans setup)
void initNFCTask();

#endif // NFC_COMMAND_H
