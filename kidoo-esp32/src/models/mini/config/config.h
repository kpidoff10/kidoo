#ifndef MODEL_MINI_CONFIG_H
#define MODEL_MINI_CONFIG_H

/**
 * Configuration du modèle Kidoo Mini
 * 
 * Ce fichier contient toutes les configurations spécifiques au modèle Mini :
 * - Pins GPIO pour les bandes LED
 * - Nombre de LEDs
 * - Configuration de la carte SD
 * - Composants disponibles
 */

// ============================================
// Configuration des bandes LED
// ============================================

// Pin de données pour la bande LED principale
#define LED_DATA_PIN 2

// Nombre de LEDs sur la bande principale (Mini a moins de LEDs)
#define NUM_LEDS 60

// Type de LED (WS2812B, WS2811, etc.)
// Options: NEOPIXEL, WS2812B, WS2811, SK6812, etc.
#define LED_TYPE NEOPIXEL

// Ordre des couleurs (RGB, GRB, BGR, etc.)
// La plupart des WS2812B utilisent GRB
#define COLOR_ORDER GRB

// ============================================
// Configuration de la carte SD (SPI)
// ============================================

// Pins SPI pour la carte SD (peuvent être différents sur Mini)
#define SD_MOSI_PIN 23      // GPIO 23 (VSPI MOSI)
#define SD_MISO_PIN 19      // GPIO 19 (VSPI MISO)
#define SD_SCK_PIN 18       // GPIO 18 (VSPI SCK)
#define SD_CS_PIN 5         // GPIO 5 (Chip Select)

// ============================================
// Configuration RTC DS3231 (I2C)
// ============================================

// Le DS3231 utilise le bus I2C standard
#define RTC_SDA_PIN 21      // GPIO 21 (I2C SDA)
#define RTC_SCL_PIN 22      // GPIO 22 (I2C SCL)

// Adresse I2C du DS3231 (fixe)
#define RTC_I2C_ADDRESS 0x68

// ============================================
// Composants disponibles sur ce modèle
// ============================================

#define HAS_SD_CARD true
#define HAS_WIFI true
#define HAS_BLE true
#define HAS_PUBNUB true
#define HAS_RTC true

#endif // MODEL_MINI_CONFIG_H
