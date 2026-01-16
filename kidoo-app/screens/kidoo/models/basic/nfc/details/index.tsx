/**
 * Écran de détails d'un tag NFC
 * Affiche le contenu d'un tag
 */

import { useRef, useCallback } from 'react';
import { ThemedView } from '@/components/themed-view';
import { BottomSheetModalRef } from '@/components/ui/bottom-sheet';
import { useMultimediaByTag } from '@/hooks/useMultimedia';
import { MultimediaInfoCard, FloatingActionMenu, MultimediaList } from './components';
import { MultimediaInfoCardSkeleton } from './components/multimedia-info-card-skeleton';
import { MultimediaSheet } from '@/components/ui/multimedia-sheet';

export interface TagDetailsProps {
  kidooId: string;
  tagId: string;
}

export function TagDetails({ kidooId: _kidooId, tagId: _tagId }: TagDetailsProps) {
  const multimediaSheetRef = useRef<BottomSheetModalRef>(null);
  const { isLoading } = useMultimediaByTag(_tagId);

  const handleMultimediaPress = useCallback(() => {
    console.log('[TagDetails] ===== handleMultimediaPress DÉBUT =====');
    console.log('[TagDetails] multimediaSheetRef:', multimediaSheetRef);
    console.log('[TagDetails] multimediaSheetRef.current:', multimediaSheetRef.current);
    
    if (!multimediaSheetRef.current) {
      console.error('[TagDetails] ❌ multimediaSheetRef.current est null !');
      return;
    }
    
    console.log('[TagDetails] ✅ Ref OK, appel de present()...');
    try {
      multimediaSheetRef.current.present();
      console.log('[TagDetails] ✅ present() appelé avec succès');
    } catch (error) {
      console.error('[TagDetails] ❌ Erreur lors de l\'appel à present():', error);
    }
    
    console.log('[TagDetails] ===== handleMultimediaPress FIN =====');
  }, []);

  const handleMicrophonePress = () => {
    console.log('[TagDetails] Microphone pressé');
    // TODO: Implémenter l'action microphone
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      {isLoading ? <MultimediaInfoCardSkeleton /> : <MultimediaInfoCard />}
      <MultimediaList tagId={_tagId} />
      <FloatingActionMenu
        onMultimediaPress={handleMultimediaPress}
        onMicrophonePress={handleMicrophonePress}
      />
      <MultimediaSheet ref={multimediaSheetRef} tagId={_tagId} kidooId={_kidooId} />
    </ThemedView>
  );
}
