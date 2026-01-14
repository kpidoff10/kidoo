/**
 * Export des composants Kidoo
 */

export { KidooCard } from './components/kidoo-card';
export { KidooList } from './components/kidoo-list';
// FloatingActionButton est maintenant dans components/ui pour être réutilisable
export { FloatingActionButton } from '@/components/ui/floating-action-button';
export type { FloatingActionButtonProps } from '@/components/ui/floating-action-button';
export { BluetoothScanModal } from './bluetooth-scan-modal/index';
export { KidooSetupModal } from './kidoo-setup-modal/index';
// BasicNFCTags est maintenant dans models/basic/nfc pour être spécifique au modèle Basic
export { BasicNFCTags } from './models/basic/nfc';
export type { BasicNFCTagsProps } from './models/basic/nfc';