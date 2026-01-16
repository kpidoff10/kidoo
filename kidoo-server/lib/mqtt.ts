/**
 * Service MQTT pour publier des notifications aux devices Kidoo
 * Utilise HiveMQ Cloud comme broker MQTT
 * 
 * Usage:
 * ```ts
 * import { publishKidooConfigUpdate } from '@/lib/mqtt';
 * await publishKidooConfigUpdate(kidooId, { brightness: 50, sleepTimeout: 60000 });
 * ```
 */

import mqtt, { type MqttClient } from 'mqtt';

// Configuration MQTT depuis les variables d'environnement
const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL || 'mqtts://broker.hivemq.com:8883';
const MQTT_USERNAME = process.env.MQTT_USERNAME;
const MQTT_PASSWORD = process.env.MQTT_PASSWORD;
const MQTT_ENABLED = process.env.MQTT_ENABLED !== 'false'; // Activé par défaut si non défini

// Client MQTT singleton (reconnecte automatiquement)
let mqttClient: MqttClient | null = null;
let isConnecting = false;

/**
 * Obtenir ou créer le client MQTT
 * Le client est réutilisé pour toutes les publications
 */
function getMqttClient(): MqttClient | null {
  // Si MQTT est désactivé, retourner null
  if (!MQTT_ENABLED) {
    return null;
  }

  // Si le client existe et est connecté, le retourner
  if (mqttClient && mqttClient.connected) {
    return mqttClient;
  }

  // Si on est déjà en train de se connecter, retourner null (éviter les connexions multiples)
  if (isConnecting) {
    return null;
  }

  // Créer un nouveau client
  try {
    isConnecting = true;

    const options: mqtt.IClientOptions = {
      clientId: `kidoo-server-${Date.now()}`,
      clean: true,
      reconnectPeriod: 5000, // Reconnexion automatique toutes les 5 secondes
      connectTimeout: 10000, // Timeout de connexion de 10 secondes
    };

    // Ajouter les credentials si fournis
    if (MQTT_USERNAME && MQTT_PASSWORD) {
      options.username = MQTT_USERNAME;
      options.password = MQTT_PASSWORD;
    }

    mqttClient = mqtt.connect(MQTT_BROKER_URL, options);

    // Gérer les événements de connexion
    mqttClient.on('connect', () => {
      console.log('[MQTT] Connecté au broker:', MQTT_BROKER_URL);
      isConnecting = false;
    });

    mqttClient.on('error', (error: Error) => {
      console.error('[MQTT] Erreur de connexion:', error);
      isConnecting = false;
    });

    mqttClient.on('close', () => {
      console.log('[MQTT] Connexion fermée');
      isConnecting = false;
    });

    mqttClient.on('offline', () => {
      console.log('[MQTT] Client hors ligne');
      isConnecting = false;
    });

    return mqttClient;
  } catch (error) {
    console.error('[MQTT] Erreur lors de la création du client:', error);
    isConnecting = false;
    return null;
  }
}

/**
 * Publier une mise à jour de configuration pour un Kidoo
 * @param kidooId - ID du Kidoo
 * @param config - Configuration à publier (brightness, sleepTimeout, etc.)
 */
export async function publishKidooConfigUpdate(
  kidooId: string,
  config: {
    brightness?: number;
    sleepTimeout?: number;
    [key: string]: unknown;
  }
): Promise<void> {
  // Si MQTT est désactivé, ne rien faire
  if (!MQTT_ENABLED) {
    console.log('[MQTT] MQTT désactivé, publication ignorée');
    return;
  }

  const client = getMqttClient();
  if (!client) {
    console.warn('[MQTT] Client MQTT non disponible, publication ignorée');
    return;
  }

  // Attendre que le client soit connecté (max 5 secondes)
  if (!client.connected) {
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Timeout de connexion MQTT'));
      }, 5000);

      client.once('connect', () => {
        clearTimeout(timeout);
        resolve();
      });

      client.once('error', (error: Error) => {
        clearTimeout(timeout);
        reject(error);
      });
    }).catch((error) => {
      console.error('[MQTT] Erreur lors de l\'attente de la connexion:', error);
      return;
    });
  }

  // Topic MQTT: kidoos/{kidooId}/config
  const topic = `kidoos/${kidooId}/config`;

  // Préparer le message (JSON)
  const message = JSON.stringify({
    timestamp: new Date().toISOString(),
    ...config,
  });

  try {
    // Publier le message
    client.publish(topic, message, { qos: 1 }, (error: Error | undefined) => {
      if (error) {
        console.error(`[MQTT] Erreur lors de la publication sur ${topic}:`, error);
      } else {
        console.log(`[MQTT] Message publié sur ${topic}:`, message);
      }
    });
  } catch (error) {
    console.error(`[MQTT] Erreur lors de la publication sur ${topic}:`, error);
  }
}

/**
 * Fermer la connexion MQTT (utile pour les tests ou l'arrêt propre)
 */
export function closeMqttConnection(): void {
  if (mqttClient) {
    mqttClient.end();
    mqttClient = null;
    isConnecting = false;
  }
}
