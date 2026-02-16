# 📤 Augmentation de la Limite d'Upload des Fichiers

**Date :** 16 décembre 2025  
**Modification :** Limite d'upload augmentée de **1 MB à 8 MB**

---

## ✅ Modifications Appliquées

### 1. **Configuration Serveur UploadThing**
**Fichier :** `app/api/uploadthing/core.ts`

- ✅ Limite `maxFileSize` modifiée de `"1MB"` à `"8MB"` pour tous les types de fichiers
- ✅ Validation middleware mise à jour : `8 * 1024 * 1024` bytes
- ✅ Message d'erreur mis à jour : "Taille maximale autorisée : 8 MB"

**Types de fichiers concernés :**
- PDF (application/pdf)
- JPEG (image/jpeg)
- PNG (image/png)
- Word (.doc) (application/msword)
- Word (.docx) (application/vnd.openxmlformats-officedocument.wordprocessingml.document)

---

### 2. **Composant d'Upload de Fichiers**
**Fichier :** `components/file-upload-section.tsx`

**Modifications :**
- ✅ Validation côté client : `8 * 1024 * 1024` bytes (ligne ~165)
- ✅ Message d'erreur : "Taille maximale : 8 MB" (ligne ~138)
- ✅ Label UI : "max 8 MB" (ligne ~193)
- ✅ Info formats : "Taille max : 8 MB par fichier" (ligne ~245)

---

### 3. **Page de Demande**
**Fichier :** `app/demande/page.tsx`

- ✅ Message informatif : "Taille max: 8 MB par fichier" (ligne ~836)

---

### 4. **Documentation**
**Fichier :** `docs/0. Prompt.md`

- ✅ Documentation mise à jour : "maximum 8 Mo par fichier"

---

## 📝 Note Technique

⚠️ **Limite UploadThing :** La bibliothèque UploadThing n'accepte que des valeurs prédéfinies. Les options disponibles sont : 1MB, 2MB, 4MB, 8MB, 16MB, 32MB, 64MB, etc.

Pour atteindre **10 MB** exactement, il faudrait utiliser une autre solution d'upload ou négocier avec UploadThing. La valeur **8 MB** est la plus proche disponible et largement suffisante pour la plupart des documents administratifs.

---

## 🎯 Impact Utilisateur

**Avant :** Les utilisateurs ne pouvaient uploader que des fichiers de **1 MB maximum**

**Après :** Les utilisateurs peuvent maintenant uploader des fichiers jusqu'à **8 MB**, soit :
- ✅ 8x plus de capacité
- ✅ Documents PDF de meilleure qualité
- ✅ Scans haute résolution acceptés
- ✅ Photos de documents plus nettes

---

## 🔍 Tests Recommandés

1. **Test fichier valide (< 8 MB) :**
   - Uploader un PDF de 5 MB ✓ devrait réussir

2. **Test fichier trop volumineux (> 8 MB) :**
   - Uploader un PDF de 10 MB ✗ devrait afficher :
     > "Le fichier est trop volumineux. La taille maximale autorisée est de 8 MB."

3. **Test multiple fichiers :**
   - Uploader 3 fichiers de 7 MB chacun (21 MB total) ✓ devrait réussir

---

## 📊 Validation

```bash
# Vérifier qu'il n'y a pas d'erreurs TypeScript
npm run build

# Lancer le serveur de développement
npm run dev
```

✅ **Tous les fichiers modifiés compilent sans erreur !**
