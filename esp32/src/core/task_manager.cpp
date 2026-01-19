#include "task_manager.h"
#include "mode_manager.h"
#include "state_manager.h"
#include "led_controller.h"
#include "../effects/led_effects.h"
#include "../managers/config_manager.h"

// Queue pour les commandes de sauvegarde SD
static QueueHandle_t saveConfigQueue = nullptr;

// Handle de la tâche LED
static TaskHandle_t ledTaskHandle = nullptr;
static TaskHandle_t saveTaskHandle = nullptr;

// Priorités des tâches
#define LED_TASK_PRIORITY 1
#define SAVE_TASK_PRIORITY 2
#define LED_TASK_STACK_SIZE 2048  // Réduit de 4096 à 2048 pour économiser la mémoire
#define SAVE_TASK_STACK_SIZE 2048  // Réduit de 4096 à 2048 pour économiser la mémoire

// Tâche dédiée pour les LEDs - tourne en continu
void ledTask(void* parameter) {
  Serial.println("[TASK] Tâche LED démarrée");
  
  while (true) {
    // Ne pas appliquer de mode pendant l'initialisation (la tâche orange s'en charge)
    if (StateManager::isInitializing()) {
      // Pendant le boot, laisser la tâche orange gérer les LEDs
      vTaskDelay(pdMS_TO_TICKS(100));
      continue;
    }
    
    // Utiliser le mode actuel depuis StateManager (mis à jour par le loop principal)
    Mode currentMode = StateManager::getCurrentMode();
    
    // Appliquer le mode actuel
    ModeManager::applyMode(currentMode);
    
    // Petite pause pour permettre aux autres tâches de s'exécuter
    // Les delays sont déjà gérés dans applyMode, donc on fait juste un yield
    vTaskDelay(pdMS_TO_TICKS(1));
  }
}

// Tâche dédiée pour les sauvegardes SD - traite les commandes de la queue
void saveTask(void* parameter) {
  Serial.println("[TASK] Tâche de sauvegarde SD démarrée");
  
  SaveConfigCommand cmd;
  
  while (true) {
    // Attendre une commande de sauvegarde (timeout de 100ms pour permettre le yield)
    if (xQueueReceive(saveConfigQueue, &cmd, pdMS_TO_TICKS(100)) == pdTRUE) {
      if (cmd.saveRequested) {
        Serial.println("[TASK] Sauvegarde de configuration demandée...");
        bool success = saveKidooConfigToSD();
        if (success) {
          Serial.println("[TASK] Configuration sauvegardée avec succès");
        } else {
          Serial.println("[TASK] Échec de la sauvegarde de configuration");
        }
      }
    }
    
    // Yield pour permettre aux autres tâches de s'exécuter
    vTaskDelay(pdMS_TO_TICKS(10));
  }
}

bool initTaskManager() {
  Serial.println("[TASK] Initialisation du gestionnaire de tâches...");
  
  // Créer la queue pour les commandes de sauvegarde
  saveConfigQueue = xQueueCreate(5, sizeof(SaveConfigCommand));
  if (saveConfigQueue == nullptr) {
    Serial.println("[TASK] ERREUR: Impossible de créer la queue de sauvegarde");
    return false;
  }
  
  Serial.println("[TASK] Queue de sauvegarde créée");
  return true;
}

void startTaskManager() {
  Serial.println("[TASK] Démarrage des tâches...");
  
  // Afficher la mémoire libre avant de créer les tâches
  Serial.print("[TASK] Mémoire heap libre avant création: ");
  Serial.print(ESP.getFreeHeap());
  Serial.println(" bytes");
  
  // Attendre un peu pour s'assurer que la tâche orange boot est bien terminée
  vTaskDelay(pdMS_TO_TICKS(500));
  
  // Créer la tâche LED (sur le core 1 pour éviter les conflits avec WiFi/BLE sur core 0)
  BaseType_t result = xTaskCreatePinnedToCore(
    ledTask,
    "LED_Task",
    LED_TASK_STACK_SIZE,
    nullptr,
    LED_TASK_PRIORITY,
    &ledTaskHandle,
    1  // Core 1
  );
  
  if (result != pdPASS || ledTaskHandle == nullptr) {
    Serial.print("[TASK] ERREUR: Impossible de créer la tâche LED (code: ");
    Serial.print(result);
    Serial.print(", mémoire libre: ");
    Serial.print(ESP.getFreeHeap());
    Serial.println(" bytes)");
    return;
  }
  
  Serial.print("[TASK] Tâche LED créée sur le core 1 (mémoire libre: ");
  Serial.print(ESP.getFreeHeap());
  Serial.println(" bytes)");
  
  // Créer la tâche de sauvegarde (sur le core 0)
  BaseType_t result2 = xTaskCreatePinnedToCore(
    saveTask,
    "Save_Task",
    SAVE_TASK_STACK_SIZE,
    nullptr,
    SAVE_TASK_PRIORITY,
    &saveTaskHandle,
    0  // Core 0
  );
  
  if (result2 != pdPASS || saveTaskHandle == nullptr) {
    Serial.print("[TASK] ERREUR: Impossible de créer la tâche de sauvegarde (code: ");
    Serial.print(result2);
    Serial.print(", mémoire libre: ");
    Serial.print(ESP.getFreeHeap());
    Serial.println(" bytes)");
    return;
  }
  
  Serial.print("[TASK] Tâche de sauvegarde créée sur le core 0 (mémoire libre: ");
  Serial.print(ESP.getFreeHeap());
  Serial.println(" bytes)");
  Serial.println("[TASK] Toutes les tâches démarrées avec succès");
}

void requestConfigSave() {
  if (saveConfigQueue == nullptr) {
    Serial.println("[TASK] ERREUR: Queue de sauvegarde non initialisée");
    return;
  }
  
  SaveConfigCommand cmd;
  cmd.saveRequested = true;
  
  // Envoyer la commande dans la queue (non bloquant)
  if (xQueueSend(saveConfigQueue, &cmd, 0) != pdTRUE) {
    Serial.println("[TASK] ATTENTION: Queue de sauvegarde pleine, la commande sera ignorée");
  } else {
    Serial.println("[TASK] Commande de sauvegarde ajoutée à la queue");
  }
}

QueueHandle_t getSaveQueue() {
  return saveConfigQueue;
}
