/**
 * Kidoo App - Root App Component (for Expo AppEntry.js compatibility in monorepo)
 * This file exists at the monorepo root to satisfy Expo's AppEntry.js which looks for ../../App
 * from node_modules/expo/AppEntry.js at the root.
 * It re-exports the actual App component from kidoo-app/src/App.tsx
 */

export { App } from './kidoo-app/src/App';
export { App as default } from './kidoo-app/src/App';
