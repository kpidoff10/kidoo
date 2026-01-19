/**
 * Service PubNub pour publier des commandes aux devices Kidoo (ESP32)
 * 
 * Chaque Kidoo écoute sur un channel unique basé sur son adresse MAC:
 * - Channel format: kidoo-{MAC_ADDRESS} (ex: kidoo-AABBCCDDEEFF)
 * 
 * @example
 * import { publishToKidoo } from '@/lib/pubnub';
 * 
 * // Envoyer une commande
 * await publishToKidoo('AABBCCDDEEFF', { action: 'brightness', value: 80 });
 */

// Configuration PubNub depuis les variables d'environnement
const PUBNUB_PUBLISH_KEY = process.env.PUBNUB_PUBLISH_KEY || '';
const PUBNUB_SUBSCRIBE_KEY = process.env.PUBNUB_SUBSCRIBE_KEY || '';
const PUBNUB_ORIGIN = 'ps.pndsn.com';

/**
 * Vérifie si PubNub est configuré
 */
export function isPubNubConfigured(): boolean {
  return PUBNUB_PUBLISH_KEY.length > 0 && PUBNUB_SUBSCRIBE_KEY.length > 0;
}

/**
 * Construit le nom du channel PubNub pour un Kidoo
 * @param macAddress L'adresse MAC du Kidoo (avec ou sans séparateurs)
 * @returns Le nom du channel (ex: kidoo-AABBCCDDEEFF)
 */
export function getKidooChannel(macAddress: string): string {
  // Nettoyer l'adresse MAC (enlever les : et -)
  const cleanMac = macAddress.replace(/[:-]/g, '').toUpperCase();
  return `kidoo-${cleanMac}`;
}

/**
 * Encode un message pour l'URL PubNub
 */
function encodeMessage(message: string): string {
  let encoded = message;
  
  // Si ce n'est pas déjà un JSON, l'envelopper dans des guillemets
  if (!message.startsWith('{') && !message.startsWith('[')) {
    encoded = `"${message}"`;
  }
  
  // URL encode les caractères spéciaux
  encoded = encoded
    .replace(/"/g, '%22')
    .replace(/ /g, '%20')
    .replace(/{/g, '%7B')
    .replace(/}/g, '%7D')
    .replace(/:/g, '%3A')
    .replace(/,/g, '%2C')
    .replace(/\[/g, '%5B')
    .replace(/\]/g, '%5D');
  
  return encoded;
}

/**
 * Publie un message sur un channel PubNub
 * @param channel Le nom du channel
 * @param message Le message à publier (objet ou string)
 * @returns true si la publication réussit
 */
export async function publishToChannel(
  channel: string,
  message: Record<string, unknown> | string
): Promise<boolean> {
  console.log(`[PUBNUB] Tentative de publication sur channel: ${channel}`);
  console.log(`[PUBNUB] Message:`, message);
  console.log(`[PUBNUB] PUBLISH_KEY configurée: ${PUBNUB_PUBLISH_KEY ? 'Oui (' + PUBNUB_PUBLISH_KEY.substring(0, 10) + '...)' : 'Non'}`);
  console.log(`[PUBNUB] SUBSCRIBE_KEY configurée: ${PUBNUB_SUBSCRIBE_KEY ? 'Oui (' + PUBNUB_SUBSCRIBE_KEY.substring(0, 10) + '...)' : 'Non'}`);

  if (!isPubNubConfigured()) {
    console.warn('[PUBNUB] PubNub non configuré (clés manquantes)');
    return false;
  }

  try {
    // Convertir le message en JSON si c'est un objet
    const messageStr = typeof message === 'string' 
      ? message 
      : JSON.stringify(message);
    
    const encodedMessage = encodeMessage(messageStr);
    
    // Construire l'URL de publication
    const url = `https://${PUBNUB_ORIGIN}/publish/${PUBNUB_PUBLISH_KEY}/${PUBNUB_SUBSCRIBE_KEY}/0/${channel}/0/${encodedMessage}`;
    
    console.log(`[PUBNUB] URL: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const responseText = await response.text();
    console.log(`[PUBNUB] Réponse (${response.status}): ${responseText}`);

    if (response.ok) {
      console.log(`[PUBNUB] Message publié sur ${channel}`);
      return true;
    } else {
      console.error(`[PUBNUB] Erreur publication: ${response.status} - ${responseText}`);
      return false;
    }
  } catch (error) {
    console.error('[PUBNUB] Erreur lors de la publication:', error);
    return false;
  }
}

/**
 * Publie un message vers un Kidoo spécifique
 * @param macAddress L'adresse MAC du Kidoo
 * @param message Le message/commande à envoyer
 * @returns true si la publication réussit
 */
export async function publishToKidoo(
  macAddress: string,
  message: Record<string, unknown> | string
): Promise<boolean> {
  const channel = getKidooChannel(macAddress);
  return publishToChannel(channel, message);
}

/**
 * Envoie une commande à un Kidoo
 * @param macAddress L'adresse MAC du Kidoo
 * @param action Le nom de l'action (ex: 'brightness', 'reboot')
 * @param params Les paramètres de l'action
 * @returns true si la publication réussit
 */
export async function sendCommand(
  macAddress: string,
  action: string,
  params?: Record<string, unknown>
): Promise<boolean> {
  const message = {
    action,
    ...params,
    timestamp: Date.now(),
  };
  
  return publishToKidoo(macAddress, message);
}

// Types pour les commandes
export interface CommandResult {
  success: boolean;
  error?: string;
}

// Commandes disponibles
export const Commands = {
  /**
   * Change la luminosité d'un Kidoo
   */
  brightness: (macAddress: string, value: number): Promise<boolean> => {
    return sendCommand(macAddress, 'brightness', { value });
  },

  /**
   * Change le timeout de veille
   */
  sleepTimeout: (macAddress: string, value: number): Promise<boolean> => {
    return sendCommand(macAddress, 'sleep-timeout', { value });
  },

  /**
   * Redémarre un Kidoo
   */
  reboot: (macAddress: string, delayMs?: number): Promise<boolean> => {
    return sendCommand(macAddress, 'reboot', delayMs ? { delay: delayMs } : undefined);
  },

  /**
   * Envoie une commande série brute
   */
  serial: (macAddress: string, command: string): Promise<boolean> => {
    return publishToKidoo(macAddress, command);
  },
} as const;
