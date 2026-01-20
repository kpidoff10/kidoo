#ifndef AUDIO_MANAGER_H
#define AUDIO_MANAGER_H

#include <Arduino.h>
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#include "../../config/core_config.h"

/**
 * Gestionnaire Audio (MAX98357 via I2S) dans un thread séparé (Core 0)
 * 
 * Ce module gère la lecture de fichiers audio (MP3, WAV, etc.)
 * depuis la carte SD et la sortie via I2S vers les amplificateurs MAX98357.
 * Le traitement audio se fait dans un thread dédié avec priorité très élevée
 * pour garantir une lecture fluide sans saccades.
 * 
 * Architecture :
 * - Tourne sur Core 0 (CORE_AUDIO) avec le WiFi stack
 * - Priorité très haute (PRIORITY_AUDIO) car l'I2S/DMA est sensible au timing
 * - Évite les conflits avec LEDManager sur Core 1
 */

class AudioManager {
public:
  /**
   * Initialiser le gestionnaire audio
   * @return true si l'initialisation est réussie, false sinon
   */
  static bool init();
  
  /**
   * Vérifier si l'audio est disponible/opérationnel
   * @return true si l'audio est opérationnel, false sinon
   */
  static bool isAvailable();
  
  /**
   * Vérifier si l'audio est initialisé
   * @return true si l'audio est initialisé, false sinon
   */
  static bool isInitialized();
  
  /**
   * Jouer un fichier audio depuis la carte SD
   * @param filePath Chemin du fichier (ex: "/music.mp3")
   * @return true si la lecture a démarré, false sinon
   */
  static bool playFile(const char* filePath);
  
  /**
   * Arrêter la lecture en cours
   */
  static void stop();
  
  /**
   * Vérifier si un fichier est en cours de lecture
   * @return true si un fichier est en cours de lecture, false sinon
   */
  static bool isPlaying();
  
  /**
   * Mettre en pause / reprendre la lecture
   * @param pause true pour mettre en pause, false pour reprendre
   */
  static void pause(bool pause);
  
  /**
   * Définir le volume
   * @param volume Volume (0-21, où 21 = maximum)
   * @return true si le volume a été défini, false sinon
   */
  static bool setVolume(uint8_t volume);
  
  /**
   * Obtenir le volume actuel
   * @return Volume actuel (0-21)
   */
  static uint8_t getVolume();
  
  /**
   * Mettre à jour l'audio (déprécié - le thread gère maintenant)
   * @deprecated Le thread audio gère maintenant les mises à jour automatiquement
   */
  static void update();
  
  /**
   * Afficher les informations sur l'état de l'audio
   */
  static void printInfo();

private:
  /**
   * Tester le hardware audio
   * @return true si le hardware répond, false sinon
   */
  static bool testHardware();
  
  /**
   * Thread dédié pour le traitement audio
   * @param parameter Paramètre du thread (non utilisé)
   */
  static void audioTask(void* parameter);
  
  // Variables statiques
  static bool initialized;
  static bool available;
  static uint8_t currentVolume;
  static bool isPaused;
  static TaskHandle_t taskHandle;
  
  // Configuration du thread (centralisée dans core_config.h)
  static const int TASK_STACK_SIZE = STACK_SIZE_AUDIO;
  static const int TASK_PRIORITY = PRIORITY_AUDIO;
  static const int TASK_CORE = CORE_AUDIO;  // Core 0 pour éviter conflits avec LED
  static const int AUDIO_UPDATE_INTERVAL_MS = 1; // Intervalle entre les mises à jour (ms)
  static const int AUDIO_LOOPS_PER_UPDATE = 4;  // Nombre d'appels loop() par mise à jour
};

#endif // AUDIO_MANAGER_H
