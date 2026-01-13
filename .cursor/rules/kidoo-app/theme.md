---
description: "Règles du système de thème centralisé pour kidoo-app. JAMAIS de StyleSheet.create dans les composants, toujours utiliser useTheme() et les styles du thème."
alwaysApply: false
globs:
  - kidoo-app/theme/**/*
  - kidoo-app/components/**/*.tsx
  - kidoo-app/app/**/*.tsx
  - kidoo-app/hooks/use-theme.ts
---

# Règles du Module Thème

## Principe fondamental
**JAMAIS de `StyleSheet.create()` dans les composants.** Tous les styles doivent être définis dans `theme/components.ts` et utilisés via `useTheme()`.

## Structure du thème

Le système de thème est centralisé dans `theme/` :
- `colors.ts` - Couleurs dynamiques (light/dark) et statiques
- `spacing.ts` - Espacements, border radius, tailles d'icônes
- `shadows.ts` - Ombres standardisées (iOS/Android)
- `typography.ts` - Typographie (fontSize, fontWeight, lineHeight, fontFamily)
- `components.ts` - Styles de composants réutilisables
- `index.ts` - Export centralisé

## Utilisation obligatoire

### 1. Toujours utiliser `useTheme()`

```tsx
import { useTheme } from '@/hooks/use-theme';

function MonComposant() {
  const theme = useTheme();
  
  // ✅ CORRECT - Utiliser les styles du thème directement
  return (
    <View style={theme.components.card}>
      <Text style={theme.components.textDefault}>Hello</Text>
    </View>
  );
}
```

### 2. Interdiction de StyleSheet.create

```tsx
// ❌ INTERDIT
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
});

// ✅ CORRECT - Utiliser le thème
const theme = useTheme();
<View style={[{ padding: theme.spacing.lg, backgroundColor: theme.colors.background }]}>
```

### 3. Ajouter de nouveaux styles dans le thème

Si vous avez besoin d'un nouveau style réutilisable :

1. Ajoutez-le dans `theme/components.ts` dans la fonction `createComponentStyles`
2. Utilisez-le via `theme.components.votreStyle`

```tsx
// Dans theme/components.ts
export const createComponentStyles = (colorScheme: 'light' | 'dark') => {
  return {
    // ... styles existants
    votreNouveauStyle: {
      padding: spacing.lg,
      backgroundColor: colors.card,
      borderRadius: borderRadius.md,
    },
  };
};
```

## Valeurs disponibles

### Couleurs
- `theme.colors.text`, `theme.colors.background`, `theme.colors.tint`
- `theme.colors.surface`, `theme.colors.surfaceSecondary`, `theme.colors.card`
- `theme.colors.success`, `theme.colors.error`, `theme.colors.warning`, `theme.colors.info`
- `theme.staticColors.white`, `theme.staticColors.black`, etc.

### Espacements
- `theme.spacing.xs` (4), `sm` (8), `md` (12), `lg` (16), `xl` (24), `xxl` (32), `xxxl` (48)
- `theme.borderRadius.sm` (4), `md` (8), `lg` (12), `xl` (16), `round` (999)
- `theme.iconSize.xs` (16), `sm` (20), `md` (24), `lg` (32), `xl` (48), `xxl` (64)

### Typographie
- `theme.typography.fontSize.xs` à `xxxl`
- `theme.typography.fontWeight.normal`, `medium`, `semibold`, `bold`
- `theme.typography.fontFamily.sans`, `serif`, `rounded`, `mono`

### Styles de composants
- `theme.components.card`, `theme.components.button`, `theme.components.iconContainer`
- `theme.components.alertError`, `theme.components.alertWarning`, etc.
- Voir `theme/components.ts` pour la liste complète

## Règles strictes

1. **JAMAIS de valeurs hardcodées** (ex: `padding: 16`, `color: '#fff'`)
2. **JAMAIS de StyleSheet.create** dans les composants
3. **TOUJOURS utiliser useTheme()** pour accéder aux styles
4. **Ajouter les nouveaux styles dans theme/components.ts** si réutilisables
5. **Utiliser les styles existants** avant d'en créer de nouveaux

## Exceptions

Les seules exceptions autorisées sont :
- Styles dynamiques calculés (ex: `paddingTop: insets.top + theme.spacing.md`)
- Styles inline simples pour des cas très spécifiques (ex: `style={{ flex: 1 }}`)

Mais même dans ces cas, privilégiez l'ajout au thème si le style est réutilisable.
