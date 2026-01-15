/**
 * Wrapper pour le FloatingActionMenu global
 * Utilise le composant réutilisable de components/ui
 */

import { FloatingActionMenu as GlobalFloatingActionMenu } from '@/components/ui/floating-action-menu';

export interface FloatingActionMenuProps {
  onMultimediaPress: () => void;
  onMicrophonePress: () => void;
}

export function FloatingActionMenu({ onMultimediaPress, onMicrophonePress }: FloatingActionMenuProps) {
  return (
    <GlobalFloatingActionMenu
      actions={[
        {
          icon: 'music.note',
          onPress: onMultimediaPress,
        },
        {
          icon: 'mic.fill',
          onPress: onMicrophonePress,
        },
      ]}
    />
  );
}
