/**
 * Composant Toast personnalisé avec support des safe areas
 * Wrapper autour de react-native-toast-message qui prend en compte les safe areas
 * et applique des couleurs inversées selon le thème (noir en mode clair, blanc en mode sombre)
 */

import Toast, { BaseToast, BaseToastProps } from 'react-native-toast-message';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/use-theme';

/**
 * Composant Toast avec safe areas et couleurs inversées
 * À utiliser dans le layout racine
 * 
 * Le composant utilise useSafeAreaInsets() pour calculer automatiquement
 * les offsets nécessaires pour éviter les zones de sécurité (encoches, barres système, etc.)
 * et applique un margin top supplémentaire pour ne pas coller à la safe zone.
 * 
 * Les couleurs sont inversées selon le thème :
 * - Mode clair : fond noir, texte blanc
 * - Mode sombre : fond blanc, texte noir
 */
export function SafeToast() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  // Couleurs inversées selon le thème
  const toastBackgroundColor = theme.isDark ? '#ffffff' : '#000000';
  const toastTextColor = theme.isDark ? '#000000' : '#ffffff';

  // Margin supplémentaire pour ne pas coller à la safe zone (pour les toasts en bas)
  // Le bottomOffset gère déjà insets.bottom, on ajoute juste un petit espacement
  const bottomMargin = theme.spacing.xs + 12; // 4px de marge supplémentaire

  const toastConfig = {
    info: (props: BaseToastProps) => {
      return (
        <View style={{ marginBottom: bottomMargin }}>
          <BaseToast
            {...props}
            style={[
              {
                backgroundColor: toastBackgroundColor,
                borderLeftColor: theme.colors.info,
                borderLeftWidth: 4,
                borderRadius: theme.borderRadius.md,
                paddingHorizontal: theme.spacing.md,
                minHeight: 60,
              },
              props.style,
            ]}
            contentContainerStyle={[
              {
                paddingHorizontal: theme.spacing.md,
              },
              props.contentContainerStyle,
            ]}
            text1Style={[
              {
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.semibold,
                color: toastTextColor,
              },
              props.text1Style,
            ]}
            text2Style={[
              {
                fontSize: theme.typography.fontSize.sm,
                color: toastTextColor,
                opacity: 0.9,
              },
              props.text2Style,
            ]}
          />
        </View>
      );
    },
    success: (props: BaseToastProps) => {
      return (
        <View style={{ marginBottom: bottomMargin }}>
          <BaseToast
            {...props}
            style={[
              {
                backgroundColor: toastBackgroundColor,
                borderLeftColor: theme.colors.success,
                borderLeftWidth: 4,
                borderRadius: theme.borderRadius.md,
                paddingHorizontal: theme.spacing.md,
                minHeight: 60,
              },
              props.style,
            ]}
            contentContainerStyle={[
              {
                paddingHorizontal: theme.spacing.md,
              },
              props.contentContainerStyle,
            ]}
            text1Style={[
              {
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.semibold,
                color: toastTextColor,
              },
              props.text1Style,
            ]}
            text2Style={[
              {
                fontSize: theme.typography.fontSize.sm,
                color: toastTextColor,
                opacity: 0.9,
              },
              props.text2Style,
            ]}
          />
        </View>
      );
    },
    error: (props: BaseToastProps) => {
      return (
        <View style={{ marginBottom: bottomMargin }}>
          <BaseToast
            {...props}
            style={[
              {
                backgroundColor: toastBackgroundColor,
                borderLeftColor: theme.colors.error,
                borderLeftWidth: 4,
                borderRadius: theme.borderRadius.md,
                paddingHorizontal: theme.spacing.md,
                minHeight: 60,
              },
              props.style,
            ]}
            contentContainerStyle={[
              {
                paddingHorizontal: theme.spacing.md,
              },
              props.contentContainerStyle,
            ]}
            text1Style={[
              {
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.semibold,
                color: toastTextColor,
              },
              props.text1Style,
            ]}
            text2Style={[
              {
                fontSize: theme.typography.fontSize.sm,
                color: toastTextColor,
                opacity: 0.9,
              },
              props.text2Style,
            ]}
          />
        </View>
      );
    },
    warning: (props: BaseToastProps) => {
      return (
        <View style={{ marginBottom: bottomMargin }}>
          <BaseToast
            {...props}
            style={[
              {
                backgroundColor: toastBackgroundColor,
                borderLeftColor: theme.colors.warning,
                borderLeftWidth: 4,
                borderRadius: theme.borderRadius.md,
                paddingHorizontal: theme.spacing.md,
                minHeight: 60,
              },
              props.style,
            ]}
            contentContainerStyle={[
              {
                paddingHorizontal: theme.spacing.md,
              },
              props.contentContainerStyle,
            ]}
            text1Style={[
              {
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.semibold,
                color: toastTextColor,
              },
              props.text1Style,
            ]}
            text2Style={[
              {
                fontSize: theme.typography.fontSize.sm,
                color: toastTextColor,
                opacity: 0.9,
              },
              props.text2Style,
            ]}
          />
        </View>
      );
    },
  };

  return (
    <Toast
      config={toastConfig}
      topOffset={insets.top}
      bottomOffset={insets.bottom}
    />
  );
}
