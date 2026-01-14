/**
 * Styles de composants réutilisables
 */

import { StyleSheet } from 'react-native';
import { themeColors, staticColors } from './colors';
import { spacing, borderRadius } from './spacing';
import { shadows } from './shadows';
import { typography } from './typography';

/**
 * Génère les styles de composants communs basés sur le thème
 */
export const createComponentStyles = (colorScheme: 'light' | 'dark') => {
  const colors = themeColors[colorScheme];

  return {
    // Styles de carte
    card: {
      backgroundColor: colors.card,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.md,
      ...shadows.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      width: '100%' as const,
      alignSelf: 'stretch' as const,
    },

    // Styles de bouton
    button: {
      primary: {
        backgroundColor: colors.tint,
        borderRadius: borderRadius.md,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
      },
      secondary: {
        backgroundColor: colors.surfaceSecondary,
        borderRadius: borderRadius.md,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
      },
      danger: {
        backgroundColor: colors.error,
        borderRadius: borderRadius.md,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: StyleSheet.hairlineWidth * 2,
        borderColor: colors.tint,
        borderRadius: borderRadius.md,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
      },
    },

    buttonSize: {
      sm: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
      },
      md: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
      },
      lg: {
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xl,
      },
    },

    buttonText: {
      primary: {
        color: staticColors.white,
        fontWeight: typography.fontWeight.semibold,
      },
      secondary: {
        color: colors.text,
        fontWeight: typography.fontWeight.semibold,
      },
      danger: {
        color: staticColors.white,
        fontWeight: typography.fontWeight.semibold,
      },
      outline: {
        color: colors.tint,
        fontWeight: typography.fontWeight.semibold,
      },
    },

    buttonTextSize: {
      sm: {
        fontSize: typography.fontSize.sm,
      },
      md: {
        fontSize: typography.fontSize.md,
      },
      lg: {
        fontSize: typography.fontSize.lg,
      },
    },

    // Styles de conteneur d'icône
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.round,
      backgroundColor: colors.surfaceSecondary,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },

    iconContainerLarge: {
      width: 48,
      height: 48,
      borderRadius: borderRadius.round,
      backgroundColor: colors.surfaceSecondary,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },

    // Styles de divider
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
      marginVertical: spacing.lg,
    },

    dividerThin: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.borderLight,
      marginVertical: spacing.md,
    },

    // Styles de conteneur de profil
    profileButton: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.round,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      backgroundColor: colors.surfaceSecondary,
    },

    // Styles de conteneur d'alerte
    alertContainer: {
      padding: spacing.md,
      borderRadius: borderRadius.md,
      marginBottom: spacing.lg,
    },

    alertError: {
      backgroundColor: colors.errorBackground,
    },

    alertWarning: {
      backgroundColor: colors.warningBackground,
    },

    alertInfo: {
      backgroundColor: colors.infoBackground,
    },

    alertSuccess: {
      backgroundColor: colors.successBackgroundSolid,
    },

    // Styles de statut
    statusConnected: {
      backgroundColor: colors.successBackground,
    },

    statusDisconnected: {
      backgroundColor: colors.surfaceSecondary,
    },

    // Styles de texte de version
    versionText: {
      fontSize: spacing.sm,
      opacity: 0.6,
    },

    // Styles de bouton de scan
    scanButton: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: colors.tint,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md,
    },

    scanButtonText: {
      color: staticColors.white,
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.semibold,
      marginLeft: spacing.sm,
    },

    // Styles de header
    headerContainer: {
      paddingBottom: spacing.md,
      paddingHorizontal: spacing.lg,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      backgroundColor: colors.background,
      zIndex: 10,
    },

    headerContent: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
    },

    headerTitle: {
      fontSize: typography.fontSize.xxl,
      fontWeight: typography.fontWeight.bold,
    },

    // Styles de menu profil
    menuHeader: {
      alignItems: 'center' as const,
      marginBottom: spacing.xl,
    },

    menuUserName: {
      fontSize: typography.fontSize.xl,
      marginTop: spacing.md,
      marginBottom: spacing.xs,
    },

    menuUserEmail: {
      fontSize: typography.fontSize.sm,
      color: colors.icon,
    },

    menuItem: {
      paddingVertical: spacing.lg,
      alignItems: 'center' as const,
    },

    menuItemText: {
      fontSize: typography.fontSize.lg,
    },

    menuItemTextDanger: {
      fontSize: typography.fontSize.lg,
      color: colors.error,
    },

    menuContent: {
      flex: 1,
    },

    versionContainer: {
      paddingTop: spacing.lg,
      alignItems: 'center' as const,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },

    // Styles pour les composants auth
    authLinkContainer: {
      flexDirection: 'row' as const,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      marginTop: spacing.xl,
    },

    authLinkPrompt: {
      fontSize: typography.fontSize.sm,
      color: colors.icon,
      marginRight: spacing.sm,
    },

    authLinkText: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semibold,
      color: colors.tint,
    },

    authHeaderContainer: {
      marginBottom: spacing.xxxl,
    },

    authHeaderTitle: {
      fontSize: typography.fontSize.xxxl,
      fontWeight: typography.fontWeight.bold,
      marginBottom: spacing.sm,
      textAlign: 'center' as const,
      color: colors.text,
    },

    authHeaderSubtitle: {
      fontSize: typography.fontSize.md,
      textAlign: 'center' as const,
      color: colors.icon,
    },

    formFieldContainer: {
      marginBottom: spacing.xl,
    },

    formFieldLabel: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semibold,
      marginBottom: spacing.sm,
      color: colors.text,
    },

    formFieldInput: {
      borderRadius: borderRadius.md,
      padding: spacing.lg,
      fontSize: typography.fontSize.md,
      backgroundColor: colors.surfaceSecondary,
      color: colors.text,
    },

    formFieldInputError: {
      borderWidth: 2,
      borderColor: colors.error,
    },

    formFieldError: {
      color: colors.error,
      fontSize: typography.fontSize.xs,
      marginTop: spacing.xs,
    },

    // Styles pour parallax scroll view
    parallaxContent: {
      flex: 1,
      width: '100%' as const,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.xxxl,
      gap: spacing.lg,
      overflow: 'hidden' as const,
    },

    // Styles pour collapsible
    collapsibleHeading: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: spacing.xs,
    },

    collapsibleContent: {
      marginTop: spacing.xs,
      marginLeft: spacing.xl,
    },

    // Styles pour screen components
    screenContainer: {
      flex: 1,
    },

    screenTitleContainer: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: spacing.sm,
      marginBottom: spacing.xl,
    },

    emptyState: {
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingVertical: spacing.xxxl,
      paddingHorizontal: spacing.xl,
    },

    emptyStateTitle: {
      marginTop: spacing.lg,
      marginBottom: spacing.sm,
      textAlign: 'center' as const,
    },

    emptyStateText: {
      textAlign: 'center' as const,
      opacity: 0.7,
    },

    // Styles pour kidoo card
    kidooCardHeader: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      marginBottom: spacing.md,
    },

    kidooCardNameContainer: {
      flex: 1,
      marginLeft: spacing.md,
    },

    kidooCardName: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.semibold,
      marginBottom: spacing.xs,
    },

    kidooCardStatus: {
      fontSize: typography.fontSize.sm,
      opacity: 0.7,
    },

    kidooCardInfo: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      marginTop: spacing.sm,
      opacity: 0.6,
    },

    kidooCardInfoText: {
      fontSize: typography.fontSize.sm,
      marginLeft: spacing.xs,
      color: colors.textSecondary,
    },

    kidooCardStatusDot: {
      width: 12,
      height: 12,
      borderRadius: borderRadius.round / 2,
      backgroundColor: colors.success,
    },

    // Styles pour kidoo list
    kidooListContainer: {
      flex: 1,
    },

    kidooList: {
      paddingBottom: spacing.xl,
    },

    // Styles pour bottom sheet content
    bottomSheetContent: {
      flex: 1,
      padding: spacing.xl,
      paddingTop: spacing.md,
      backgroundColor: colors.background,
    },

    screenStepContainer: {
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },

    authScreenScrollContent: {
      flexGrow: 1,
      padding: spacing.xl,
      justifyContent: 'center' as const,
    },

    authScreenForm: {
      width: '100%' as const,
    },

    loadingContainer: {
      flex: 1,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },

    // Styles pour bluetooth scan modal
    bluetoothScanItem: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      padding: spacing.lg,
      marginBottom: spacing.sm,
      backgroundColor: colors.card,
      borderRadius: borderRadius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },

    bluetoothScanItemInfo: {
      flex: 1,
      marginLeft: spacing.md,
    },

    bluetoothScanItemName: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.semibold,
      marginBottom: spacing.xs,
    },

    bluetoothScanItemDetails: {
      fontSize: typography.fontSize.xs,
      opacity: 0.7,
    },

    bluetoothScanRssiContainer: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
    },

    bluetoothScanRssi: {
      fontSize: typography.fontSize.xs,
      marginRight: spacing.sm,
      opacity: 0.7,
    },

    bluetoothScanHeader: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      marginBottom: spacing.xl,
    },

    bluetoothScanTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
    },

    bluetoothScanStatus: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      marginBottom: spacing.lg,
      padding: spacing.md,
      backgroundColor: colors.surfaceSecondary,
      borderRadius: borderRadius.md,
    },

    bluetoothScanStatusText: {
      fontSize: typography.fontSize.md,
      marginLeft: spacing.sm,
    },

    bluetoothScanDevicesList: {
      flex: 1,
      marginTop: spacing.sm,
    },

    bluetoothScanEmptyState: {
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingVertical: spacing.xxxl,
    },

    bluetoothScanEmptyStateText: {
      fontSize: typography.fontSize.md,
      opacity: 0.7,
      textAlign: 'center' as const,
      marginTop: spacing.sm,
    },

    bluetoothScanHandleIndicator: {
      backgroundColor: colors.borderLight,
      width: 40,
      height: 4,
    },

    // Styles pour setup modal stepper
    setupStepIndicator: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginBottom: spacing.xl,
    },

    setupStepIndicatorItem: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
    },

    setupStepIndicatorCircle: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.round,
      backgroundColor: colors.surfaceSecondary,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },

    setupStepIndicatorCircleActive: {
      backgroundColor: colors.tint,
      borderColor: colors.tint,
    },

    setupStepIndicatorCircleCompleted: {
      backgroundColor: colors.success,
      borderColor: colors.success,
    },

    setupStepIndicatorText: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semibold,
      color: colors.text,
    },

    setupStepIndicatorTextActive: {
      color: staticColors.white,
    },

    setupStepIndicatorTextCompleted: {
      color: staticColors.white,
      fontSize: typography.fontSize.md,
    },

    setupStepIndicatorLine: {
      width: 60,
      height: 3,
      backgroundColor: colors.border,
      marginHorizontal: spacing.md,
      borderRadius: 2,
    },

    setupStepIndicatorLineCompleted: {
      backgroundColor: colors.success,
    },

    setupStepContent: {
      flexGrow: 1,
      flexShrink: 1,
      paddingHorizontal: spacing.xl,
    },

    setupStepContentScroll: {
      alignItems: 'center' as const,
      paddingVertical: spacing.lg,
    },

    setupStepIconContainer: {
      width: 96,
      height: 96,
      borderRadius: borderRadius.round,
      backgroundColor: colors.surfaceSecondary,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginBottom: spacing.xl,
      borderWidth: 2,
      borderColor: colors.borderLight,
    },

    setupStepTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      marginBottom: spacing.md,
      textAlign: 'center' as const,
    },

    setupStepDescription: {
      fontSize: typography.fontSize.md,
      textAlign: 'center' as const,
      opacity: 0.7,
      marginBottom: spacing.lg,
    },

    setupStepInfoBox: {
      marginTop: spacing.lg,
      padding: spacing.lg,
      backgroundColor: colors.surfaceSecondary,
      borderRadius: borderRadius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      width: '100%' as const,
    },

    setupStepInfoText: {
      fontSize: typography.fontSize.md,
      textAlign: 'left' as const,
      opacity: 0.8,
    },

    setupStepForm: {
      width: '100%' as const,
      marginTop: spacing.lg,
      gap: spacing.md,
    },

    setupStepButtons: {
      flexDirection: 'row' as const,
      gap: spacing.md,
      marginTop: spacing.xl,
    },

    setupStepButton: {
      flex: 1,
    },

    setupStepButtonFull: {
      flex: 1,
      width: '100%' as const,
    },

    // Styles pour ThemedText
    textDefault: {
      fontSize: typography.fontSize.md,
      lineHeight: typography.lineHeight.normal * typography.fontSize.md,
    },

    textDefaultSemiBold: {
      fontSize: typography.fontSize.md,
      lineHeight: typography.lineHeight.normal * typography.fontSize.md,
      fontWeight: typography.fontWeight.semibold,
    },

    textTitle: {
      fontSize: typography.fontSize.xxxl,
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.fontSize.xxxl * typography.lineHeight.tight,
    },

    textSubtitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
    },

    textLink: {
      lineHeight: typography.fontSize.md * typography.lineHeight.relaxed,
      fontSize: typography.fontSize.md,
      color: colors.tint,
    },
  };
};

export type ComponentStyles = ReturnType<typeof createComponentStyles>;
