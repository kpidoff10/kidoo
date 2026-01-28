/**
 * Kidoos API
 * Endpoints pour la gestion des Kidoos
 */

import { apiClient } from './client';

export interface Kidoo {
  id: string;
  name: string;
  macAddress: string | null; // Adresse MAC WiFi (renvoyée par l'ESP32 lors du setup)
  bluetoothMacAddress: string | null; // Adresse MAC Bluetooth (pour comparer lors des scans automatiques)
  deviceId: string;
  model: string;
  isConnected: boolean;
  lastConnected: string | null;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
  brightness?: number; // Luminosité générale (0-100%)
}

// Response wrapper du serveur
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface CreateKidooRequest {
  name: string;
  macAddress?: string; // Adresse MAC WiFi (renvoyée par l'ESP32 lors du setup)
  bluetoothMacAddress?: string; // Adresse MAC Bluetooth (pour comparer lors des scans automatiques)
  model: 'BASIC' | 'DREAM';
  deviceId: string; // UUID requis par le serveur
  wifiSSID?: string;
  firmwareVersion?: string;
  brightness?: number; // Brightness en pourcentage (0-100)
  sleepTimeout?: number; // Sleep timeout en millisecondes
}

export interface UpdateKidooRequest {
  name?: string;
}

export const kidoosApi = {
  /**
   * Récupérer tous les Kidoos de l'utilisateur
   */
  async getAll(): Promise<Kidoo[]> {
    const response = await apiClient.get<ApiResponse<Kidoo[]>>('/api/kidoos');
    return response.data.data || [];
  },

  /**
   * Récupérer un Kidoo par ID
   */
  async getById(id: string): Promise<Kidoo> {
    const response = await apiClient.get<ApiResponse<Kidoo>>(`/api/kidoos/${id}`);
    return response.data.data;
  },

  /**
   * Créer un nouveau Kidoo
   */
  async create(data: CreateKidooRequest): Promise<Kidoo> {
    const response = await apiClient.post<ApiResponse<Kidoo>>('/api/kidoos', data);
    return response.data.data;
  },

  /**
   * Mettre à jour un Kidoo
   */
  async update(id: string, data: UpdateKidooRequest): Promise<Kidoo> {
    const response = await apiClient.patch<ApiResponse<Kidoo>>(`/api/kidoos/${id}`, data);
    return response.data.data;
  },

  /**
   * Mettre à jour le nom d'un Kidoo
   */
  async updateName(id: string, name: string): Promise<Kidoo> {
    const response = await apiClient.patch<ApiResponse<Kidoo>>(`/api/kidoos/${id}/name`, { name });
    return response.data.data;
  },

  /**
   * Récupérer la configuration de l'heure de coucher (Dream)
   */
  async getDreamBedtimeConfig(id: string): Promise<{
    weekdaySchedule?: Record<string, { hour: number; minute: number; activated: boolean }>;
    colorR: number;
    colorG: number;
    colorB: number;
    brightness: number;
    nightlightAllNight: boolean;
  }> {
    const response = await apiClient.get<ApiResponse<{
      weekdaySchedule?: Record<string, { hour: number; minute: number; activated: boolean }>;
      colorR: number;
      colorG: number;
      colorB: number;
      brightness: number;
      nightlightAllNight: boolean;
    }>>(`/api/kidoos/${id}/dream-bedtime`);
    return response.data.data;
  },

  /**
   * Mettre à jour la configuration de l'heure de coucher (Dream)
   */
  async updateDreamBedtimeConfig(
    id: string,
    data: {
      weekdaySchedule?: Record<string, { hour: number; minute: number; activated?: boolean }>;
      color: string; // Hex color
      brightness: number;
      nightlightAllNight: boolean;
    }
  ): Promise<{
    weekdaySchedule?: Record<string, { hour: number; minute: number; activated: boolean }>;
    colorR: number;
    colorG: number;
    colorB: number;
    brightness: number;
    nightlightAllNight: boolean;
  }> {
    const response = await apiClient.patch<ApiResponse<{
      weekdaySchedule?: Record<string, { hour: number; minute: number; activated: boolean }>;
      colorR: number;
      colorG: number;
      colorB: number;
      brightness: number;
      nightlightAllNight: boolean;
    }>>(`/api/kidoos/${id}/dream-bedtime`, data);
    return response.data.data;
  },

  /**
   * Récupérer la configuration de l'heure de réveil (Dream)
   */
  async getDreamWakeupConfig(id: string): Promise<{
    weekdaySchedule?: Record<string, { hour: number; minute: number; activated: boolean }>;
    colorR: number;
    colorG: number;
    colorB: number;
    brightness: number;
  }> {
    const response = await apiClient.get<ApiResponse<{
      weekdaySchedule?: Record<string, { hour: number; minute: number; activated: boolean }>;
      colorR: number;
      colorG: number;
      colorB: number;
      brightness: number;
    }>>(`/api/kidoos/${id}/dream-wakeup`);
    return response.data.data;
  },

  /**
   * Mettre à jour la configuration de l'heure de réveil (Dream)
   */
  async updateDreamWakeupConfig(
    id: string,
    data: {
      weekdaySchedule?: Record<string, { hour: number; minute: number; activated?: boolean }>;
      color: string; // Hex color
      brightness: number;
    }
  ): Promise<{
    weekdaySchedule?: Record<string, { hour: number; minute: number; activated: boolean }>;
    colorR: number;
    colorG: number;
    colorB: number;
    brightness: number;
  }> {
    const response = await apiClient.patch<ApiResponse<{
      weekdaySchedule?: Record<string, { hour: number; minute: number; activated: boolean }>;
      colorR: number;
      colorG: number;
      colorB: number;
      brightness: number;
    }>>(`/api/kidoos/${id}/dream-wakeup`, data);
    return response.data.data;
  },

  /**
   * Supprimer un Kidoo
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/kidoos/${id}`);
  },

  /**
   * Vérifier si un Kidoo est en ligne
   */
  async checkOnline(id: string): Promise<{ isOnline: boolean; reason?: string }> {
    const response = await apiClient.get<ApiResponse<{ isOnline: boolean; reason?: string }>>(`/api/kidoos/${id}/check-online`);
    return response.data.data;
  },

  /**
   * Envoyer une commande à un Kidoo
   */
  async sendCommand(id: string, command: string, params?: Record<string, unknown>): Promise<void> {
    await apiClient.post(`/api/kidoos/${id}/command`, { command, params });
  },

  /**
   * Démarrer/arrêter manuellement la routine de coucher (Dream)
   */
  async controlDreamBedtime(
    id: string,
    action: 'start' | 'stop'
  ): Promise<{
    action: 'start' | 'stop';
  }> {
    const response = await apiClient.post<ApiResponse<{
      action: 'start' | 'stop';
    }>>(`/api/kidoos/${id}/dream-bedtime`, {
      action,
    });
    return response.data.data;
  },

  /**
   * Arrêter la routine active (bedtime ou wakeup) (Dream)
   */
  async stopDreamRoutine(
    id: string
  ): Promise<{
    stopped: boolean;
  }> {
    const response = await apiClient.post<ApiResponse<{
      stopped: boolean;
    }>>(`/api/kidoos/${id}/dream-routine-stop`);
    return response.data.data;
  },

  /**
   * Tester la configuration de l'heure de coucher (Dream)
   * Teste uniquement la couleur et la luminosité
   */
  async testDreamBedtime(
    id: string,
    action: 'start' | 'stop',
    params?: {
      color?: string; // Hex color
      brightness?: number;
    }
  ): Promise<{
    action: 'start' | 'stop';
    colorR?: number;
    colorG?: number;
    colorB?: number;
    brightness?: number;
  }> {
    const response = await apiClient.post<ApiResponse<{
      action: 'start' | 'stop';
      colorR?: number;
      colorG?: number;
      colorB?: number;
      brightness?: number;
    }>>(`/api/kidoos/${id}/dream-bedtime-test`, {
      action,
      ...params,
    });
    return response.data.data;
  },

  /**
   * Tester la configuration de l'heure de réveil (Dream)
   * Teste uniquement la couleur et la luminosité
   */
  async testDreamWakeup(
    id: string,
    action: 'start' | 'stop',
    params?: {
      color?: string; // Hex color
      brightness?: number;
    }
  ): Promise<{
    action: 'start' | 'stop';
    colorR?: number;
    colorG?: number;
    colorB?: number;
    brightness?: number;
  }> {
    const response = await apiClient.post<ApiResponse<{
      action: 'start' | 'stop';
      colorR?: number;
      colorG?: number;
      colorB?: number;
      brightness?: number;
    }>>(`/api/kidoos/${id}/dream-wakeup-test`, {
      action,
      ...params,
    });
    return response.data.data;
  },

  /**
   * Mettre à jour la luminosité générale d'un Kidoo
   */
  async updateBrightness(
    id: string,
    brightness: number
  ): Promise<{
    brightness: number;
    message: string;
  }> {
    const response = await apiClient.patch<ApiResponse<{
      brightness: number;
      message: string;
    }>>(`/api/kidoos/${id}/brightness`, {
      brightness,
    });
    return response.data.data;
  },
};
