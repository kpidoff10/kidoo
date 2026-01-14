/**
 * Écran de gestion des tags NFC pour le modèle Basic
 */

import { useCallback, useRef, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { FloatingActionButton } from '@/components/ui/floating-action-button';
import { BottomSheetModalRef } from '@/components/ui/bottom-sheet';
import { KidooProvider, useKidoo } from '@/contexts/KidooContext';
import { NFCProvider, useNFC } from '@/contexts/NFCContext';
import { NFCWriteSheet } from '@/components/ui/nfc/nfc-write-sheet';
import type { Kidoo } from '@/services/kidooService';
import { ThemedView } from '@/components/themed-view';

export interface BasicNFCTagsProps {
  kidoo: Kidoo;
}

function BasicNFCTagsContent(_props: BasicNFCTagsProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const nfcWriteSheetRef = useRef<BottomSheetModalRef>(null);
  
  // Utiliser le contexte Kidoo (infos + connexion BLE)
  const { isConnected, isConnecting } = useKidoo();
  
  // Utiliser le contexte NFC (tags + fonctions)
  const { tags } = useNFC();

  // Mettre à jour le titre de la navigation
  useEffect(() => {
    navigation.setOptions({
      title: t('kidoos.detail.actions.tags', 'Mes tags'),
    });
  }, [navigation, t]);

  const handleAddTag = useCallback(() => {
    // Ouvrir le sheet NFC
    nfcWriteSheetRef.current?.present();
  }, []);

  const handleTagWritten = useCallback((tagId: string, uid: string) => {
    console.log('[BasicNFCTags] Tag NFC écrit:', { tagId, uid });
    // Le cache React Query sera automatiquement invalidé par tagService
    // Les tags seront rechargés automatiquement
    nfcWriteSheetRef.current?.dismiss();
  }, []);

  // Calculer la position du bouton flottant pour qu'il soit au-dessus de la barre de navigation
  // Dans une modale, la barre de navigation fait environ 50-60px de hauteur
  // On ajoute cette hauteur aux insets pour positionner le bouton correctement
  const floatingButtonBottom = insets.bottom + theme.spacing.md;
  
  // Calculer le padding bottom pour éviter que le contenu soit masqué par le bouton flottant
  const floatingButtonHeight = 56;
  const scrollViewPaddingBottom = floatingButtonBottom + floatingButtonHeight + theme.spacing.md;

  return (
    <ThemedView >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.xl,
          paddingTop: theme.spacing.md,
          paddingBottom: scrollViewPaddingBottom,
        }}
      >
        <ThemedText type="title" style={{ marginBottom: theme.spacing.md }}>
          {t('kidoos.detail.actions.tags', 'Mes tags')}
        </ThemedText>
        
        {isConnecting ? (
          <ThemedText style={{ opacity: 0.7, marginBottom: theme.spacing.md }}>
            {t('kidoos.edit.basic.connecting', 'Connexion au Kidoo en cours...')}
          </ThemedText>
        ) : !isConnected ? (
          <ThemedText style={{ opacity: 0.7, marginBottom: theme.spacing.md }}>
            {t('kidoos.edit.basic.notConnected', 'Le Kidoo n\'est pas connecté.')}
          </ThemedText>
        ) : tags.isLoading ? (
          <ThemedText style={{ opacity: 0.7, marginBottom: theme.spacing.lg }}>
            {t('common.loading', 'Chargement...')}
          </ThemedText>
        ) : tags.error ? (
          <ThemedText style={{ opacity: 0.7, marginBottom: theme.spacing.lg }}>
            {t('common.error', 'Erreur')}: {tags.error.message}
          </ThemedText>
        ) : !tags.data || tags.data.length === 0 ? (
          <ThemedText style={{ opacity: 0.7, marginBottom: theme.spacing.lg }}>
            {t('kidoos.tags.empty', 'Aucun tag enregistré. Appuyez sur + pour ajouter un tag NFC.')}
          </ThemedText>
        ) : (
          <ThemedText style={{ opacity: 0.7, marginBottom: theme.spacing.lg }}>
            {tags.data.length} {t('kidoos.tags.count', 'tag(s)')}
          </ThemedText>
        )}
      </ScrollView>

      {/* Bouton flottant pour ajouter un tag */}
      {isConnected && (
        <FloatingActionButton 
          onPress={handleAddTag} 
          icon="plus"
          bottom={floatingButtonBottom}
        />
      )}

      {/* Sheet NFC Write */}
        <NFCWriteSheet
          ref={nfcWriteSheetRef}
          onTagWritten={handleTagWritten}
        />
    </ThemedView>
  );
}

export function BasicNFCTags(props: BasicNFCTagsProps) {
  // Envelopper dans le provider Kidoo (infos + connexion BLE automatique)
  // Puis dans le provider NFC pour gérer les tags avec React Query
  return (
    <KidooProvider kidooId={props.kidoo.id} autoConnect={true}>
      <NFCProvider kidooId={props.kidoo.id}>
      <BasicNFCTagsContent {...props} />
      </NFCProvider>
    </KidooProvider>
  );
}
