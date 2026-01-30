# Plugin Dark Mode Icon

Ce plugin permet d'avoir une icône différente pour le mode sombre sur Android.

## Configuration

### 1. Créer l'icône sombre

Créez un fichier `adaptive-icon-dark.png` dans le dossier `assets/` avec les spécifications suivantes :
- **Taille** : 1024x1024px
- **Format** : PNG avec transparence
- **Contenu** : L'icône doit être centrée dans un carré de 832x832px (pour éviter les coupures)
- **Style** : Version monochrome ou adaptée au mode sombre de votre icône principale

### 2. Configuration automatique

Le plugin est déjà configuré dans `app.json` :
```json
{
  "android": {
    "adaptiveIcon": {
      "foregroundImage": "./assets/adaptive-icon.png",
      "monochromeImage": "./assets/adaptive-icon-dark.png",
      "backgroundColor": "#ffffff"
    }
  }
}
```

### 3. Régénérer les icônes

Après avoir ajouté `adaptive-icon-dark.png`, régénérez les fichiers natifs :

```bash
npx expo prebuild --platform android --clean
```

Puis reconstruisez l'application :
```bash
npm run android
```

## Comment ça fonctionne

### Android 13+ (API 33+)

Sur Android 13 et supérieur, lorsque l'utilisateur active les "Icônes thématiques" dans les paramètres système, Android utilise automatiquement `monochromeImage` et la teinte selon le thème système (clair/sombre) et les couleurs du fond d'écran.

### Android 12 et inférieur

Sur les versions antérieures d'Android, seule l'icône principale (`foregroundImage`) est utilisée. L'icône sombre (`monochromeImage`) n'est pas appliquée.

## Notes importantes

- L'icône `monochromeImage` doit être une version monochrome de votre icône principale
- Android appliquera automatiquement une teinte selon le thème système
- Pour avoir une icône complètement différente (pas juste monochrome), il faudrait modifier manuellement les fichiers XML Android après le prebuild
- L'icône sombre fonctionne uniquement si l'utilisateur a activé les "Icônes thématiques" dans les paramètres Android 13+

## Vérification

Pour vérifier que l'icône sombre fonctionne :
1. Installez l'app sur un appareil Android 13+
2. Activez les "Icônes thématiques" dans les paramètres système
3. Changez le thème système entre clair et sombre
4. L'icône devrait s'adapter automatiquement
