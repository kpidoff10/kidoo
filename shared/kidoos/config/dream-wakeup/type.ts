/**
 * Types pour la configuration de l'heure de réveil du modèle Dream
 */

export type Weekday = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

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
