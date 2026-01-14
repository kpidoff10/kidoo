# Guide de débogage - Formatage automatique

## Vérifications à faire

### 1. Vérifier que l'extension Prettier est installée
- Ouvrez les extensions : `Ctrl+Shift+X`
- Recherchez "Prettier - Code formatter"
- Vérifiez qu'elle est **installée** et **activée**
- L'ID de l'extension doit être : `esbenp.prettier-vscode`

### 2. Vérifier le formateur sélectionné pour le fichier
- Ouvrez un fichier `.tsx` ou `.ts`
- Regardez en bas à droite de la barre d'état
- Vous devriez voir "Prettier" ou le nom du formateur actuel
- Si ce n'est pas Prettier, cliquez dessus et sélectionnez "Prettier"

### 3. Tester le formatage manuel
- Ouvrez un fichier TypeScript
- Appuyez sur `Shift+Alt+F` (ou `Shift+Option+F` sur Mac)
- Le code devrait se formater
- Si ça ne fonctionne pas, il y a un problème avec Prettier

### 4. Vérifier les paramètres utilisateur
Les paramètres utilisateur peuvent surcharger les paramètres du workspace :
- Ouvrez les paramètres : `Ctrl+,`
- Recherchez "format on save"
- Vérifiez que "Editor: Format On Save" est coché
- Recherchez "default formatter"
- Vérifiez qu'aucun autre formateur n'est forcé globalement

### 5. Vérifier les notifications d'erreur
- Regardez en bas à droite de Cursor
- S'il y a des erreurs Prettier, elles devraient apparaître
- Cliquez sur les notifications pour voir les détails

### 6. Vérifier la console de sortie
- Ouvrez la palette : `Ctrl+Shift+P`
- Tapez "Output"
- Sélectionnez "Output: Show Output"
- Dans le menu déroulant, sélectionnez "Prettier"
- Regardez s'il y a des erreurs

### 7. Recharger la fenêtre
Après chaque modification de configuration :
- `Ctrl+Shift+P` → "Reload Window"

## Commandes utiles

- Formatage manuel : `Shift+Alt+F`
- Formatage à la sauvegarde : `Ctrl+S` (automatique si configuré)
- Voir le formateur actuel : Regardez la barre d'état en bas à droite

## Test rapide

1. Ouvrez `screens/kidoo/models/basic/detail/index.tsx`
2. Ajoutez des espaces ou modifiez l'indentation
3. Sauvegardez (`Ctrl+S`)
4. Le code devrait se formater automatiquement
