#ifndef PUBNUB_MANAGER_H
#define PUBNUB_MANAGER_H

#include <Arduino.h>

/**
 * Gestionnaire PubNub (Thread séparé)
 * 
 * Ce module gère la connexion à PubNub pour recevoir
 * des commandes à distance via HTTP.
 * Tourne dans un thread FreeRTOS séparé pour ne pas bloquer le loop principal.
 */

class PubNubManager {
public:
  /**
   * Initialiser le client PubNub et démarrer le thread
   * @return true si l'initialisation réussit
   */
  static bool init();
  
  /**
   * Se connecter à PubNub (subscribe au channel)
   * @return true si la connexion réussit
   */
  static bool connect();
  
  /**
   * Se déconnecter de PubNub
   */
  static void disconnect();
  
  /**
   * Vérifier si le client est connecté
   * @return true si connecté
   */
  static bool isConnected();
  
  /**
   * Vérifier si le client est initialisé
   * @return true si initialisé
   */
  static bool isInitialized();
  
  /**
   * Vérifier si PubNub est disponible (WiFi connecté + config valide)
   * @return true si disponible
   */
  static bool isAvailable();
  
  /**
   * Boucle de maintenance PubNub (appelée automatiquement par le thread)
   * Ne fait rien si appelée manuellement - le thread gère tout
   */
  static void loop();
  
  /**
   * Publier un message sur le channel (thread-safe)
   * @param message Le message à publier
   * @return true si la publication réussit
   */
  static bool publish(const char* message);
  
  /**
   * Publier le statut du device
   * @return true si la publication réussit
   */
  static bool publishStatus();
  
  /**
   * Afficher les informations PubNub
   */
  static void printInfo();
  
  /**
   * Obtenir le channel
   * @return Le nom du channel
   */
  static const char* getChannel();

private:
  // Fonction du thread FreeRTOS
  static void threadFunction(void* parameter);
  
  // Effectuer un subscribe (long polling)
  static bool subscribe();
  
  // Traiter les messages reçus
  static void processMessages(const char* json);
  
  // Exécuter une commande reçue
  static void executeCommand(const char* command);
  
  // Publication interne (appelée depuis le thread)
  static bool publishInternal(const char* message);
  
  // Variables statiques
  static bool initialized;
  static bool connected;
  static bool threadRunning;
  static char channel[64];
  static char timeToken[32];
  static TaskHandle_t taskHandle;
  
  // File d'attente pour les messages à publier
  static QueueHandle_t publishQueue;
  
  // Configuration
  static const int SUBSCRIBE_INTERVAL_MS = 100;  // Intervalle entre les polls (le serveur garde la connexion)
  static const int STACK_SIZE = 8192;            // Taille de la stack du thread
  static const int TASK_PRIORITY = 0;            // Priorité du thread (très basse - lowest priority)
  static const int PUBLISH_QUEUE_SIZE = 5;       // Taille de la file de publication
};

#endif // PUBNUB_MANAGER_H
