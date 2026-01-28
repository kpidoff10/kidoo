/**
 * Types pour les handlers de modèles
 */

import { Kidoo } from '@/api';
import { MenuListItem } from '@/components/ui/MenuList/MenuList';

/**
 * Action personnalisée pour un modèle
 */
export interface CustomAction {
  /**
   * Identifiant unique de l'action
   */
  id: string;
  
  /**
   * Label de l'action
   */
  label: string;
  
  /**
   * Icône Ionicons
   */
  icon: string;
  
  /**
   * Callback appelé quand l'action est déclenchée
   */
  onPress: () => void;
  
  /**
   * Variante du bouton (primary, secondary, etc.)
   */
  variant?: 'primary' | 'secondary' | 'outline';
  
  /**
   * Si l'action est désactivée
   */
  disabled?: boolean;
}

/**
 * Interface de base pour un handler de modèle
 * Chaque modèle peut implémenter ses propres fonctions spécifiques
 */
export interface ModelHandler {
  /**
   * Nom du modèle (ex: 'BASIC', 'DREAM')
   */
  model: string;

  /**
   * Vérifier si le modèle supporte une fonctionnalité
   */
  supportsFeature(feature: string): boolean;

  /**
   * Obtenir les fonctionnalités disponibles pour ce modèle
   */
  getAvailableFeatures(): string[];

  /**
   * Obtenir les items de menu spécifiques au modèle
   * @param kidoo Le Kidoo pour lequel générer les items
   * @param t Fonction de traduction
   * @param callbacks Callbacks optionnels pour les actions du menu
   * @returns Liste des items de menu spécifiques au modèle
   */
  getMenuItems(
    kidoo: Kidoo, 
    t: (key: string, options?: any) => string,
    callbacks?: {
      onConfigureBedtime?: () => void;
      onConfigureWakeup?: () => void;
      [key: string]: (() => void) | undefined;
    }
  ): MenuListItem[];

  /**
   * Obtenir les actions personnalisées pour ce modèle
   * Ces actions sont affichées comme des boutons dans l'accordéon
   * @param kidoo Le Kidoo pour lequel générer les actions
   * @param t Fonction de traduction
   * @param callbacks Callbacks optionnels pour les actions personnalisées
   * @returns Liste des actions personnalisées
   */
  getCustomActions?(
    kidoo: Kidoo,
    t: (key: string, options?: any) => string,
    callbacks?: {
      onStartBedtime?: () => void;
      onStopBedtime?: () => void;
      [key: string]: (() => void) | undefined;
    }
  ): CustomAction[];

  /**
   * Fonctions spécifiques au modèle (à étendre selon les besoins)
   */
  // Exemple de fonctions spécifiques :
  // handleNFCCommand?: (kidoo: Kidoo, command: string) => Promise<void>;
  // handleDreamSpecificAction?: (kidoo: Kidoo) => Promise<void>;
}
