#ifndef MODEL_BASIC_DEFAULT_CONFIG_H
#define MODEL_BASIC_DEFAULT_CONFIG_H

/**
 * Configuration par défaut du modèle Kidoo Basic
 * 
 * Ces valeurs sont utilisées lorsque :
 * - Le fichier config.json n'existe pas sur la carte SD
 * - Le fichier config.json est invalide
 * - Première utilisation du Kidoo Basic
 */

// ============================================
// Configuration par défaut - Basic
// ============================================

// Nom du dispositif par défaut
#define DEFAULT_DEVICE_NAME "Kidoo-Basic"

// Configuration WiFi par défaut (vide = non configuré)
#define DEFAULT_WIFI_SSID ""
#define DEFAULT_WIFI_PASSWORD ""

// Luminosité LED par défaut (0-255) - 50% = 128
#define DEFAULT_LED_BRIGHTNESS 128

#endif // MODEL_BASIC_DEFAULT_CONFIG_H
