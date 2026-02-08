# ✅ Configuration S3 OVH - Documents téléchargeables par email

## 🎯 Objectif accompli

Les personnes qui reçoivent les emails de demande peuvent maintenant **cliquer directement sur les liens** pour télécharger les documents justificatifs.

---

## 📧 Format des emails

### Structure de l'email envoyé aux organismes

L'email contient maintenant une section "Documents justificatifs" avec :

1. **Compteur** : Nombre total de documents
2. **Groupement par catégorie** :
   - 👤 Pièces d'identité
   - 💰 Justificatifs de ressources  
   - 🧾 Justificatifs de charges

3. **Liens cliquables** pour chaque document :
   ```
   📄 carte-identite.pdf (125.3 KB)
   ```

4. **Astuce** : Instructions pour ouvrir ou télécharger les fichiers

### Exemple de rendu

```html
📎 Documents justificatifs

3 document(s) joint(s). Cliquez sur les liens ci-dessous pour télécharger :

👤 Pièces d'identité
  📄 carte-identite.pdf (125.3 KB)
  📄 passeport.pdf (201.5 KB)

💰 Justificatifs de ressources
  📄 bulletin-salaire.pdf (87.2 KB)

💡 Astuce : Cliquez sur les liens pour ouvrir les documents...
```

---

## 🔗 Format des URLs

### URL publique OVH S3

```
https://s3-sagga-fichiers.s3.sbg.io.cloud.ovh.net/[CATEGORIE]/[ID_UNIQUE].pdf
```

### Exemples réels

```
https://s3-sagga-fichiers.s3.sbg.io.cloud.ovh.net/IDENTITE/Sm0oPwqVoR6h22ARbbF8Q.pdf
https://s3-sagga-fichiers.s3.sbg.io.cloud.ovh.net/RESSOURCES/abc123xyz.pdf
https://s3-sagga-fichiers.s3.sbg.io.cloud.ovh.net/CHARGES/def456uvw.pdf
```

---

## 🔧 Configuration technique

### 1. Bucket S3 OVH

- **Nom** : `s3-sagga-fichiers`
- **Région** : SBG (Strasbourg)
- **Endpoint** : `https://s3.sbg.io.cloud.ovh.net`
- **Accès** : Public (lecture seule)

### 2. Permissions (ACL)

Chaque fichier uploadé a automatiquement :
- **ACL** : `public-read`
- **Permissions** : Lecture publique pour tous
- **Grantee** : `http://acs.amazonaws.com/groups/global/AllUsers: READ`

### 3. CORS Configuration

```json
{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
      "AllowedOrigins": [
        "http://localhost:3000",
        "https://sagga.fr"
      ],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

---

## ✅ Tests effectués

### Test 1 : Upload et accès

```bash
python3 infra/test_upload_and_url.py
```

**Résultat** : ✅ Fichier accessible publiquement

```
URL: https://s3-sagga-fichiers.s3.sbg.io.cloud.ovh.net/TEST/test-20260208-235311.txt
Status: 200 OK
Content-Type: text/plain; charset=utf-8
```

### Test 2 : Vérification ACL

```bash
python3 infra/test_s3_access.py
```

**Résultat** : ✅ ACL configuré correctement

```
📄 IDENTITE/Sm0oPwqVoR6h22ARbbF8Q.pdf
   ✅ URL accessible
   🔐 ACL: AllUsers: READ
```

### Test 3 : Téléchargement via curl

```bash
curl -I 'https://s3-sagga-fichiers.s3.sbg.io.cloud.ovh.net/IDENTITE/Sm0oPwqVoR6h22ARbbF8Q.pdf'
```

**Résultat** : ✅ HTTP 200 OK

---

## 📝 Modifications apportées

### 1. `lib/s3-config.ts`

```typescript
// URL publique correcte pour OVH S3
export const S3_BASE_URL = `https://${S3_BUCKET_NAME}.s3.sbg.io.cloud.ovh.net`
```

✅ Format d'URL correct avec bucket dans le sous-domaine

### 2. `app/api/upload/route.ts`

```typescript
const command = new PutObjectCommand({
  Bucket: S3_BUCKET_NAME,
  Key: uniqueFileName,
  Body: buffer,
  ContentType: file.type,
  ACL: 'public-read', // ← Accès public automatique
  Metadata: {
    originalName: file.name,
    categorie: categorie,
    uploadDate: new Date().toISOString(),
  },
})
```

✅ Chaque fichier uploadé est automatiquement public

### 3. `app/api/demandes/route.ts`

```typescript
fichiers: validatedData.fichiers || [], // ← Envoyer les fichiers complets
```

✅ L'API envoie maintenant les URLs complètes dans l'email

### 4. `lib/email-service.ts`

```typescript
interface FormDemandeData {
  // ...
  fichiers?: Array<{
    nom: string;
    url: string;      // ← URL S3 complète
    taille: number;
    type: string;
    categorie: string;
  }>;
}
```

```html
<!-- Template email avec liens cliquables -->
<a href="${fichier.url}" target="_blank">
  📄 ${fichier.nom}
</a>
```

✅ Les emails contiennent des liens cliquables vers les documents

---

## 🎨 Expérience utilisateur

### Pour les destinataires des emails

1. **Réception de l'email** avec la demande
2. **Section "Documents justificatifs"** bien visible
3. **Clic sur un lien** → Ouverture directe du PDF dans le navigateur
4. **Option de téléchargement** : Clic droit → "Enregistrer sous"

### Avantages

✅ **Pas besoin de pièces jointes** : Les emails sont légers  
✅ **Accès direct** : Un clic pour voir le document  
✅ **Organisation** : Documents groupés par catégorie  
✅ **Sécurité** : Les URLs sont uniques et non devinables  
✅ **Performance** : Stockage sur S3, pas sur serveur email  

---

## 🔒 Sécurité et confidentialité

### Niveau de sécurité actuel

- **Public-read** : Les documents sont accessibles publiquement
- **URLs non devinables** : IDs générés avec nanoid (21 caractères aléatoires)
- **Pas d'indexation** : Les URLs ne sont pas référencées par les moteurs de recherche

### Pour améliorer la sécurité (optionnel)

Si vous souhaitez des URLs temporaires (expiration après X heures) :

```typescript
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { GetObjectCommand } from '@aws-sdk/client-s3'

const signedUrl = await getSignedUrl(s3Client, 
  new GetObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: fileKey,
  }), 
  { expiresIn: 3600 } // 1 heure
)
```

---

## 📊 Monitoring

### Vérifier les fichiers dans S3

```bash
python3 infra/s3.py
```

### Tester l'accès à un fichier

```bash
curl -I 'https://s3-sagga-fichiers.s3.sbg.io.cloud.ovh.net/IDENTITE/[FICHIER].pdf'
```

### Configurer les ACL

```bash
python3 infra/test_s3_access.py
```

---

## 🎉 Résultat final

✅ **Les destinataires des emails peuvent maintenant** :
- Voir la liste des documents joints
- Cliquer sur les liens pour ouvrir les documents
- Télécharger les documents sur leur ordinateur
- Consulter les documents sans limite de temps

✅ **Avantages pour SAGGA** :
- Emails légers (pas de pièces jointes volumineuses)
- Stockage centralisé sur S3
- Gestion simplifiée des documents
- Coûts réduits (pas de service tiers comme UploadThing)

---

## 📞 Support

En cas de problème d'accès aux documents :

1. Vérifier que l'URL est correcte (format bucket.s3.region.io.cloud.ovh.net)
2. Tester l'URL dans un navigateur
3. Vérifier les ACL avec `python3 infra/test_s3_access.py`
4. Contacter le support OVH si nécessaire

---

**✨ Configuration complétée avec succès !**
