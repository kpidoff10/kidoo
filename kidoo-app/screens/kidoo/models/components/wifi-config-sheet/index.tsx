/**
 * Composant pour la configuration WiFi d'un Kidoo
 * Utilise react-hook-form pour la gestion du formulaire avec validation Zod
 */

import React, { useEffect, useRef } from 'react';
import { View, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { BottomSheet, type BottomSheetModalRef } from '@/components/ui/bottom-sheet';
import { useKidoo } from '@/services/models/common/contexts/KidooContext';
import { wifiService } from '@/services/wifiService';
import { BluetoothCommandType } from '@/types/bluetooth';
import {
  WifiConfigHeader,
  WifiConfigAlerts,
  WifiSSIDField,
  WifiPasswordField,
  WifiConfigActions,
} from './components';

// Schéma de validation Zod pour le formulaire WiFi
const wifiConfigSchema = z.object({
  wifiSSID: z.string().min(1, 'Le nom du réseau WiFi est requis'),
  wifiPassword: z.string().optional(),
});

type WifiConfigFormData = z.infer<typeof wifiConfigSchema>;

interface WifiConfigSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModalRef | null>;
  onSuccess?: () => void;
}

export const WifiConfigSheet = ({ bottomSheetRef, onSuccess }: WifiConfigSheetProps) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const { kidoo, isConnected, sendCommandAndWait } = useKidoo();
    const shouldLoadSSIDRef = useRef(true);

    // Initialiser react-hook-form avec validation Zod
    const {
      control,
      handleSubmit,
      setValue,
      watch,
      formState: { errors, isSubmitting },
      reset,
      setError: setFormError,
      clearErrors,
    } = useForm<WifiConfigFormData>({
      resolver: zodResolver(wifiConfigSchema),
      defaultValues: {
        wifiSSID: '',
        wifiPassword: '',
      },
    });

    const wifiSSIDValue = watch('wifiSSID');

    // Charger le SSID quand la modale s'ouvre ou quand le kidoo change
    useEffect(() => {
      const loadCurrentSSID = async () => {
        if (!shouldLoadSSIDRef.current) return;
        
        try {
          // Priorité au SSID du Kidoo s'il existe
          if (kidoo.wifiSSID) {
            console.log('[WifiConfigSheet] SSID du Kidoo détecté:', kidoo.wifiSSID);
            setValue('wifiSSID', kidoo.wifiSSID, { shouldValidate: false });
          } else {
            // Sinon, récupérer le SSID du réseau WiFi actuel de l'appareil
            const currentSSID = await wifiService.getCurrentSSID();
            if (currentSSID) {
              console.log('[WifiConfigSheet] SSID WiFi actuel détecté:', currentSSID);
              setValue('wifiSSID', currentSSID, { shouldValidate: false });
            }
          }
          shouldLoadSSIDRef.current = false;
        } catch (error) {
          console.error('[WifiConfigSheet] Erreur lors de la récupération du SSID:', error);
        }
      };

      loadCurrentSSID();
    }, [kidoo.wifiSSID, kidoo.id, setValue]);

    const [success, setSuccess] = React.useState(false);

    const onSubmit = async (data: WifiConfigFormData) => {
      if (!isConnected) {
        setFormError('root', {
          message: t('kidoos.detail.wifi.errorNotConnected', 'Le Kidoo n\'est pas connecté'),
        });
        return;
      }

      clearErrors();

      try {
        // Configurer le WiFi
        await sendCommandAndWait(
          {
            command: BluetoothCommandType.SETUP,
            ssid: data.wifiSSID,
            password: data.wifiPassword,
          },
          {
            timeoutErrorMessage: t('kidoos.detail.wifi.errorTimeout', 'La configuration WiFi a pris trop de temps. Veuillez réessayer.'),
          }
        );

        console.log('[WifiConfigSheet] WiFi configuré avec succès');
        setSuccess(true);
        
        // Fermer la modale et appeler le callback de succès
        setTimeout(() => {
          bottomSheetRef.current?.dismiss();
          onSuccess?.();
        }, 500);
      } catch (err) {
        console.error('[WifiConfigSheet] Erreur:', err);
        setFormError('root', {
          message: err instanceof Error ? err.message : t('kidoos.detail.wifi.errorConfigFailed', 'Erreur lors de la configuration WiFi'),
        });
      }
    };

    const handleCancel = () => {
      // Fermer la modale
      bottomSheetRef.current?.dismiss();
    };

    const handleDismiss = () => {
      // Réinitialiser le formulaire quand la modale se ferme
      reset({
        wifiSSID: '',
        wifiPassword: '',
      });
      setSuccess(false);
      clearErrors();
      // Réinitialiser le flag pour permettre le rechargement à la prochaine ouverture
      shouldLoadSSIDRef.current = true;
      bottomSheetRef.current?.dismiss();
    };

    return (
      <BottomSheet
        ref={bottomSheetRef}
        enablePanDownToClose={!isSubmitting && !success}
        enableHandlePanningGesture={!isSubmitting && !success}
        onDismiss={handleDismiss}
      >
        <ScrollView
          contentContainerStyle={{ padding: theme.spacing.lg }}
          showsVerticalScrollIndicator={false}
        >
          <WifiConfigHeader kidooName={kidoo.name} />

          <WifiConfigAlerts
            isConnected={isConnected}
            success={success}
            error={errors.root?.message || errors.wifiSSID?.message || null}
          />

          <View style={{ gap: theme.spacing.md }}>
            <Controller
              control={control}
              name="wifiSSID"
              render={({ field: { onChange, onBlur, value } }) => (
                <WifiSSIDField
                  value={value}
                  onChangeText={(text) => {
                    onChange(text);
                    clearErrors('wifiSSID');
                  }}
                  onBlur={onBlur}
                  error={errors.wifiSSID?.message || null}
                  editable={!isSubmitting && !success}
                />
              )}
            />

            <Controller
              control={control}
              name="wifiPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <WifiPasswordField
                  value={value || ''}
                  onChangeText={(text) => {
                    onChange(text);
                    clearErrors('wifiPassword');
                  }}
                  onBlur={onBlur}
                  error={errors.wifiPassword?.message || null}
                  editable={!isSubmitting && !success}
                />
              )}
            />
          </View>

          <WifiConfigActions
            isConfiguring={isSubmitting}
            success={success}
            isConnected={isConnected}
            hasSSID={!!wifiSSIDValue?.trim()}
            onCancel={handleCancel}
            onConfigure={handleSubmit(onSubmit)}
          />
        </ScrollView>
      </BottomSheet>
    );
};
