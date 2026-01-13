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
import { KidooEditBluetoothProvider, useKidooEditBluetooth } from '../../kidoo-edit-bluetooth-context';
import { NFCWriteSheet } from '@/components/ui/nfc/nfc-write-sheet';
import { useAuth } from '@/contexts/AuthContext';
import type { Kidoo } from '@/services/kidooService';
import { ThemedView } from '@/components/themed-view';

export interface BasicNFCTagsProps {
  kidoo: Kidoo;
}

function BasicNFCTagsContent({ kidoo }: BasicNFCTagsProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const nfcWriteSheetRef = useRef<BottomSheetModalRef>(null);
  
  // Utiliser le contexte Bluetooth pour la connexion automatique
  const { isConnected, isConnecting } = useKidooEditBluetooth();

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
    // TODO: Recharger la liste des tags ou afficher le nouveau tag
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
        ) : (
          <ThemedText style={{ opacity: 0.7, marginBottom: theme.spacing.lg }}>
            {t('kidoos.tags.empty', 'Aucun tag enregistré. Appuyez sur + pour ajouter un tag NFC.')}
          </ThemedText>
        )}

        {/* TODO: Liste des tags NFC */}
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
      {user?.id && (
        <NFCWriteSheet
          ref={nfcWriteSheetRef}
          kidooId={kidoo.id}
          userId={user.id}
          onTagWritten={handleTagWritten}
        />
      )}
    </ThemedView>
  );
}

export function BasicNFCTags(props: BasicNFCTagsProps) {
  // Envelopper dans le provider Bluetooth pour activer la connexion automatique
  return (
    <KidooEditBluetoothProvider kidoo={props.kidoo} autoConnect={true}>
      <BasicNFCTagsContent {...props} />
    </KidooEditBluetoothProvider>
  );
}
