#ifndef TASK_MANAGER_H
#define TASK_MANAGER_H

#include <Arduino.h>
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#include <freertos/queue.h>

// Structure pour les commandes de sauvegarde SD
struct SaveConfigCommand {
  bool saveRequested;
};

// Initialiser le gestionnaire de tâches
bool initTaskManager();

// Démarrer toutes les tâches
void startTaskManager();

// Demander une sauvegarde de configuration (non bloquant)
void requestConfigSave();

// Obtenir la queue de sauvegarde (pour la tâche de sauvegarde)
QueueHandle_t getSaveQueue();

#endif // TASK_MANAGER_H
