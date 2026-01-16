# API Multimedia - Upload de fichiers audio

## Configuration Cloudflare R2

### 1. Créer un compte Cloudflare R2

1. Allez sur https://dash.cloudflare.com
2. Créez un compte ou connectez-vous
3. Allez dans **R2** → **Create bucket**
4. Créez un bucket nommé `multimedia` (ou le nom de votre choix)

### 2. Créer des credentials API

1. Dans Cloudflare Dashboard → **R2** → **Manage R2 API Tokens**
2. Cliquez sur **Create API token**
3. Configurez :
   - **Permissions** : Object Read & Write
   - **TTL** : Sans expiration (ou selon vos besoins)
4. Notez :
   - **Account ID** (visible dans l'URL du dashboard)
   - **Access Key ID**
   - **Secret Access Key** (affiché une seule fois, sauvegardez-le !)

### 3. Configurer un domaine custom (optionnel mais recommandé)

Pour utiliser un CDN custom avec R2 :

1. Dans votre bucket R2 → **Settings** → **Public Access**
2. Configurez un **Custom Domain** (ex: `media.votredomaine.com`)
3. Ajoutez le CNAME dans votre DNS Cloudflare pointant vers le bucket

### 4. Variables d'environnement

Ajoutez dans votre `.env` (ou variables d'environnement de production) :

```env
# Cloudflare R2
# Option 1 : Utiliser R2_ENDPOINT (recommandé si vous avez l'URL complète)
R2_ENDPOINT=https://votre-account-id.r2.cloudflarestorage.com

# Option 2 : Utiliser R2_ACCOUNT_ID (sera utilisé pour construire l'endpoint)
R2_ACCOUNT_ID=votre-account-id

# Credentials (requis dans les deux cas)
R2_ACCESS_KEY_ID=votre-access-key-id
R2_SECRET_ACCESS_KEY=votre-secret-access-key
R2_BUCKET_NAME=multimedia
R2_PUBLIC_URL=https://media.votredomaine.com  # Optionnel : URL CDN custom
```

**Note :** `R2_ACCOUNT_ID` sert à construire l'endpoint R2 (`https://<account-id>.r2.cloudflarestorage.com`).  
Si vous préférez, vous pouvez utiliser directement `R2_ENDPOINT` avec l'URL complète.

**⚠️ Important :**
- Toutes ces variables sont **SECRÈTES**, ne les exposez jamais côté client
- `R2_PUBLIC_URL` est optionnel : si non défini, des URLs signées temporaires seront générées

## Utilisation

### POST /api/multimedia/upload

**Headers :**
- `Authorization: Bearer <userId>` ou `X-User-Id: <userId>`

**Body (FormData) :**
- `file` : Fichier audio (requis)
- `tagId` : ID du tag associé (optionnel)

**Réponse :**
```json
{
  "success": true,
  "data": {
    "url": "https://media.votredomaine.com/userId/timestamp_random.mp3",
    "path": "userId/timestamp_random.mp3",
    "fileName": "timestamp_random.mp3",
    "size": 1234567,
    "mimeType": "audio/mpeg",
    "tagId": "tag-id-optional"
  },
  "message": "Fichier uploadé avec succès"
}
```

## Avantages Cloudflare R2

✅ **Pas de frais d'egress** : Aucun coût pour le transfert de données sortant  
✅ **CDN global** : Performance mondiale avec Cloudflare  
✅ **Compatibilité S3** : Utilise l'API S3 standard  
✅ **Prix compétitif** : 0.015 $/GB/mois de stockage  
✅ **Free tier** : 10 GB + 1M opérations A + 10M opérations B/mois  

## Coûts estimés

Pour un SaaS avec 1000 utilisateurs, 10 fichiers audio de 5 MB chacun :
- **Stockage** : 50 GB × 0.015 $ = **0.75 $/mois**
- **Egress** : **0 $** (gratuit !)
- **Opérations** : Généralement couvertes par le free tier

**Total estimé** : ~1 $/mois pour 1000 utilisateurs actifs

## Sécurité

- Les fichiers sont stockés dans un bucket privé par défaut
- Les URLs sont signées (temporaires) ou servies via CDN custom
- Chaque fichier est associé à un `userId` dans le chemin
- Validation stricte des types MIME et tailles de fichiers
