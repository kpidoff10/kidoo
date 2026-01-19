/**
 * Commandes spécifiques au modèle Kidoo Basic
 */

import type { CommandHandler, CommandDefinition } from '../index';
import { sendCommand, isPubNubConfigured, publishToKidoo } from '@/lib/pubnub';
import { prisma } from '@/lib/prisma';

// Définitions des commandes Basic
export const definitions: CommandDefinition[] = [
  {
    name: 'play-audio',
    description: 'Joue un fichier audio depuis la carte SD',
    params: [
      {
        name: 'file',
        type: 'string',
        required: true,
        description: 'Chemin du fichier audio (ex: /music.mp3)',
      },
    ],
  },
  {
    name: 'stop-audio',
    description: 'Arrête la lecture audio en cours',
  },
  {
    name: 'volume',
    description: 'Change le volume audio',
    params: [
      {
        name: 'value',
        type: 'number',
        required: true,
        description: 'Volume (0-21)',
        min: 0,
        max: 21,
      },
    ],
  },
  {
    name: 'nfc-read',
    description: 'Lit un tag NFC',
    params: [
      {
        name: 'block',
        type: 'number',
        required: false,
        description: 'Numéro du bloc à lire (0-63, optionnel)',
        min: 0,
        max: 63,
      },
    ],
  },
  {
    name: 'storage-info',
    description: 'Récupère les informations de stockage de la carte SD',
  },
];

// Handler: play-audio
const playAudioHandler: CommandHandler = async (kidoo, params) => {
  const file = params.file as string;

  // Validation
  if (!file || typeof file !== 'string') {
    return {
      success: false,
      error: 'Le chemin du fichier est requis',
      status: 400,
    };
  }

  // Vérifier PubNub
  if (!isPubNubConfigured()) {
    return {
      success: false,
      error: 'PubNub non configuré sur le serveur',
      status: 503,
    };
  }

  // Envoyer la commande série via PubNub
  const command = `audio-play ${file}`;
  const sent = await publishToKidoo(kidoo.macAddress!, command);

  if (!sent) {
    return {
      success: false,
      error: 'Échec de l\'envoi de la commande',
      status: 502,
    };
  }

  return {
    success: true,
    message: `Lecture de ${file}`,
    data: { file },
  };
};

// Handler: stop-audio
const stopAudioHandler: CommandHandler = async (kidoo) => {
  // Vérifier PubNub
  if (!isPubNubConfigured()) {
    return {
      success: false,
      error: 'PubNub non configuré sur le serveur',
      status: 503,
    };
  }

  // Envoyer la commande série via PubNub
  const sent = await publishToKidoo(kidoo.macAddress!, 'audio-stop');

  if (!sent) {
    return {
      success: false,
      error: 'Échec de l\'envoi de la commande',
      status: 502,
    };
  }

  return {
    success: true,
    message: 'Lecture arrêtée',
  };
};

// Handler: volume
const volumeHandler: CommandHandler = async (kidoo, params) => {
  const value = params.value as number;

  // Validation
  if (typeof value !== 'number' || value < 0 || value > 21) {
    return {
      success: false,
      error: 'Le volume doit être entre 0 et 21',
      status: 400,
    };
  }

  // Vérifier PubNub
  if (!isPubNubConfigured()) {
    return {
      success: false,
      error: 'PubNub non configuré sur le serveur',
      status: 503,
    };
  }

  // Envoyer la commande série via PubNub
  const command = `audio-volume ${value}`;
  const sent = await publishToKidoo(kidoo.macAddress!, command);

  if (!sent) {
    return {
      success: false,
      error: 'Échec de l\'envoi de la commande',
      status: 502,
    };
  }

  return {
    success: true,
    message: `Volume défini à ${value}/21`,
    data: { volume: value },
  };
};

// Handler: nfc-read
const nfcReadHandler: CommandHandler = async (kidoo, params) => {
  const block = params.block as number | undefined;

  // Validation
  if (block !== undefined && (typeof block !== 'number' || block < 0 || block > 63)) {
    return {
      success: false,
      error: 'Le bloc doit être entre 0 et 63',
      status: 400,
    };
  }

  // Vérifier PubNub
  if (!isPubNubConfigured()) {
    return {
      success: false,
      error: 'PubNub non configuré sur le serveur',
      status: 503,
    };
  }

  // Envoyer la commande série via PubNub
  const command = block !== undefined ? `nfc-read ${block}` : 'nfc-read';
  const sent = await publishToKidoo(kidoo.macAddress!, command);

  if (!sent) {
    return {
      success: false,
      error: 'Échec de l\'envoi de la commande',
      status: 502,
    };
  }

  return {
    success: true,
    message: 'Commande NFC envoyée, approchez un tag',
    data: { block },
  };
};

// Handler: storage-info
const storageInfoHandler: CommandHandler = async (kidoo) => {
  // Récupérer les données depuis la base
  if (!kidoo.configBasic) {
    return {
      success: false,
      error: 'Configuration Basic non trouvée',
      status: 404,
    };
  }

  const config = kidoo.configBasic;

  return {
    success: true,
    message: 'Informations de stockage',
    data: {
      totalBytes: config.storageTotalBytes ? Number(config.storageTotalBytes) : null,
      freeBytes: config.storageFreeBytes ? Number(config.storageFreeBytes) : null,
      usedBytes: config.storageUsedBytes ? Number(config.storageUsedBytes) : null,
      freePercent: config.storageFreePercent,
      usedPercent: config.storageUsedPercent,
      lastUpdated: config.storageLastUpdated?.toISOString() || null,
    },
  };
};

// Export des handlers
export const handlers: Record<string, CommandHandler> = {
  'play-audio': playAudioHandler,
  'playaudio': playAudioHandler, // alias
  'audio-play': playAudioHandler, // alias
  'stop-audio': stopAudioHandler,
  'stopaudio': stopAudioHandler, // alias
  'audio-stop': stopAudioHandler, // alias
  'volume': volumeHandler,
  'audio-volume': volumeHandler, // alias
  'nfc-read': nfcReadHandler,
  'nfcread': nfcReadHandler, // alias
  'storage-info': storageInfoHandler,
  'storageinfo': storageInfoHandler, // alias
  'storage': storageInfoHandler, // alias
};
