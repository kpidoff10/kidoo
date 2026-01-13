#ifndef CONFIG_H
#define CONFIG_H

// Configuration WiFi
#define WIFI_SSID "Kidoo"
#define WIFI_AP_PASSWORD ""  // Vide par défaut, peut être configuré

// Configuration Bluetooth
#define BLUETOOTH_NAME "Kidoo"

// Modèle de Kidoo
#define KIDOO_MODEL "basic"  // Modèle classique par défaut

// Configuration LEDs
#define NUM_LEDS_DEFINE 144
#define LED_DATA_PIN 2
#define DEFAULT_BRIGHTNESS 255

// Configuration Serial
#define SERIAL_BAUD_RATE 115200
#define SERIAL_TIMEOUT_MS 3000

// Configuration Mode Sommeil
#define SLEEP_TIMEOUT_MS 30000        // Délai avant activation du mode sommeil (30 secondes)
#define SLEEP_TRANSITION_START_MS 24000  // Délai avant la transition vers le sommeil (24 secondes)

#endif // CONFIG_H
