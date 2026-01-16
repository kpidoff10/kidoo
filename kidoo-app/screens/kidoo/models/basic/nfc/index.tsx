/**
 * Écran de gestion des tags NFC pour le modèle Basic
 */

import { useCallback, useRef, useEffect, useState } from 'react';
import { View, RefreshControl } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { FloatingActionButton } from '@/components/ui/floating-action-button';
import { BottomSheetModalRef } from '@/components/ui/bottom-sheet';
import { KidooProvider, useKidoo } from '@/contexts/KidooContext';
import { NFCWriteSheet } from '@/components/ui/nfc/nfc-write-sheet';
import type { Kidoo } from '@/services/kidooService';
import type { Tag } from '@/shared';
import { ThemedView } from '@/components/themed-view';
import { ThemedScrollView } from '@/components/themed-scroll-view';
import { TagListItem, TagsCountCard } from './components';

export interface BasicNFCTagsProps {
  kidoo: Kidoo;
}

function BasicNFCTagsContent(_props: BasicNFCTagsProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const nfcWriteSheetRef = useRef<BottomSheetModalRef>(null);
  
  // Utiliser le contexte Kidoo (infos + connexion BLE + tags)
  const { isConnected, isConnecting, tagsQuery, kidooId } = useKidoo();
  const router = useRouter();
  
  // Extraire les données des tags pour simplifier l'utilisation
  const tags = tagsQuery.data?.success ? tagsQuery.data.data : [];
  const isLoadingTags = tagsQuery.isLoading;
  const tagsError = tagsQuery.error;
  
  // État pour le pull-to-refresh
  const [refreshing, setRefreshing] = useState(false);

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

  const handleTagPress = useCallback((tag: Tag) => {
    // Utiliser tag.tagId (UUID) au lieu de tag.id (clé primaire) car la route serveur attend l'UUID
    // tag.tagId ne devrait jamais être null pour un tag créé, mais on vérifie quand même
    if (!tag.tagId) {
      console.error('[BasicNFCTags] Tag sans tagId (UUID), impossible de naviguer vers les détails');
      return;
    }
    router.push(`/kidoo/${kidooId}/tags/${tag.tagId}/basic`);
  }, [router, kidooId]);

  // Fonction pour actualiser la liste des tags
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await tagsQuery.refetch();
    } finally {
      setRefreshing(false);
    }
  }, [tagsQuery]);

  // Calculer la position du bouton flottant pour qu'il soit au-dessus de la barre de navigation
  const floatingButtonBottom = insets.bottom + theme.spacing.md;

  return (
    <ThemedView>
      {/* Carte avec le nombre total de tags - Fixe en haut */}
      {isConnected && !isConnecting && !isLoadingTags && !tagsError && tags.length > 0 && (
        <TagsCountCard count={tags.length} />
      )}

      {/* ScrollView pour la liste des tags */}
      <ThemedScrollView
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.xl,
          paddingTop: theme.spacing.md,
          paddingBottom: insets.bottom + 80, // Espace pour le bouton flottant
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.tint}
          />
        }
      >
        {isConnecting ? (
          <ThemedText style={{ opacity: 0.7, marginBottom: theme.spacing.md }}>
            {t('kidoos.edit.basic.connecting', 'Connexion au Kidoo en cours...')}
          </ThemedText>
        ) : !isConnected ? (
          <ThemedText style={{ opacity: 0.7, marginBottom: theme.spacing.md }}>
            {t('kidoos.edit.basic.notConnected', 'Le Kidoo n\'est pas connecté.')}
          </ThemedText>
        ) : isLoadingTags ? (
          <ThemedText style={{ opacity: 0.7, marginBottom: theme.spacing.lg }}>
            {t('common.loading', 'Chargement...')}
          </ThemedText>
        ) : tagsError ? (
          <ThemedText style={{ opacity: 0.7, marginBottom: theme.spacing.lg }}>
            {t('common.error', 'Erreur')}: {tagsError.message}
          </ThemedText>
        ) : tags.length === 0 ? (
          <ThemedText style={{ opacity: 0.7, marginBottom: theme.spacing.lg }}>
            {t('kidoos.tags.empty', 'Aucun tag enregistré. Appuyez sur + pour ajouter un tag NFC.')}
          </ThemedText>
        ) : (
          <View style={{ gap: 0 }}>
            {tags.map((tag: Tag, index: number) => (
              <View key={tag.id}>
                <TagListItem tag={tag} onPress={handleTagPress} />
                {index < tags.length - 1 && (
                  <View style={theme.components.dividerThin} />
                )}
              </View>
            ))}
          </View>
        )}
      </ThemedScrollView>

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
  // Envelopper dans le provider Kidoo (infos + connexion BLE automatique + tags)
  return (
    <KidooProvider kidooId={props.kidoo.id} autoConnect={true}>
      <BasicNFCTagsContent {...props} />
    </KidooProvider>
  );
}
