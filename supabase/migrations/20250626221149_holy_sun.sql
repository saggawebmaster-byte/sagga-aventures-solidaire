/*
  # Création du schéma initial pour Saga - L'aventure Solidaire

  1. Nouvelles Tables
    - `demandes`
      - `id` (cuid, clé primaire)
      - `createdAt` (timestamp, par défaut maintenant)
      - `updatedAt` (timestamp, mis à jour automatiquement)
      - `prenom` (texte, requis)
      - `nom` (texte, requis)
      - `dateNaissance` (texte, requis)
      - `sexe` (texte, requis)
      - `situation` (texte, requis)
      - `email` (texte, requis)
      - `telephoneFixe` (texte, optionnel)
      - `telephonePortable` (texte, optionnel)
      - `adresse` (texte, requis)
      - `complementAdresse` (texte, optionnel)
      - `codePostal` (texte, requis)
      - `ville` (texte, par défaut "Apatou")
      - `commentaires` (texte, optionnel)
      - `status` (texte, par défaut "EN_ATTENTE")

    - `membres_foyer`
      - `id` (cuid, clé primaire)
      - `nom` (texte, requis)
      - `prenom` (texte, requis)
      - `sexe` (texte, requis)
      - `dateNaissance` (texte, requis)
      - `demandeId` (texte, clé étrangère vers demandes)

    - `fichiers`
      - `id` (cuid, clé primaire)
      - `createdAt` (timestamp, par défaut maintenant)
      - `nom` (texte, requis)
      - `url` (texte, requis)
      - `taille` (entier, requis)
      - `type` (texte, requis)
      - `categorie` (texte, requis - IDENTITE, RESSOURCES, CHARGES)
      - `demandeId` (texte, clé étrangère vers demandes)

  2. Relations
    - Une demande peut avoir plusieurs membres de foyer (relation 1:N)
    - Une demande peut avoir plusieurs fichiers (relation 1:N)
    - Suppression en cascade pour maintenir l'intégrité des données

  3. Index
    - Index sur les clés étrangères pour optimiser les performances
    - Index sur les champs de recherche fréquents
*/

-- CreateTable
CREATE TABLE "demandes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "dateNaissance" TEXT NOT NULL,
    "sexe" TEXT NOT NULL,
    "situation" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephoneFixe" TEXT,
    "telephonePortable" TEXT,
    "adresse" TEXT NOT NULL,
    "complementAdresse" TEXT,
    "codePostal" TEXT NOT NULL,
    "ville" TEXT NOT NULL DEFAULT 'Apatou',
    "commentaires" TEXT,
    "status" TEXT NOT NULL DEFAULT 'EN_ATTENTE'
);

-- CreateTable
CREATE TABLE "membres_foyer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "sexe" TEXT NOT NULL,
    "dateNaissance" TEXT NOT NULL,
    "demandeId" TEXT NOT NULL,
    CONSTRAINT "membres_foyer_demandeId_fkey" FOREIGN KEY ("demandeId") REFERENCES "demandes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "fichiers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nom" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "taille" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "demandeId" TEXT NOT NULL,
    CONSTRAINT "fichiers_demandeId_fkey" FOREIGN KEY ("demandeId") REFERENCES "demandes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "membres_foyer_demandeId_idx" ON "membres_foyer"("demandeId");

-- CreateIndex
CREATE INDEX "fichiers_demandeId_idx" ON "fichiers"("demandeId");

-- CreateIndex
CREATE INDEX "fichiers_categorie_idx" ON "fichiers"("categorie");

-- CreateIndex
CREATE INDEX "demandes_status_idx" ON "demandes"("status");

-- CreateIndex
CREATE INDEX "demandes_createdAt_idx" ON "demandes"("createdAt");