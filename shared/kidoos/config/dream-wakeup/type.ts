/**
 * Types pour la configuration de l'heure de réveil du modèle Dream
 */

import type { Weekday } from '../../../types/common';
export type { Weekday };

export interface WakeupTime {
  hour: number;
  minute: number;
  activated: boolean;
}

export interface WakeupWeekdaySchedule {
  [key: string]: WakeupTime;
}

export interface DreamWakeupConfig {
  weekdaySchedule?: WakeupWeekdaySchedule;
  colorR: number;
  colorG: number;
  colorB: number;
  brightness: number;
}
