/**
 * Kidoo App - Root App Component (for Expo AppEntry.js compatibility)
 * This file exists to satisfy Expo's AppEntry.js which looks for ../../App
 * It re-exports the actual App component from src/App.tsx
 */

export { App } from './src/App';
export { App as default } from './src/App';
