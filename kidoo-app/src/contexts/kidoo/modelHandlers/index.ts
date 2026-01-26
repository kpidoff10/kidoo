/**
 * Model Handlers - Exports
 */

export { ModelHandler } from './types';
export { BasicModelHandler } from './basicHandler';
export { DreamModelHandler } from './dreamHandler';

/**
 * Factory pour obtenir le handler approprié selon le modèle
 */
import { BasicModelHandler } from './basicHandler';
import { DreamModelHandler } from './dreamHandler';
import { ModelHandler } from './types';

export function getModelHandler(model: string): ModelHandler {
  const normalizedModel = model.toUpperCase();
  
  if (normalizedModel.includes('BASIC')) {
    return new BasicModelHandler();
  } else if (normalizedModel.includes('DREAM')) {
    return new DreamModelHandler();
  }
  
  // Par défaut, retourner le handler Basic
  return new BasicModelHandler();
}
