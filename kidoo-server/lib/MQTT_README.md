# Configuration MQTT avec HiveMQ Cloud

Ce service permet de publier des notifications MQTT aux devices Kidoo (ESP32) quand la configuration est modifiée.

## Configuration

### 1. Créer un compte HiveMQ Cloud

1. Allez sur https://www.hivemq.com/mqtt-cloud-broker/
2. Créez un compte (gratuit)
3. Créez un cluster **Serverless** (plan gratuit)
4. Récupérez les informations de connexion :
   - URL du broker (ex: `mqtts://your-cluster.hivemq.cloud:8883`)
   - Username (votre email)
   - Password (généré dans le dashboard)

### 2. Variables d'environnement

Ajoutez ces variables dans votre fichier `.env` :

```env
# URL du broker MQTT (format: mqtts://host:port)
MQTT_BROKER_URL=mqtts://your-cluster.hivemq.cloud:8883

# Credentials MQTT (optionnel pour le plan Serverless gratuit)
MQTT_USERNAME=your-email@example.com
MQTT_PASSWORD=your-generated-password

# Activer/désactiver MQTT (par défaut: true)
MQTT_ENABLED=true
```

### 3. Installation

```bash
npm install
```

Les dépendances `mqtt` et `@types/mqtt` sont déjà ajoutées dans `package.json`.

## Utilisation

Le service MQTT est automatiquement utilisé dans les routes API qui modifient la configuration Basic :

- `PATCH /api/kidoos/[id]/config-basic` : Publie sur MQTT quand `brightness` ou `sleepTimeout` sont modifiés

### Topic MQTT

Les messages sont publiés sur le topic : `kidoos/{kidooId}/config`

### Format du message

```json
{
  "timestamp": "2024-01-01T12:00:00.000Z",
  "brightness": 50,
  "sleepTimeout": 60000
}
```

## Côté ESP32

L'ESP32 doit :
1. Se connecter au même broker MQTT
2. S'abonner au topic `kidoos/{kidooId}/config`
3. Appliquer les changements reçus

## Désactiver MQTT

Pour désactiver MQTT (par exemple en développement local sans broker) :

```env
MQTT_ENABLED=false
```

Les routes API continueront de fonctionner normalement, mais aucune publication MQTT ne sera effectuée.
