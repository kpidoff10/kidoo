# Système de Thème

Ce répertoire contient tous les styles, couleurs et espacements centralisés de l'application pour éviter la duplication.

## Structure

```
theme/
├── colors.ts          # Toutes les couleurs (light/dark + statiques)
├── spacing.ts         # Espacements, border radius, tailles d'icônes
├── shadows.ts         # Ombres standardisées (iOS/Android)
├── typography.ts      # Tailles de police, font weights, line heights
├── components.ts      # Styles de composants réutilisables
├── index.ts           # Export centralisé
└── README.md          # Ce fichier
```

## Utilisation

### 1. Utiliser le hook `useTheme()` (Recommandé)

```tsx
import { useTheme } from '@/hooks/use-theme';

function MonComposant() {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
    },
    text: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.md,
    },
    card: {
      ...theme.components.card,
    },
  });

  return <View style={styles.container}>...</View>;
}
```

### 2. Accéder directement aux couleurs (déconseillé)

```tsx
import { themeColors } from '@/theme/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';

const colorScheme = useColorScheme() ?? 'light';
const colors = themeColors[colorScheme];
```

> **Note**: Il est recommandé d'utiliser `useTheme()` pour un accès plus simple et cohérent au thème.

## Exemples

### Couleurs

```tsx
const theme = useTheme();

// Couleurs de base
theme.colors.text          // Texte principal
theme.colors.background    // Fond principal
theme.colors.tint          // Couleur d'accentuation
theme.colors.icon          // Couleur des icônes

// Couleurs de surface
theme.colors.surface       // Surface principale
theme.colors.surfaceSecondary  // Surface secondaire (#f5f5f5 ou #2a2a2a)
theme.colors.card          // Couleur de carte

// Couleurs d'état
theme.colors.success       // Vert (succès)
theme.colors.error         // Rouge (erreur)
theme.colors.warning       // Orange (avertissement)
theme.colors.info          // Bleu (information)

// Couleurs statiques (ne changent pas selon le thème)
theme.staticColors.white
theme.staticColors.black
theme.staticColors.rssiExcellent  // #4caf50
```

### Espacements

```tsx
const theme = useTheme();

theme.spacing.xs      // 4
theme.spacing.sm      // 8
theme.spacing.md      // 12
theme.spacing.lg      // 16
theme.spacing.xl      // 24
theme.spacing.xxl     // 32
theme.spacing.xxxl    // 48

theme.borderRadius.sm    // 4
theme.borderRadius.md    // 8
theme.borderRadius.lg    // 12
theme.borderRadius.xl    // 16
theme.borderRadius.round // 9999 (cercle parfait)

theme.iconSize.xs     // 16
theme.iconSize.sm     // 20
theme.iconSize.md     // 24
theme.iconSize.lg     // 32
theme.iconSize.xl     // 48
```

### Ombres

```tsx
const theme = useTheme();

// Appliquer une ombre
const styles = StyleSheet.create({
  card: {
    ...theme.shadows.md,
    backgroundColor: theme.colors.card,
  },
});

// Ombres disponibles : sm, md, lg, xl
```

### Typographie

```tsx
const theme = useTheme();

theme.typography.fontSize.xs      // 10
theme.typography.fontSize.sm      // 12
theme.typography.fontSize.md      // 14
theme.typography.fontSize.lg      // 16
theme.typography.fontSize.xl      // 18
theme.typography.fontSize.xxl     // 20
theme.typography.fontSize.xxxl    // 24

theme.typography.fontWeight.normal   // '400'
theme.typography.fontWeight.medium   // '500'
theme.typography.fontWeight.semibold // '600'
theme.typography.fontWeight.bold     // '700'
```

### Styles de composants réutilisables

```tsx
const theme = useTheme();

// Styles disponibles
theme.components.card                 // Style de carte standard
theme.components.buttonSecondary      // Style de bouton secondaire
theme.components.iconContainer        // Conteneur d'icône (40x40)
theme.components.iconContainerLarge   // Conteneur d'icône (48x48)
theme.components.divider              // Divider standard
theme.components.dividerThin          // Divider fin
theme.components.profileButton        // Bouton de profil
theme.components.alertError           // Container d'alerte erreur
theme.components.alertWarning         // Container d'alerte avertissement
theme.components.alertInfo            // Container d'alerte info
theme.components.alertSuccess         // Container d'alerte succès
theme.components.statusConnected      // Style pour statut connecté
theme.components.statusDisconnected   // Style pour statut déconnecté
theme.components.versionText          // Style pour texte de version

// Exemple d'utilisation
const styles = StyleSheet.create({
  myCard: {
    ...theme.components.card,
    // Vous pouvez override si nécessaire
    marginBottom: theme.spacing.xl,
  },
  myDivider: {
    ...theme.components.divider,
    marginVertical: theme.spacing.xl,
  },
});
```

## Migration depuis l'ancien système

### Avant
```tsx
const colorScheme = useColorScheme() ?? 'light';
const colors = Colors[colorScheme];
const isDark = colorScheme === 'dark';

const styles = StyleSheet.create({
  container: {
    backgroundColor: isDark ? '#2a2a2a' : '#ffffff',
    padding: 16,
    borderRadius: 12,
  },
});
```

### Après
```tsx
const theme = useTheme();

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
  },
});
```

## Bonnes pratiques

1. **Utilisez toujours le hook `useTheme()`** dans vos composants
2. **Utilisez les espacements du thème** au lieu de valeurs hardcodées
3. **Utilisez les styles de composants réutilisables** pour éviter la duplication
4. **Ajoutez de nouvelles couleurs/styles dans les fichiers du thème** au lieu de les hardcoder
5. **Respectez le système de couleurs** pour maintenir la cohérence visuelle
