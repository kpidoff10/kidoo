/**
 * Export des modales et routeurs par modèle
 */

// Routeurs
export { KidooDetailRouter } from './kidoo-detail-router';
export { KidooEditRouter } from './kidoo-edit-router';

// Contexte Bluetooth
export { KidooEditBluetoothProvider, useKidooEditBluetooth } from './kidoo-edit-bluetooth-context';

// Composants partagés
export { LoadingState, ErrorState } from './components';

// Modales de détails
export { BasicDetailModal } from './basic/detail';
export { ClassicDetailModal } from './classic/detail';

// Modales d'édition
export { BasicEditModal } from './basic/edit';
export { ClassicEditModal } from './classic/edit';

// Ajoutez ici les nouveaux modèles au fur et à mesure :
// export { MiniDetailModal } from './mini/detail';
// export { MiniEditModal } from './mini/edit';
// export { ProDetailModal } from './pro/detail';
// export { ProEditModal } from './pro/edit';
