#ifndef PINS_H
#define PINS_H

// Configuration des broches GPIO pour la carte SD
// IMPORTANT: Utilisez les NUMEROS GPIO, pas les labels D1, D2, etc.

// Configuration actuelle (VSPI standard ESP32):
#define SD_MOSI_PIN 23  // GPIO 23 (VSPI MOSI)
#define SD_MISO_PIN 19  // GPIO 19 (VSPI MISO)
#define SD_SCK_PIN 18   // GPIO 18 (VSPI SCK)
#define SD_CS_PIN 5     // GPIO 5 (Chip Select)

// Alternative HSPI si VSPI ne fonctionne pas:
// #define SD_MOSI_PIN 13  // GPIO 13 (HSPI MOSI)
// #define SD_MISO_PIN 12  // GPIO 12 (HSPI MISO)
// #define SD_SCK_PIN 14   // GPIO 14 (HSPI SCK)
// #define SD_CS_PIN 5     // GPIO 5 (CS)

// Configuration des broches GPIO pour le module NFC (PN532 en mode I2C)
// Utilise I2C (Wire) pour la communication
#define NFC_SDA_PIN 21    // GPIO 21 (I2C SDA)
#define NFC_SCL_PIN 22    // GPIO 22 (I2C SCL)

#endif // PINS_H
