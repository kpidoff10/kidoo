/**
 * Composants génériques pour les écrans de l'application
 * Évite la duplication de styles et de structure commune
 */

import React, { ReactElement } from 'react';
import { View } from 'react-native';
import { Header } from '@/components/themes/header';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

interface TabScreenProps {
  children: React.ReactNode;
}

/**
 * Composant générique pour un écran avec Header et ScrollView
 */
export function TabScreen({ children }: TabScreenProps) {
  const theme = useTheme();
  return (
    <View style={theme.components.screenContainer}>
      <Header />
      {children}
    </View>
  );
}

interface ScreenContentProps {
  children: React.ReactNode;
}

/**
 * Conteneur de contenu pour les écrans
 * Note: ParallaxScrollView gère déjà le padding, donc ce composant ne fait que wrapper
 */
export function ScreenContent({ children }: ScreenContentProps) {
  return <>{children}</>;
}

interface ScreenTitleProps {
  children: React.ReactNode;
}

/**
 * Titre de section pour les écrans
 */
export function ScreenTitle({ children }: ScreenTitleProps) {
  const theme = useTheme();
  return <ThemedView style={theme.components.screenTitleContainer}>{children}</ThemedView>;
}

interface EmptyStateProps {
  icon?: ReactElement;
  title: string;
  description: string;
}

/**
 * État vide générique pour afficher quand il n'y a pas de contenu
 */
export function EmptyState({ icon, title, description }: EmptyStateProps) {
  const theme = useTheme();
  return (
    <ThemedView style={theme.components.emptyState}>
      {icon}
      <ThemedText type="subtitle" style={theme.components.emptyStateTitle}>
        {title}
      </ThemedText>
      <ThemedText style={theme.components.emptyStateText}>{description}</ThemedText>
    </ThemedView>
  );
}
