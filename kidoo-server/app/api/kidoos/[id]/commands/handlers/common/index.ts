/**
 * Commandes communes à tous les modèles Kidoo
 */

import type { CommandHandler, CommandDefinition, KidooWithConfig } from '../index';
import { sendCommand, isPubNubConfigured } from '@/lib/pubnub';
import { prisma } from '@/lib/prisma';

// Définitions des commandes communes
export const definitions: CommandDefinition[] = [
  {
    name: 'brightness',
    description: 'Change la luminosité des LEDs',
    params: [
      {
        name: 'value',
        type: 'number',
        required: true,
        description: 'Luminosité en pourcentage (10-100)',
        min: 10,
        max: 100,
      },
    ],
  },
  {
    name: 'sleep-timeout',
    description: 'Change le délai avant mise en veille',
    params: [
      {
        name: 'value',
        type: 'number',
        required: true,
        description: 'Délai en millisecondes (5000-300000, 0 pour désactiver)',
        min: 0,
        max: 300000,
      },
    ],
  },
  {
    name: 'reboot',
    description: 'Redémarre le Kidoo',
    params: [
      {
        name: 'delay',
        type: 'number',
        required: false,
        description: 'Délai avant redémarrage en ms (optionnel)',
      },
    ],
  },
  {
    name: 'serial',
    description: 'Envoie une commande série brute',
    params: [
      {
        name: 'command',
        type: 'string',
        required: true,
        description: 'La commande série à exécuter',
      },
    ],
  },
];

// Handler: brightness
const brightnessHandler: CommandHandler = async (kidoo, params) => {
  const value = params.value as number;

  // Validation
  if (typeof value !== 'number' || value < 10 || value > 100) {
    return {
      success: false,
      error: 'La luminosité doit être entre 10 et 100',
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

  // Envoyer la commande via PubNub
  const sent = await sendCommand(kidoo.macAddress!, 'brightness', { value });

  if (!sent) {
    return {
      success: false,
      error: 'Échec de l\'envoi de la commande',
      status: 502,
    };
  }

  // Mettre à jour la config en base (si Basic)
  if (kidoo.model.toLowerCase() === 'basic' && kidoo.configBasic) {
    await prisma.kidooConfigBasic.update({
      where: { kidooId: kidoo.id },
      data: { brightness: value },
    });
  }

  return {
    success: true,
    message: `Luminosité définie à ${value}%`,
    data: { brightness: value },
  };
};

// Handler: sleep-timeout
const sleepTimeoutHandler: CommandHandler = async (kidoo, params) => {
  const value = params.value as number;

  // Validation
  if (typeof value !== 'number') {
    return {
      success: false,
      error: 'Le délai doit être un nombre',
      status: 400,
    };
  }

  if (value !== 0 && (value < 5000 || value > 300000)) {
    return {
      success: false,
      error: 'Le délai doit être 0 (désactivé) ou entre 5000 et 300000 ms',
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

  // Envoyer la commande via PubNub
  const sent = await sendCommand(kidoo.macAddress!, 'sleep-timeout', { value });

  if (!sent) {
    return {
      success: false,
      error: 'Échec de l\'envoi de la commande',
      status: 502,
    };
  }

  // Mettre à jour la config en base (si Basic)
  if (kidoo.model.toLowerCase() === 'basic' && kidoo.configBasic) {
    await prisma.kidooConfigBasic.update({
      where: { kidooId: kidoo.id },
      data: { sleepTimeout: value },
    });
  }

  return {
    success: true,
    message: value === 0 ? 'Veille désactivée' : `Délai de veille défini à ${value}ms`,
    data: { sleepTimeout: value },
  };
};

// Handler: reboot
const rebootHandler: CommandHandler = async (kidoo, params) => {
  const delay = params.delay as number | undefined;

  // Validation
  if (delay !== undefined && (typeof delay !== 'number' || delay < 0)) {
    return {
      success: false,
      error: 'Le délai doit être un nombre positif',
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

  // Envoyer la commande via PubNub
  const commandParams = delay ? { delay } : undefined;
  const sent = await sendCommand(kidoo.macAddress!, 'reboot', commandParams);

  if (!sent) {
    return {
      success: false,
      error: 'Échec de l\'envoi de la commande',
      status: 502,
    };
  }

  return {
    success: true,
    message: delay ? `Redémarrage dans ${delay}ms` : 'Redémarrage en cours',
    data: { delay: delay || 0 },
  };
};

// Handler: serial (commande brute)
const serialHandler: CommandHandler = async (kidoo, params) => {
  const command = params.command as string;

  // Validation
  if (!command || typeof command !== 'string') {
    return {
      success: false,
      error: 'La commande est requise',
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

  // Envoyer la commande brute via PubNub
  const { publishToKidoo } = await import('@/lib/pubnub');
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
    message: `Commande envoyée: ${command}`,
    data: { command },
  };
};

// Export des handlers
export const handlers: Record<string, CommandHandler> = {
  'brightness': brightnessHandler,
  'sleep-timeout': sleepTimeoutHandler,
  'sleeptimeout': sleepTimeoutHandler, // alias
  'reboot': rebootHandler,
  'restart': rebootHandler, // alias
  'serial': serialHandler,
  'cmd': serialHandler, // alias
};
