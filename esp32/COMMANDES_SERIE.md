# Commandes Série ESP32

Ce document explique comment utiliser les commandes série pour contrôler l'ESP32 depuis le moniteur série.

## Accéder au moniteur série

### Méthode 1 : Via PlatformIO (Recommandé)
1. Ouvrez votre projet dans PlatformIO
2. Cliquez sur l'icône **Serial Monitor** dans la barre d'outils (icône de prise)
3. Ou utilisez le raccourci clavier : `Ctrl+Alt+S`
4. **Important** : Si vous ne pouvez pas taper :
   - Cliquez dans la zone de texte en bas du moniteur série
   - Ou utilisez la méthode 2 ci-dessous (plus fiable)

### Méthode 2 : Via le terminal (RECOMMANDÉ si méthode 1 ne fonctionne pas)
1. Ouvrez un terminal dans VS Code (`Ctrl+` ` ou Terminal > New Terminal`)
2. Naviguez vers le dossier esp32 :
   ```bash
   cd esp32
   ```
3. Lancez le moniteur série :
   ```bash
   pio device monitor
   ```
4. Vous pouvez maintenant taper directement dans le terminal

## Envoyer une commande

1. Assurez-vous que le moniteur série est ouvert et connecté
2. Tapez votre commande dans la zone de texte en bas du moniteur
3. Appuyez sur **Entrée** pour envoyer la commande

## Commandes disponibles

### `restart` / `reset` / `reboot`
Redémarre l'ESP32.

**Exemple :**
```
restart
```

### `sdcard` / `sd`
Réinitialise la carte SD. Utile si l'initialisation a échoué au démarrage.

**Exemple :**
```
sdcard
```

### `help` / `?`
Affiche la liste des commandes disponibles.

**Exemple :**
```
help
```

## Résolution de problèmes

### Le moniteur série ne s'ouvre pas
- Vérifiez que le port série est correct dans `platformio.ini` (actuellement `COM8`)
- Assurez-vous que l'ESP32 est connecté à l'ordinateur
- Débranchez et rebranchez le câble USB

### Je ne peux pas taper dans le moniteur série
- **Solution 1** : Cliquez dans la zone de texte en bas du moniteur série de PlatformIO
- **Solution 2** : Utilisez le terminal avec `pio device monitor` (méthode 2 ci-dessus) - plus fiable
- **Solution 3** : Utilisez un moniteur série externe comme PuTTY, Tera Term, ou Arduino IDE

### Les commandes ne sont pas reconnues
- Assurez-vous de bien appuyer sur **Entrée** après avoir tapé la commande
- Vérifiez que vous n'avez pas de caractères invisibles (espaces avant/après)
- Les commandes sont insensibles à la casse (vous pouvez écrire `RESTART` ou `restart`)

### Le moniteur se ferme lors d'un restart
- C'est normal ! La configuration `monitor_dtr = 0` et `monitor_rts = 0` devrait permettre au moniteur de rester ouvert
- Si le moniteur se ferme quand même, rouvrez-le après le redémarrage
