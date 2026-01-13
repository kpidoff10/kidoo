# Dépannage des Règles Cursor

## Ma règle n'est pas appliquée - Que faire ?

### 1. Vérifier que les règles sont activées

**Dans Cursor :**
1. Ouvrez **Settings** (⚙️ ou `Ctrl+,`)
2. Cherchez **"Rules"** ou allez dans **Rules, Commands**
3. Section **Project Rules**
4. Vérifiez que les règles sont **activées** (toggle ON)

### 2. Vérifier le type de règle

Selon le type, vérifiez :

#### **Always Apply** (`alwaysApply: true`)
- ✅ Devrait toujours s'appliquer
- Vérifiez qu'il n'y a pas d'erreur YAML
- Vérifiez que `globs: []` est présent

#### **Apply to Specific Files** (`globs` avec patterns)
- ✅ Vérifiez que le pattern glob correspond aux fichiers
- Exemple : `my-app/**/*` devrait matcher tous les fichiers dans `my-app/`
- Les globs sont **relatifs à la racine du workspace**
- Testez en ouvrant un fichier dans le dossier ciblé

#### **Apply Intelligently** (pas de `globs`, `alwaysApply: false`)
- ✅ Vérifiez que la `description` est claire et détaillée
- Cursor utilise la description pour décider quand appliquer la règle
- Plus la description est précise, mieux c'est

### 3. Vérifier le format YAML

**Format correct :**
```yaml
---
description: "Description de la règle"
alwaysApply: false
globs:
  - my-app/**/*
---
```

**Erreurs courantes :**
- ❌ Oublier les `---` au début et à la fin
- ❌ Mauvais format YAML (espaces, tabs)
- ❌ Guillemets autour des globs (pas nécessaire mais peut fonctionner)

### 4. Vérifier que le fichier correspond aux globs

**Patterns glob courants :**
- `my-app/**/*` → Tous les fichiers dans `my-app/` et sous-dossiers
- `esp32/**/*` → Tous les fichiers dans `esp32/` et sous-dossiers
- `**/*.tsx` → Tous les fichiers `.tsx` dans le projet
- `my-app/pages/**/*.tsx` → Tous les `.tsx` dans `my-app/pages/`

**Les globs sont relatifs à la racine du workspace**, pas à `.cursor/rules/`

### 5. Recharger Cursor

Si les règles ne s'appliquent pas :
1. Fermez et rouvrez Cursor
2. Ou : **Command Palette** (`Ctrl+Shift+P`) → "Developer: Reload Window"

### 6. Vérifier dans le chat Cursor

Dans le chat Cursor, vous devriez voir :
- "Applied rules: project-overview, mobile-app" (ou similaire)
- Si aucune règle n'est listée, elles ne sont pas appliquées

### 7. Activer manuellement une règle

Vous pouvez toujours activer manuellement une règle dans le chat :
```
@mobile-app comment structurer un composant ?
@esp32-firmware quelle broche utiliser pour la SD ?
```

## Structure des Règles Actuelles

### `project-overview`
- **Type** : Always Apply
- **Statut** : Toujours active
- **Quand** : Tout le temps

### `mobile-app`
- **Type** : Apply to Specific Files
- **Globs** : `my-app/**/*`
- **Quand** : Quand vous ouvrez/modifiez un fichier dans `my-app/`

### `esp32-firmware`
- **Type** : Apply to Specific Files
- **Globs** : `esp32/**/*`
- **Quand** : Quand vous ouvrez/modifiez un fichier dans `esp32/`

## Si ça ne fonctionne toujours pas

1. **Vérifiez la version de Cursor** : Les règles nécessitent Cursor v2.2+
2. **Vérifiez les logs** : Voir les logs Cursor pour erreurs
3. **Recréez la règle** : Via Settings → Rules, Commands → + Add Rule
