/**
 * Kidoo App - Entry Point (Monorepo Root)
 * Ce fichier existe à la racine du monorepo pour que Metro puisse le trouver
 * lors du build Android. Il enregistre le composant App depuis kidoo-app/
 */

import { registerRootComponent } from 'expo';
import { App } from './kidoo-app/src/App';

registerRootComponent(App);
