# Composants d'authentification

Composants réutilisables pour les écrans d'authentification (connexion et inscription).

## Structure

```
components/auth/
├── AuthHeader.tsx    # En-tête avec titre et sous-titre
├── FormField.tsx     # Champ de formulaire réutilisable
├── AuthButton.tsx    # Bouton de soumission avec état de chargement
├── AuthLink.tsx      # Lien pour naviguer entre les écrans
├── index.ts          # Point d'entrée (exports tous les composants)
└── README.md         # Ce fichier
```

## Composants

### `AuthHeader`

En-tête avec titre et sous-titre pour les écrans d'authentification.

**Props :**
- `title: string` - Titre principal
- `subtitle: string` - Sous-titre/secondaire

**Exemple :**
```tsx
<AuthHeader
  title={t('auth.login.title')}
  subtitle={t('auth.login.subtitle')}
/>
```

### `FormField`

Champ de formulaire réutilisable avec label, input, gestion d'erreur et support dark/light mode.

**Props :**
- `label: string` - Label du champ
- `value: string` - Valeur du champ
- `onChangeText: (text: string) => void` - Handler de changement
- `error?: string` - Message d'erreur à afficher
- `...TextInputProps` - Toutes les autres props de TextInput

**Exemple :**
```tsx
<FormField
  label={t('auth.login.email')}
  value={formData.email}
  onChangeText={(text) => setFormData({ ...formData, email: text })}
  placeholder="exemple@email.com"
  autoCapitalize="none"
  keyboardType="email-address"
  autoComplete="email"
  error={errors.email}
/>
```

### `AuthButton`

Bouton de soumission avec état de chargement et gestion du disabled.

**Props :**
- `label: string` - Texte du bouton
- `onPress: () => void` - Handler de clic
- `disabled?: boolean` - Désactiver le bouton
- `loading?: boolean` - Afficher un indicateur de chargement

**Exemple :**
```tsx
<AuthButton
  label={t('auth.login.loginButton')}
  onPress={handleSubmit}
  disabled={!isFormValid}
  loading={isSubmitting || isLoading}
/>
```

### `AuthLink`

Lien pour naviguer entre les écrans d'authentification (connexion ↔ inscription).

**Props :**
- `prompt: string` - Texte d'invite (ex: "Pas encore de compte ?")
- `linkText: string` - Texte du lien (ex: "S'inscrire")
- `onPress: () => void` - Handler de navigation

**Exemple :**
```tsx
<AuthLink
  prompt={t('auth.login.noAccount')}
  linkText={t('auth.login.signUp')}
  onPress={() => router.push('/(auth)/register')}
/>
```

## Utilisation

Tous les composants sont exportés depuis `@/components/auth` :

```tsx
import { AuthHeader, FormField, AuthButton, AuthLink } from '@/components/auth';
```

## Avantages

✅ **Réutilisabilité** : Composants utilisables dans login et register  
✅ **Cohérence** : Même style et comportement partout  
✅ **Maintenabilité** : Modifier en un seul endroit  
✅ **Type-safety** : Props typées avec TypeScript  
✅ **Accessibilité** : Support des attributs d'accessibilité via TextInputProps  
✅ **Thème** : Support automatique du mode clair/sombre

## Styles

Tous les styles sont définis avec `StyleSheet.create()` (pas de styles inline) conformément aux préférences du projet. Les styles s'adaptent automatiquement au thème (clair/sombre) via `useColorScheme()`.
