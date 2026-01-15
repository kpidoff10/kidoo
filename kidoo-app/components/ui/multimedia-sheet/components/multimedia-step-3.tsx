/**
 * Étape 3 : Découpage du fichier audio (optionnel)
 */

import { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator, NativeEventEmitter, NativeModules, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useMultimedia } from '../MultimediaContext';
import { Controller } from 'react-hook-form';

// Import conditionnel de react-native-video-trim
let showEditor: any = null;
let videoTrimModuleAvailable = false;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const videoTrimModule = require('react-native-video-trim');
  if (videoTrimModule && typeof videoTrimModule.showEditor !== 'undefined') {
    showEditor = videoTrimModule.showEditor;
    videoTrimModuleAvailable = true;
    console.log('[MultimediaStep3] VideoTrim disponible');
  } else {
    console.warn('[MultimediaStep3] VideoTrim module chargé mais showEditor non disponible');
  }
} catch (error: unknown) {
  console.debug('[MultimediaStep3] VideoTrim non disponible - Erreur:', error instanceof Error ? error.message : String(error));
  console.debug('[MultimediaStep3] Mode Expo Go détecté ou module non lié - Build natif requis');
}

// Fonction utilitaire pour convertir les secondes en format MM:SS
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export function MultimediaStep3() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { form } = useMultimedia();
  const [isTrimming, setIsTrimming] = useState(false);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  const eventEmitterRef = useRef<NativeEventEmitter | null>(null);
  const trimCallbackRef = useRef<((result: any) => void) | null>(null);

  // Utiliser watch pour la réactivité
  const selectedFile = form.watch('audioFile');
  const trimStart = form.watch('trimStart') ?? 0;
  const trimEnd = form.watch('trimEnd');

  // Configurer l'event emitter pour écouter les événements du trimmer
  useEffect(() => {
    if (!videoTrimModuleAvailable) {
      return;
    }

    try {
      const VideoTrimModule = NativeModules.VideoTrim;
      
      if (VideoTrimModule) {
        // Créer l'event emitter
        eventEmitterRef.current = new NativeEventEmitter(VideoTrimModule);
        
        const subscription = eventEmitterRef.current.addListener('VideoTrim', (event: any) => {
          console.log('[MultimediaStep3] Événement reçu:', event);
          
          if (event.name === 'onFinishTrimming' && trimCallbackRef.current) {
            const result = {
              canceled: false,
              outputPath: event.outputPath,
              startTime: event.startTime,
              endTime: event.endTime,
            };
            trimCallbackRef.current(result);
            trimCallbackRef.current = null;
            setIsTrimming(false);
          } else if (event.name === 'onError') {
            console.error('[MultimediaStep3] Erreur du trimmer:', event.message);
            setIsTrimming(false);
            if (trimCallbackRef.current) {
              trimCallbackRef.current({ canceled: true, error: event.message });
              trimCallbackRef.current = null;
            }
          } else if (event.name === 'onCancel') {
            console.log('[MultimediaStep3] Trim annulé');
            setIsTrimming(false);
            if (trimCallbackRef.current) {
              trimCallbackRef.current({ canceled: true });
              trimCallbackRef.current = null;
            }
          }
        });

        return () => {
          subscription.remove();
        };
      }
    } catch (error) {
      console.error('[MultimediaStep3] Erreur lors de la configuration de l\'event emitter:', error);
    }
  }, []);

  // Charger la durée de l'audio si disponible
  useEffect(() => {
    if (selectedFile?.uri) {
      // TODO: Charger la durée réelle du fichier audio
      // Pour l'instant, on utilise une valeur par défaut
      setAudioDuration(null);
    }
  }, [selectedFile]);

  const handleOpenTrimmer = async (onChange: (value: any) => void) => {
    if (!selectedFile?.uri) {
      return;
    }

    // Vérifier si le module est disponible
    if (!videoTrimModuleAvailable || !showEditor) {
      Alert.alert(
        t('kidoos.multimedia.step3.error.title', 'Fonctionnalité non disponible'),
        t('kidoos.multimedia.step3.error.message', 'Le découpage audio nécessite un build natif. Veuillez utiliser "npm run android" ou "npm run ios" au lieu d\'Expo Go.'),
        [{ text: t('common.close', 'Fermer') }]
      );
      return;
    }

    try {
      setIsTrimming(true);

      // showEditor ne retourne pas de Promise, il ouvre juste l'éditeur
      // On doit attendre l'événement via l'event emitter
      const result = await new Promise<any>((resolve) => {
        // Stocker le callback pour que l'event emitter puisse l'appeler
        trimCallbackRef.current = resolve;

        // Ouvrir l'éditeur de trim (ne retourne rien)
        try {
          showEditor(selectedFile.uri, {
            type: 'audio',
            maxDuration: undefined, // Pas de limite de durée
            minDuration: 1, // Minimum 1 seconde
            // Options UI personnalisables
            // saveButtonText: t('kidoos.multimedia.step3.save', 'Enregistrer'),
            // cancelButtonText: t('kidoos.multimedia.step3.cancel', 'Annuler'),
          });
        } catch (error: any) {
          console.error('[MultimediaStep3] Erreur lors de l\'ouverture du trimmer:', error);
          setIsTrimming(false);
          resolve({ canceled: true, error: error.message });
          trimCallbackRef.current = null;
        }
      });

      console.log('[MultimediaStep3] Résultat du trimmer:', JSON.stringify(result, null, 2));

      if (result && !result.canceled) {
        // result contient les informations de découpage
        // startTime et endTime sont en millisecondes
        const startTime = result.startTime ? result.startTime / 1000 : 0; // Convertir en secondes
        const endTime = result.endTime ? result.endTime / 1000 : undefined; // Convertir en secondes

        // Mettre à jour les valeurs de trim avec form.setValue pour s'assurer que c'est bien enregistré
        form.setValue('trimStart', startTime, { shouldValidate: false });
        form.setValue('trimEnd', endTime, { shouldValidate: false });
        
        // Mettre à jour aussi via onChange pour le Controller
        onChange(startTime);

        // Si un nouveau fichier a été généré (trimmed), mettre à jour l'URI
        if (result.outputPath && selectedFile) {
          // Mettre à jour le fichier audio avec le nouveau fichier coupé
          const updatedFile = {
            ...selectedFile,
            uri: result.outputPath,
            name: selectedFile.name.replace(/\.[^/.]+$/, '') + '_trimmed.mp3',
          };
          
          // Mettre à jour le fichier audio dans le formulaire
          form.setValue('audioFile', updatedFile, { shouldValidate: false });
          
          console.log('[MultimediaStep3] Fichier découpé mis à jour:', {
            originalUri: selectedFile.uri,
            trimmedUri: result.outputPath,
            originalName: selectedFile.name,
            trimmedName: updatedFile.name,
            trimStart: startTime,
            trimEnd: endTime,
          });
        } else {
          // Si pas de outputPath, on garde juste les valeurs de trim
          console.log('[MultimediaStep3] Découpage appliqué (valeurs de trim seulement):', {
            trimStart: startTime,
            trimEnd: endTime,
            hasOutputPath: !!result.outputPath,
            hasSelectedFile: !!selectedFile,
          });
        }
      }
    } catch (error) {
      console.error('[MultimediaStep3] Erreur lors du découpage:', error);
    } finally {
      setIsTrimming(false);
    }
  };

  const hasTrim = trimStart > 0 || (trimEnd !== undefined && trimEnd !== null);

  return (
    <View style={{ gap: theme.spacing.xl }}>
      <View style={{ alignItems: 'center', gap: theme.spacing.sm }}>
        <ThemedText type="title" style={{ textAlign: 'center', fontSize: 24 }}>
          {t('kidoos.multimedia.step3.title', 'Découper l\'audio (optionnel)')}
        </ThemedText>
        <ThemedText style={{ textAlign: 'center', opacity: 0.7, fontSize: 15 }}>
          {t('kidoos.multimedia.step3.description', 'Vous pouvez découper votre fichier audio pour ne garder qu\'une partie')}
        </ThemedText>
      </View>

      {selectedFile ? (
        <View style={{ gap: theme.spacing.md }}>
          <Controller
            control={form.control}
            name="trimStart"
            render={({ field: { onChange } }) => (
              <View style={{ gap: theme.spacing.sm }}>
                {hasTrim ? (
                  <ThemedView
                    style={[
                      styles.trimInfo,
                      {
                        backgroundColor: theme.colors.successBackgroundSolid,
                        padding: theme.spacing.lg,
                        borderRadius: theme.spacing.md,
                        borderWidth: 2,
                        borderColor: theme.colors.success,
                      },
                    ]}
                  >
                    {/* Indicateur de succès */}
                    <View style={[styles.successIndicator, { marginBottom: theme.spacing.md }]}>
                      <View
                        style={[
                          styles.successBadge,
                          {
                            backgroundColor: theme.colors.success,
                            paddingHorizontal: theme.spacing.sm,
                            paddingVertical: theme.spacing.xs,
                            borderRadius: theme.spacing.sm,
                          },
                        ]}
                      >
                        <IconSymbol name="checkmark.circle.fill" size={16} color={theme.colors.background} style={{ marginRight: theme.spacing.xs }} />
                        <ThemedText
                          style={{
                            color: theme.colors.background,
                            fontSize: theme.typography.fontSize.sm,
                            fontWeight: theme.typography.fontWeight.semibold,
                          }}
                        >
                          {t('kidoos.multimedia.step3.trimApplied', 'Découpage appliqué')}
                        </ThemedText>
                      </View>
                    </View>

                    <View style={styles.trimInfoRow}>
                      <IconSymbol name="scissors" size={20} color={theme.colors.success} style={{ marginRight: theme.spacing.sm }} />
                      <View style={{ flex: 1 }}>
                        <ThemedText style={{ fontSize: theme.typography.fontSize.sm, opacity: 0.7, color: theme.colors.success }}>
                          {t('kidoos.multimedia.step3.startTime', 'Début')}
                        </ThemedText>
                        <ThemedText style={{ fontSize: theme.typography.fontSize.md, fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.success }}>
                          {formatTime(trimStart)}
                        </ThemedText>
                      </View>
                      {trimEnd !== undefined && trimEnd !== null && (
                        <>
                          <View style={{ width: 1, height: 40, backgroundColor: theme.colors.success, opacity: 0.3, marginHorizontal: theme.spacing.md }} />
                          <View style={{ flex: 1 }}>
                            <ThemedText style={{ fontSize: theme.typography.fontSize.sm, opacity: 0.7, color: theme.colors.success }}>
                              {t('kidoos.multimedia.step3.endTime', 'Fin')}
                            </ThemedText>
                            <ThemedText style={{ fontSize: theme.typography.fontSize.md, fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.success }}>
                              {formatTime(trimEnd)}
                            </ThemedText>
                          </View>
                        </>
                      )}
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        // Réinitialiser les valeurs de trim
                        form.setValue('trimStart', 0, { shouldValidate: false });
                        form.setValue('trimEnd', undefined, { shouldValidate: false });
                        onChange(0);
                      }}
                      style={[
                        styles.removeButton,
                        {
                          backgroundColor: theme.colors.errorBackground,
                          padding: theme.spacing.xs,
                          borderRadius: theme.spacing.xs,
                          marginTop: theme.spacing.sm,
                          alignSelf: 'flex-start',
                        },
                      ]}
                    >
                      <ThemedText style={{ color: theme.colors.error, fontSize: theme.typography.fontSize.sm }}>
                        {t('kidoos.multimedia.step3.removeTrim', 'Supprimer le découpage')}
                      </ThemedText>
                    </TouchableOpacity>
                  </ThemedView>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleOpenTrimmer(onChange)}
                    disabled={isTrimming}
                    style={[
                      styles.trimButton,
                      {
                        backgroundColor: theme.colors.tint,
                        padding: theme.spacing.xl,
                        borderRadius: theme.spacing.md,
                        opacity: isTrimming ? 0.6 : 1,
                      },
                    ]}
                  >
                    {isTrimming ? (
                      <ActivityIndicator color={theme.colors.background} />
                    ) : (
                      <>
                        <IconSymbol
                          name="scissors"
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
                          {t('kidoos.multimedia.step3.trimAudio', 'Découper l\'audio')}
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
                          {t('kidoos.multimedia.step3.trimDescription', 'Sélectionnez la partie à garder')}
                        </ThemedText>
                      </>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
        </View>
      ) : (
        <ThemedView
          style={[
            styles.noFileCard,
            {
              backgroundColor: theme.colors.card,
              padding: theme.spacing.lg,
              borderRadius: theme.spacing.md,
              borderWidth: 1,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <ThemedText style={{ textAlign: 'center', opacity: 0.7 }}>
            {t('kidoos.multimedia.step3.noFile', 'Veuillez d\'abord sélectionner un fichier audio à l\'étape précédente')}
          </ThemedText>
        </ThemedView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  trimButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  trimInfo: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trimInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeButton: {
    alignSelf: 'flex-start',
  },
  noFileCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
