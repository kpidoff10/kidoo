# Configuration MQTT pour ESP32

Ce document explique comment configurer MQTT sur l'ESP32 pour recevoir les notifications de configuration depuis le serveur.

## Architecture

Quand l'application mobile modifie la configuration (brightness, sleepTimeout) :
1. Le serveur met à jour la base de données
2. Le serveur publie un message MQTT sur le topic `kidoos/{kidooId}/config`
3. L'ESP32 (abonné à ce topic) reçoit la notification
4. L'ESP32 applique automatiquement les changements

## Configuration

### 1. Kidoo ID

L'ESP32 doit connaître son Kidoo ID pour s'abonner au bon topic. Par défaut, l'ESP32 utilise l'adresse MAC comme ID :

```
kidoo-{MAC_ADDRESS}
```

Exemple : `kidoo-aabbccddeeff`

**Pour définir un Kidoo ID personnalisé :**
- Via BLE : Envoyer une commande de configuration (à implémenter)
- Via configuration SD : Stocker dans le fichier de config (à implémenter)

### 2. Broker MQTT

Par défaut, l'ESP32 utilise le broker public HiveMQ (non sécurisé) :
- Host: `broker.hivemq.com`
- Port: `1883` (non sécurisé)

**Pour utiliser HiveMQ Cloud (sécurisé) :**
1. Modifier `mqtt_manager.cpp` :
   - Changer `MQTT_BROKER_HOST` avec l'URL de votre cluster HiveMQ Cloud
   - Changer `MQTT_BROKER_PORT` à `8883` (TLS)
   - Utiliser `WiFiClientSecure` au lieu de `WiFiClient`
   - Ajouter les credentials (username/password)

### 3. Topic MQTT

Le topic utilisé est : `kidoos/{kidooId}/config`

Exemple : `kidoos/kidoo-aabbccddeeff/config`

## Format des messages

Le serveur publie des messages JSON au format suivant :

```json
{
  "timestamp": "2024-01-01T12:00:00.000Z",
  "brightness": 50,
  "sleepTimeout": 60000
}
```

L'ESP32 traite automatiquement :
- `brightness` : Met à jour la luminosité des LEDs
- `sleepTimeout` : Met à jour le timeout de sommeil

## Fonctionnement

### Initialisation

1. L'ESP32 se connecte au WiFi
2. L'ESP32 génère un Kidoo ID basé sur l'adresse MAC (si non configuré)
3. L'ESP32 se connecte au broker MQTT
4. L'ESP32 s'abonne au topic `kidoos/{kidooId}/config`

### Réception des messages

Quand un message est reçu :
1. L'ESP32 parse le JSON
2. L'ESP32 vérifie que le topic correspond
3. L'ESP32 applique les changements (brightness, sleepTimeout)
4. L'ESP32 sauvegarde la configuration sur la SD
5. L'ESP32 réinitialise le timer de sommeil

### Reconnexion automatique

Si la connexion MQTT est perdue :
- L'ESP32 tente de se reconnecter toutes les 5 secondes
- La reconnexion est automatique et transparente

## Dépendances

La bibliothèque `PubSubClient` est déjà ajoutée dans `platformio.ini` :
```ini
lib_deps = 
    knolleary/PubSubClient@^2.8
```

## Dépannage

### L'ESP32 ne se connecte pas au broker

1. Vérifier que le WiFi est connecté
2. Vérifier que le broker est accessible
3. Vérifier les logs série pour les erreurs

### L'ESP32 ne reçoit pas les messages

1. Vérifier que le Kidoo ID est correct
2. Vérifier que le topic correspond : `kidoos/{kidooId}/config`
3. Vérifier que l'ESP32 est bien abonné (logs série)

### Les changements ne sont pas appliqués

1. Vérifier les logs série pour les erreurs de parsing JSON
2. Vérifier que les handlers de commandes fonctionnent
3. Vérifier que la configuration est sauvegardée

## Logs

Les logs MQTT sont préfixés avec `[MQTT]` :
- `[MQTT] Initialisation du client MQTT...`
- `[MQTT] Connecté au broker avec succès`
- `[MQTT] Abonné au topic avec succès`
- `[MQTT] Message reçu sur le topic: ...`
- `[MQTT] Configuration mise à jour depuis MQTT`
