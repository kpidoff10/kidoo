/**
 * Étape 2 : Sélection d'un fichier audio
 */

import { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useMultimedia } from '../MultimediaContext';
import { Controller } from 'react-hook-form';

export function MultimediaStep2() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { form } = useMultimedia();
  const [isPicking, setIsPicking] = useState(false);
  
  // Utiliser watch pour surveiller la valeur du fichier audio de manière réactive
  const selectedFile = form.watch('audioFile');

  const handlePickDocument = async (onChange: (value: any) => void) => {
    try {
      setIsPicking(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        onChange({
          uri: file.uri,
          name: file.name || 'audio.mp3',
          mimeType: file.mimeType,
          size: file.size,
        });
      }
    } catch (error) {
      console.error('[MultimediaStep2] Erreur lors de la sélection du fichier:', error);
    } finally {
      setIsPicking(false);
    }
  };

  return (
    <View >
      <View style={{ alignItems: 'center' }}>
        <ThemedText type="title" style={{ textAlign: 'center', fontSize: 24 }}>
          {t('kidoos.multimedia.step2.title', 'Sélectionner un fichier audio')}
        </ThemedText>
        <ThemedText style={{ textAlign: 'center', opacity: 0.7, fontSize: 15 }}>
          {t('kidoos.multimedia.step2.description', 'Choisissez un fichier audio depuis votre téléphone')}
        </ThemedText>
      </View>

      <Controller
        control={form.control}
        name="audioFile"
        render={({ field: { onChange } }) => (
          <View style={{ gap: theme.spacing.md }}>
            {selectedFile ? (
              <View
                style={[
                  styles.fileCard,
                  {
                    backgroundColor: theme.colors.card,
                    marginTop: theme.spacing.md,
                    padding: theme.spacing.lg,
                    borderRadius: theme.spacing.md,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <View style={styles.fileInfo}>
                  <IconSymbol
                    name="music.note"
                    size={24}
                    color={theme.colors.tint}
                    style={{ marginRight: theme.spacing.md }}
                  />
                  <View style={{ flex: 1 }}>
                    <ThemedText style={{ fontSize: theme.typography.fontSize.md, fontWeight: theme.typography.fontWeight.semibold }}>
                      {selectedFile.name}
                    </ThemedText>
                    {selectedFile.size && (
                      <ThemedText style={{ fontSize: theme.typography.fontSize.sm, opacity: 0.7, marginTop: theme.spacing.xs }}>
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </ThemedText>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      onChange(undefined);
                      // Forcer la mise à jour avec setValue pour s'assurer que la valeur est bien supprimée
                      form.setValue('audioFile', undefined, { shouldValidate: false });
                    }}
                    style={[
                      styles.removeButton,
                      {
                        backgroundColor: theme.colors.errorBackground,
                        padding: theme.spacing.xs,
                        borderRadius: theme.spacing.xs,
                      },
                    ]}
                  >
                    <IconSymbol name="xmark.circle.fill" size={20} color={theme.colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => handlePickDocument(onChange)}
                disabled={isPicking}
                style={[
                  styles.pickButton,
                  {
                    backgroundColor: theme.colors.tint,
                    padding: theme.spacing.xl,
                    borderRadius: theme.spacing.md,
                    borderWidth: 2,
                    borderStyle: 'dashed',
                    borderColor: theme.colors.tint,
                    opacity: isPicking ? 0.6 : 1,
                  },
                ]}
              >
                <IconSymbol
                  name="music.note"
                  size={32}
                  color={theme.colors.background}
                  style={{ marginBottom: theme.spacing.md }}
                />
                <ThemedText
                  style={{
                    color: theme.colors.background,
                    fontSize: theme.typography.fontSize.md,
                    fontWeight: theme.typography.fontWeight.semibold,
                    textAlign: 'center',
                  }}
                >
                  {isPicking
                    ? t('kidoos.multimedia.step2.picking', 'Sélection en cours...')
                    : t('kidoos.multimedia.step2.pickFile', 'Choisir un fichier audio')}
                </ThemedText>
                <ThemedText
                  style={{
                    color: theme.colors.background,
                    fontSize: theme.typography.fontSize.sm,
                    opacity: 0.9,
                    textAlign: 'center',
                    marginTop: theme.spacing.xs,
                  }}
                >
                  {t('kidoos.multimedia.step2.supportedFormats', 'MP3, WAV, M4A, etc.')}
                </ThemedText>
              </TouchableOpacity>
            )}

            {form.errors.audioFile && (
              <ThemedText style={{ color: theme.colors.error, fontSize: theme.typography.fontSize.sm, textAlign: 'center' }}>
                {form.errors.audioFile.message}
              </ThemedText>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pickButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeButton: {
    marginLeft: 8,
  },
});
