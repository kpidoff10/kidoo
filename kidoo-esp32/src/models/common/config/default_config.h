#ifndef COMMON_DEFAULT_CONFIG_H
#define COMMON_DEFAULT_CONFIG_H

/**
 * Configuration par défaut commune à tous les modèles
 * 
 * Ce fichier contient les valeurs par défaut qui sont
 * communes à tous les modèles Kidoo
 */

// ============================================
// Configuration par défaut commune
// ============================================

// Timeout pour le sleep mode (en millisecondes)
// 0 = désactivé, sinon temps d'inactivité avant extinction des LEDs
// Minimum: 5000 ms (5 secondes)
#define DEFAULT_SLEEP_TIMEOUT_MS 10000   // 10 secondes par défaut
#define MIN_SLEEP_TIMEOUT_MS 5000        // Minimum: 5 secondes
#define SLEEP_FADE_DURATION_MS 1000      // Durée de l'animation de fade-out (1 seconde)

// Version du firmware Kidoo
#define FIRMWARE_VERSION "1.0.0"

#endif // COMMON_DEFAULT_CONFIG_H
