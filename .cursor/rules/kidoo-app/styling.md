---
description: "Règles de styling pour kidoo-app. JAMAIS de StyleSheet.create dans les composants, toujours utiliser useTheme() et les styles du thème centralisé."
alwaysApply: false
globs:
  - kidoo-app/components/**/*.tsx
  - kidoo-app/app/**/*.tsx
---

# Règles du Module Styling

## Principe fondamental

**JAMAIS de `StyleSheet.create()` dans les composants.** Tous les styles doivent être dans le thème.

## Système de thème

Voir `kidoo-app-theme` pour les détails complets. Règles principales :

1. **Toujours utiliser `useTheme()`**
2. **Utiliser les styles du thème** - `theme.components.*`
3. **Utiliser les valeurs du thème** - `theme.spacing.*`, `theme.colors.*`, etc.

## Styles inline

### Autorisés (cas spécifiques)

```tsx
// ✅ OK - Styles dynamiques calculés
<View style={{ 
  paddingTop: insets.top + theme.spacing.md,
  flex: 1 
}}>

// ✅ OK - Styles très spécifiques non réutilisables
<View style={{ width: '100%' }}>
```

### Interdits

```tsx
// ❌ INTERDIT - Valeurs hardcodées
<View style={{ padding: 16, backgroundColor: '#fff' }}>

// ❌ INTERDIT - StyleSheet.create
const styles = StyleSheet.create({ ... });
```

## Composition de styles

Utiliser les tableaux pour combiner les styles :

```tsx
// ✅ CORRECT
<View style={[
  theme.components.card,
  { marginBottom: theme.spacing.xl }
]}>

// ✅ CORRECT - Avec conditions
<View style={[
  theme.components.formFieldInput,
  error && theme.components.formFieldInputError,
]}>
```

## Styles conditionnels

```tsx
// ✅ CORRECT
<View style={[
  theme.components.iconContainer,
  { backgroundColor: isConnected ? theme.colors.successBackground : theme.colors.surfaceSecondary }
]}>

// ✅ CORRECT - Avec useMemo si calculs complexes
const dynamicStyle = useMemo(() => ({
  ...theme.components.card,
  opacity: isDisabled ? 0.6 : 1,
}), [theme, isDisabled]);
```

## Ajouter de nouveaux styles

Si un style est réutilisable, l'ajouter dans `theme/components.ts` :

```tsx
// Dans theme/components.ts
export const createComponentStyles = (colorScheme: 'light' | 'dark') => {
  return {
    // ... styles existants
    monNouveauStyle: {
      padding: spacing.lg,
      backgroundColor: colors.card,
      borderRadius: borderRadius.md,
    },
  };
};
```

Puis utiliser :

```tsx
const theme = useTheme();
<View style={theme.components.monNouveauStyle}>
```

## Règles strictes

1. **JAMAIS de StyleSheet.create** - Sauf dans `theme/components.ts`
2. **JAMAIS de valeurs hardcodées** - Utiliser le thème
3. **Toujours utiliser useTheme()** - Pour accéder aux styles
4. **Ajouter au thème si réutilisable** - Sinon style inline minimal
5. **Composition avec tableaux** - Pour combiner les styles

## Exceptions

Les seules exceptions sont les styles très spécifiques et non réutilisables, mais même dans ce cas, utiliser les valeurs du thème :

```tsx
// ✅ OK - Style spécifique mais utilise le thème
<View style={{
  position: 'absolute',
  bottom: insets.bottom + theme.spacing.lg,
  right: theme.spacing.lg,
  width: size,
  height: size,
  borderRadius: size / 2,
  backgroundColor: theme.colors.tint,
  ...theme.shadows.lg,
}}>
```
