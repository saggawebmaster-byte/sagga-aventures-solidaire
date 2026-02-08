# Migration d'UploadThing vers S3 OVH

## ✅ Migration Complétée

Date: 8 février 2026

### 📦 Changements effectués

#### 1. **Nouvelles dépendances installées**
```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner nanoid
```

#### 2. **Fichiers créés**

- `lib/s3-config.ts` - Configuration du client S3 pour OVH
- `lib/use-s3-upload.ts` - Hook React personnalisé pour gérer les uploads
- `app/api/upload/route.ts` - API Route Next.js pour gérer les uploads vers S3
- `components/file-upload-section.tsx` - Nouveau composant (remplace l'ancien qui utilisait UploadThing)

#### 3. **Fichiers supprimés**

- `lib/uploadthing.ts` - Ancien wrapper UploadThing
- `app/api/uploadthing/` - Ancienne API route UploadThing

#### 4. **Packages désinstallés**

```bash
npm uninstall uploadthing @uploadthing/react
```

#### 5. **Variables d'environnement ajoutées**

```env
# OVH S3 Configuration
OVH_S3_ACCESS_KEY_ID="3e0c0cf752d9453395a2031bd49ad2d9"
OVH_S3_SECRET_ACCESS_KEY="1fdef394a1224af9b83e496f28c16e45"
OVH_S3_BUCKET_NAME="s3-sagga-fichiers"
OVH_S3_ENDPOINT="https://s3.sbg.io.cloud.ovh.net"
OVH_S3_REGION="sbg"
```

#### 6. **Variables supprimées**

```env
# UploadThing (supprimées)
UPLOADTHING_SECRET
UPLOADTHING_APP_ID
```

---

## 🔧 Configuration S3 OVH

### Bucket existant
- **Nom**: `s3-sagga-fichiers`
- **Région**: SBG (Strasbourg)
- **Endpoint**: `https://s3.sbg.io.cloud.ovh.net`

### Structure des dossiers
Les fichiers sont organisés par catégorie :
```
s3-sagga-fichiers/
├── IDENTITE/
│   └── [nanoid].pdf
├── RESSOURCES/
│   └── [nanoid].pdf
└── CHARGES/
    └── [nanoid].pdf
```

---

## 🚀 Utilisation

### Dans le composant FileUploadSection

Le composant utilise maintenant le hook `useS3Upload` :

```tsx
import { useS3Upload } from '@/lib/use-s3-upload'

const { uploadFile, isUploading, error } = useS3Upload()

// Upload d'un fichier
const uploadedFile = await uploadFile(file, 'IDENTITE')
```

### API Route

L'endpoint `/api/upload` gère :
- ✅ Validation du type de fichier (PDF, JPG, PNG, Word)
- ✅ Validation de la taille (max 8MB)
- ✅ Upload vers S3 OVH
- ✅ Génération d'un nom unique avec nanoid
- ✅ Métadonnées (nom original, catégorie, date)
- ✅ ACL public-read pour accès direct

---

## 📊 Avantages de la migration

| Aspect | UploadThing | S3 OVH |
|--------|-------------|---------|
| **Coût** | Payant (après quota) | Inclus dans l'offre OVH |
| **Contrôle** | Limité | Total |
| **Stockage** | Externe | Infrastructure propre |
| **Personnalisation** | Limitée | Complète |
| **Métadonnées** | Basiques | Personnalisables |
| **Performance** | Bonne | Excellente (Europe) |

---

## 🔒 Sécurité

### Fichiers publics
Les fichiers sont actuellement configurés avec `ACL: 'public-read'` pour un accès direct.

### Pour des fichiers privés (optionnel)

Si vous souhaitez des URLs signées temporaires :

```typescript
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { GetObjectCommand } from '@aws-sdk/client-s3'

const command = new GetObjectCommand({
  Bucket: S3_BUCKET_NAME,
  Key: fileKey,
})

const signedUrl = await getSignedUrl(s3Client, command, {
  expiresIn: 3600, // 1 heure
})
```

---

## ⚙️ Configuration CORS sur S3

Pour autoriser les uploads depuis votre domaine, configurez CORS sur votre bucket OVH :

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["http://localhost:3000", "https://votre-domaine.fr"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

---

## 🧪 Tests

### Test manuel
1. Démarrer le serveur : `npm run dev`
2. Aller sur `/demande`
3. Essayer d'uploader un fichier dans chaque catégorie
4. Vérifier que les fichiers apparaissent dans S3

### Vérifier les fichiers sur S3

Utilisez le script Python existant :

```bash
python infra/s3.py
```

---

## 🐛 Dépannage

### Erreur "Access Denied"
- Vérifier les credentials dans `.env`
- Vérifier les permissions du bucket

### Erreur CORS
- Configurer CORS sur le bucket OVH
- Vérifier que l'origine est autorisée

### Fichier trop volumineux
- Limite actuelle : 8MB
- Modifier `MAX_FILE_SIZE` dans `app/api/upload/route.ts`

---

## 📝 TODO (Améliorations futures)

- [ ] Ajouter la compression d'images avant upload
- [ ] Implémenter la suppression de fichiers sur S3
- [ ] Ajouter un scan antivirus
- [ ] Implémenter les URLs signées pour la sécurité
- [ ] Ajouter des miniatures pour les images
- [ ] Implémenter un CDN devant S3

---

## 📞 Support

En cas de problème, vérifiez :
1. Les logs du serveur Next.js
2. Les credentials S3 dans `.env`
3. Les permissions du bucket OVH
4. La console OVH pour les quotas

---

**Migration réalisée avec succès ! 🎉**
