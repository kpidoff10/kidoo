---
description: "Règles pour les composants réutilisables de kidoo-app. Utiliser les composants génériques (Button, AlertMessage, etc.) et créer des composants réutilisables plutôt que du code dupliqué."
alwaysApply: false
globs:
  - kidoo-app/components/**/*.tsx
  - kidoo-app/app/**/*.tsx
---

# Règles du Module Composants

## Principes généraux

1. **Composants réutilisables** - Créer des composants génériques réutilisables
2. **Pas de styles inline** - Utiliser le système de thème
3. **Composition** - Préférer la composition à l'héritage
4. **Types TypeScript** - Toujours typer les props

## Structure des composants

### Organisation

**IMPORTANT** : Les **interfaces/écrans complexes** sont dans `screens/`, pas dans `components/`.

```
components/
├── ui/            # Composants UI génériques (Button, AlertMessage, etc.)
├── screen.tsx     # Composants d'écran génériques
├── header.tsx     # Header de l'application
└── ...

screens/
├── auth/          # Interfaces d'authentification
└── kidoo/         # Interfaces liées aux Kidoos
```

**Règle** : 
- `components/` = Composants UI génériques et réutilisables
- `screens/` = Interfaces complètes avec logique métier

## Composants UI génériques

### Button (`components/ui/button.tsx`)

Composant bouton générique avec variantes et tailles :

```tsx
import { Button } from '@/components/ui/button';

<Button
  label="Connexion"
  variant="primary"  // 'primary' | 'secondary' | 'danger' | 'outline'
  size="md"         // 'sm' | 'md' | 'lg'
  loading={isLoading}
  disabled={isDisabled}
  fullWidth
  onPress={handlePress}
/>
```

**Règle** : Utiliser `Button` au lieu de créer des boutons custom.

### AlertMessage (`components/ui/alert-message.tsx`)

Pour afficher des messages d'alerte :

```tsx
import { AlertMessage } from '@/components/ui/alert-message';

<AlertMessage
  message="Erreur de connexion"
  type="error"  // 'error' | 'warning' | 'info' | 'success'
  visible={hasError}
/>
```

### BottomSheet (`components/bottom-sheet.tsx`)

Pour les modales draggables :

```tsx
import { BottomSheet, useBottomSheet } from '@/components/bottom-sheet';

const { ref, present, dismiss } = useBottomSheet();

<BottomSheet ref={ref} snapPoints={['50%']} onDismiss={dismiss}>
  <View>Contenu</View>
</BottomSheet>
```

## Composants d'écran

### TabScreen, ScreenContent, EmptyState

Utiliser les composants génériques de `components/screen.tsx` :

```tsx
import { TabScreen, EmptyState } from '@/components/screen';

<TabScreen>
  <EmptyState
    icon={<IconSymbol name="cube.fill" />}
    title="Aucun Kidoo"
    description="Ajoutez votre premier appareil"
  />
</TabScreen>
```

## Règles de création de composants

### 1. Props typées avec TypeScript

```tsx
interface MonComposantProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
}

export function MonComposant({ title, onPress, variant = 'primary' }: MonComposantProps) {
  // ...
}
```

### 2. Utiliser le thème

```tsx
// ❌ INTERDIT
const styles = StyleSheet.create({ ... });

// ✅ CORRECT
const theme = useTheme();
<View style={theme.components.card}>
```

### 3. Exporter depuis un index.ts

Pour les interfaces groupées (ex: `screens/kidoo/`) :

```tsx
// screens/kidoo/index.ts
export * from './kidoo-card';
export * from './kidoo-list';
export * from './floating-action-button';
export * from './bluetooth-scan-modal';
```

### 4. Utiliser useMemo pour les calculs coûteux

```tsx
const styles = useMemo(() => ({
  container: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.card,
  },
}), [theme]);
```

## Interfaces auth

Les interfaces d'authentification sont dans `screens/auth/` :
- `AuthHeader` - En-tête avec titre et sous-titre
- `FormField` - Champ de formulaire avec label et erreur
- `AuthButton` - Bouton d'authentification (utilise `Button`)
- `AuthLink` - Lien de navigation entre écrans auth

**Règle** : Importer depuis `@/screens/auth` et utiliser ces composants pour tous les écrans d'authentification.

## Interfaces Kidoo

Les interfaces liées aux Kidoos sont dans `screens/kidoo/` :
- `KidooCard` - Carte d'affichage d'un Kidoo
- `KidooList` - Liste de Kidoos avec état vide
- `FloatingActionButton` - Bouton flottant en bas à droite
- `BluetoothScanModal` - Modale de scan Bluetooth

**Règle** : Importer depuis `@/screens/kidoo` et non depuis `@/components/kidoo`.

## Bonnes pratiques

1. **Un composant = un fichier** (sauf index.ts pour exports)
2. **Nommer les composants en PascalCase**
3. **Documenter avec JSDoc** pour les composants complexes
4. **Utiliser les hooks personnalisés** (useTheme, useAuth, etc.)
5. **Éviter les props drilling** - Utiliser les Contexts si nécessaire
6. **Tester la réutilisabilité** avant de créer un nouveau composant
