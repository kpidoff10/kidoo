#ifndef MODEL_BASIC_CONFIG_H
#define MODEL_BASIC_CONFIG_H

/**
 * Configuration du modèle Kidoo Basic
 * 
 * Ce fichier contient toutes les configurations spécifiques au modèle Basic :
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

// Nombre de LEDs sur la bande principale
#define NUM_LEDS 144

// Type de LED (WS2812B, WS2811, etc.)
// Options: NEOPIXEL, WS2812B, WS2811, SK6812, etc.
#define LED_TYPE NEOPIXEL

// Ordre des couleurs (RGB, GRB, BGR, etc.)
// La plupart des WS2812B utilisent GRB
#define COLOR_ORDER GRB

// ============================================
// Configuration de la carte SD (SPI)
// ============================================

// Pins SPI pour la carte SD
#define SD_MOSI_PIN 23      // GPIO 23 (VSPI MOSI)
#define SD_MISO_PIN 19      // GPIO 19 (VSPI MISO)
#define SD_SCK_PIN 18       // GPIO 18 (VSPI SCK)
#define SD_CS_PIN 5         // GPIO 5 (Chip Select)

// ============================================
// Configuration NFC (PN532 via I2C)
// ============================================

// Pins I2C pour le module NFC PN532
#define NFC_SDA_PIN 21      // GPIO 21 (I2C SDA)
#define NFC_SCL_PIN 22      // GPIO 22 (I2C SCL)
#define NFC_IRQ_PIN 4       // GPIO 4 (Interrupt - optionnel)
#define NFC_RST_PIN 16      // GPIO 16 (Reset - optionnel)

// Adresse I2C du PN532 (généralement 0x24 en mode I2C)
#define NFC_I2C_ADDRESS 0x24

// ============================================
// Configuration RTC DS3231 (I2C)
// ============================================

// Le DS3231 utilise le même bus I2C que le NFC
#define RTC_SDA_PIN 21      // GPIO 21 (I2C SDA)
#define RTC_SCL_PIN 22      // GPIO 22 (I2C SCL)

// Adresse I2C du DS3231 (fixe)
#define RTC_I2C_ADDRESS 0x68

// ============================================
// Configuration Potentiomètre WH148 (ADC)
// ============================================

// Pin analogique pour le potentiomètre
#define POTENTIOMETER_PIN 34  // GPIO 34 (ADC1_CH6) - Input only

// ============================================
// Composants disponibles sur ce modèle
// ============================================

#define HAS_SD_CARD true
#define HAS_WIFI true
#define HAS_BLE false
#define HAS_NFC true
#define HAS_PUBNUB true
#define HAS_RTC true
#define HAS_POTENTIOMETER true

#endif // MODEL_BASIC_CONFIG_H
