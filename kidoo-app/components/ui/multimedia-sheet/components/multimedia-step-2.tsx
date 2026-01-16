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
import { useStepIndicator } from '@/components/ui/step-indicator';

export function MultimediaStep2() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { form, uploadProgress, isProcessing } = useMultimedia();
  const { currentStep } = useStepIndicator();
  const [isPicking, setIsPicking] = useState(false);
  
  // Utiliser watch pour surveiller la valeur du fichier audio de manière réactive
  const selectedFile = form.watch('audioFile');
  
  // Afficher la barre de progression uniquement si on est en train d'uploader (step 2 et isProcessing)
  const showProgress = isProcessing && uploadProgress !== null && currentStep === 2;

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
                    overflow: 'hidden', // Important pour que la barre de progression ne dépasse pas
                  },
                ]}
              >
                {/* Barre de progression en overlay (par-dessus la card) */}
                {showProgress && uploadProgress && (
                  <View
                    style={[
                      styles.progressOverlay,
                      {
                        backgroundColor: theme.colors.success,
                        height: 4,
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: `${100 - Math.min(100, uploadProgress.percentage)}%`,
                        borderBottomLeftRadius: theme.spacing.md,
                        borderBottomRightRadius: uploadProgress.percentage >= 100 ? theme.spacing.md : 0,
                      },
                    ]}
                  />
                )}
                
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
                        {showProgress && uploadProgress
                          ? `${(uploadProgress.loaded / 1024 / 1024).toFixed(2)} MB / ${(uploadProgress.total / 1024 / 1024).toFixed(2)} MB`
                          : `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`}
                      </ThemedText>
                    )}
                  </View>
                  {!showProgress && (
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
                      <IconSymbol name="trash.fill" size={20} color={theme.colors.error} />
                    </TouchableOpacity>
                  )}
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
                    marginTop: theme.spacing.md,
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
  progressOverlay: {
    zIndex: 1,
  },
});
