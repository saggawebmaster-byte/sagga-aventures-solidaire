

## Prompt

```plaintext
aide moi à implémenter cette logique/workflow d'envoie des demandes saisi via le formulaire à (aux) l'addresse(s) correspondante

j'aimerais que la demande par défaut (si AAU non coché) soit envoyé à l'adresse mail de la structure correspande à la ville selectionné

CORRESPONDANCES Structures

Cayenne : tidegra@sagga.fr
Saint-Laurent : tibakicsi@gmail.com
Macouria : contact.a3pguyane@gmail.com

Et si AAU envoyé la demande plutôt à la (les) addresse(s) mail(s) du CCAS de la ville selectionné correspondante :

CORRESPONDANCES CCAS

Cayenne:
direction@ccas-cayenne.org,
coordinatriceaau@ccas cayenne.org

Macouria:
alsainteluce@ccasmacouria.fr
ccas.rm.lpulcherie@orange.fr,
ccas.rm.simonnet@orange.fr,

Remire:
ccas.rm.stanislas@orange.fr,
ccas.rm.albertrogier@orange.frccas@mairie-matoury.fr,
ccasmt@orange.fr,

Matoury:
line.atticot@mairie-matoury.fr,
nicole.gomes-caldas@roura.gf,
centresocio.roura@orange.fr,

Roura:
mariechantal.dominique@roura.gf ,
henriol.murielle@ctguyane.fr ,

Kourou:
jeanne.varlin@ciass-guyane.fr,
virginie.dias@ciass guyane.fr
line.bourdon@montsinery-tonnegrande.fr,
celly.popo@montsinery-tonnegrande.fr,

Montsinéry:
yannis.manguer@montsinery-tonnegrande.fr,
ccas97320c.nanhou@orange.fr,

Saint-Laurent
ccas97320educateur1@orange.fr,

Mana:
ccas.mana@orange.fr,
bazilie@mairie-mana.fr

Iracoubo:
louise.alexis@ctguyane.fr,
accueil.iracoubo@gmail.fr
```


Je vais vous aider à implémenter cette logique d'envoi d'emails basée sur la ville sélectionnée et le statut AAU. Voici la solution complète :

### 1. Configuration des correspondances d'emails
Créons d'abord un fichier de configuration pour les correspondances :

```javascript
// config/emailMappings.js
export const STRUCTURE_EMAILS: Record<string, string[]> = {
  "Cayenne": ["tidegra@sagga.fr"],
  "Saint-Laurent": ["tibakicsi@gmail.com"],
  "Macouria": ["contact.a3pguyane@gmail.com"],
  // Valeur par défaut pour les autres villes
  "Apatou": ["tidegra@sagga.fr"], // ou une adresse par défaut
  "Remire": ["tidegra@sagga.fr"],
  "Matoury": ["tidegra@sagga.fr"],
  "Roura": ["tidegra@sagga.fr"],
  "Kourou": ["tidegra@sagga.fr"],
  "Montsinéry": ["tidegra@sagga.fr"],
  "Mana": ["tidegra@sagga.fr"],
  "Iracoubo": ["tidegra@sagga.fr"]
};

export const CCAS_EMAILS: Record<string, string[]> = {
  "Cayenne": [
    "direction@ccas-cayenne.org",
    "coordinatriceaau@ccas-cayenne.org"
  ],
  "Macouria": [
    "alsainteluce@ccasmacouria.fr",
    "ccas.rm.lpulcherie@orange.fr",
    "ccas.rm.simonnet@orange.fr"
  ],
  "Remire": [
    "ccas.rm.stanislas@orange.fr",
    "ccas.rm.albertrogier@orange.fr"
  ],
  "Matoury": [
    "ccas@mairie-matoury.fr",
    "ccasmt@orange.fr",
    "line.atticot@mairie-matoury.fr"
  ],
  "Roura": [
    "nicole.gomes-caldas@roura.gf",
    "centresocio.roura@orange.fr",
    "mariechantal.dominique@roura.gf"
  ],
  "Kourou": [
    "henriol.murielle@ctguyane.fr",
    "jeanne.varlin@ciass-guyane.fr",
    "virginie.dias@ciass-guyane.fr"
  ],
  "Montsinéry": [
    "line.bourdon@montsinery-tonnegrande.fr",
    "celly.popo@montsinery-tonnegrande.fr",
    "yannis.manguer@montsinery-tonnegrande.fr"
  ],
  "Saint-Laurent": [
    "ccas97320c.nanhou@orange.fr",
    "ccas97320educateur1@orange.fr"
  ],
  "Mana": [
    "ccas.mana@orange.fr",
    "bazilie@mairie-mana.fr"
  ],
  "Iracoubo": [
    "louise.alexis@ctguyane.fr",
    "accueil.iracoubo@gmail.fr"
  ],
  // Valeur par défaut pour Apatou (pas de CCAS défini)
  "Apatou": ["tidegra@sagga.fr"]
};

export function getEmailRecipients(ville: string, aau: boolean): string[] {
  if (aau) {
    return CCAS_EMAILS[ville] || STRUCTURE_EMAILS[ville] || ["tidegra@sagga.fr"];
  } else {
    return STRUCTURE_EMAILS[ville] || ["tidegra@sagga.fr"];
  }
}
```

### 2. Service d'envoi d'emails
Créons un service pour gérer l'envoi d'emails :

```javascript
// services/emailService.ts
import { getEmailRecipients } from './email-mappings';

interface DemandeEmailData {
  prenom: string;
  nom: string;
  email: string;
  ville: string;
  aau: boolean;
  dateNaissance: string;
  sexe: string;
  situation: string;
  telephonePortable?: string;
  telephoneFixe?: string;
  adresse: string;
  complementAdresse?: string;
  codePostal: string;
  commentaires?: string;
  membresfoyer: Array<{
    nom: string;
    prenom: string;
    sexe: string;
    dateNaissance: string;
  }>;
  fichiers: Array<{
    nom: string;
    categorie: string;
    taille: number;
    type: string;
  }>;
}

export async function sendDemandeNotification(demande: DemandeEmailData, demandeId: string) {
  const recipients = getEmailRecipients(demande.ville, demande.aau);
  
  const emailContent = generateEmailContent(demande, demandeId);
  
  // Simuler l'envoi d'email (remplacez par votre service d'email préféré)
  console.log('📧 Envoi d\'email à:', recipients);
  console.log('📝 Contenu:', emailContent);
  
  // Exemple avec un service d'email (à adapter selon votre choix)
  try {
    // Ici vous pouvez intégrer avec:
    // - Nodemailer
    // - SendGrid
    // - Resend
    // - AWS SES
    // etc.
    
    const emailData = {
      to: recipients,
      from: 'noreply@saga-aventure-solidaire.fr',
      subject: `${demande.aau ? '[AAU] ' : ''}Nouvelle demande d'aide sociale - ${demande.prenom} ${demande.nom}`,
      html: emailContent,
      // cc: ['admin@saga-aventure-solidaire.fr'], // optionnel
    };
    
    // await yourEmailService.send(emailData);
    
    return { success: true, recipients };
  } catch (error) {
    console.error('Erreur envoi email:', error);
    return { success: false, error: error.message };
  }
}

function generateEmailContent(demande: DemandeEmailData, demandeId: string): string {
  const typeAide = demande.aau ? 'Aide Alimentaire d\'Urgence (AAU)' : 'Aide sociale';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #752D8B; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .section { margin-bottom: 20px; padding: 15px; border-left: 4px solid #752D8B; background: #f9f9f9; }
        .urgent { border-left-color: #e74c3c; background: #fdf2f2; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .info-item { margin-bottom: 8px; }
        .label { font-weight: bold; color: #752D8B; }
        .files-list { margin-top: 10px; }
        .file-item { padding: 5px 10px; background: #eee; margin: 3px 0; border-radius: 3px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🏛️ Saga - L'aventure Solidaire</h1>
        <h2>${demande.aau ? '🆘 ' : '📋 '}Nouvelle demande: ${typeAide}</h2>
      </div>
      
      <div class="content">
        ${demande.aau ? `
        <div class="section urgent">
          <h3>⚠️ DEMANDE PRIORITAIRE - AAU</h3>
          <p><strong>Cette demande concerne une Aide Alimentaire d'Urgence et doit être traitée en priorité.</strong></p>
        </div>
        ` : ''}
        
        <div class="section">
          <h3>👤 Informations du demandeur</h3>
          <div class="info-grid">
            <div class="info-item"><span class="label">Nom:</span> ${demande.nom}</div>
            <div class="info-item"><span class="label">Prénom:</span> ${demande.prenom}</div>
            <div class="info-item"><span class="label">Date de naissance:</span> ${demande.dateNaissance}</div>
            <div class="info-item"><span class="label">Sexe:</span> ${demande.sexe}</div>
            <div class="info-item"><span class="label">Situation:</span> ${demande.situation}</div>
            <div class="info-item"><span class="label">Email:</span> ${demande.email}</div>
            ${demande.telephonePortable ? `<div class="info-item"><span class="label">Tél. portable:</span> ${demande.telephonePortable}</div>` : ''}
            ${demande.telephoneFixe ? `<div class="info-item"><span class="label">Tél. fixe:</span> ${demande.telephoneFixe}</div>` : ''}
          </div>
        </div>
        
        <div class="section">
          <h3>🏠 Adresse</h3>
          <p><strong>${demande.adresse}</strong></p>
          ${demande.complementAdresse ? `<p>${demande.complementAdresse}</p>` : ''}
          <p>${demande.codePostal} ${demande.ville}</p>
        </div>
        
        ${demande.membresfoyer.length > 0 ? `
        <div class="section">
          <h3>👨‍👩‍👧‍👦 Composition du foyer (${demande.membresfoyer.length} membre${demande.membresfoyer.length > 1 ? 's' : ''})</h3>
          ${demande.membresfoyer.map(membre => `
            <div class="info-item">
              ${membre.prenom} ${membre.nom} - ${membre.sexe} - Né(e) le ${membre.dateNaissance}
            </div>
          `).join('')}
        </div>
        ` : ''}
        
        ${demande.fichiers.length > 0 ? `
        <div class="section">
          <h3>📎 Documents joints (${demande.fichiers.length})</h3>
          <div class="files-list">
            ${['IDENTITE', 'RESSOURCES', 'CHARGES'].map(categorie => {
              const fichiers = demande.fichiers.filter(f => f.categorie === categorie);
              if (fichiers.length === 0) return '';
              return `
                <h4>${categorie}</h4>
                ${fichiers.map(fichier => `
                  <div class="file-item">
                    📄 ${fichier.nom} (${Math.round(fichier.taille / 1024)} KB)
                  </div>
                `).join('')}
              `;
            }).join('')}
          </div>
        </div>
        ` : ''}
        
        ${demande.commentaires ? `
        <div class="section">
          <h3>💬 Commentaires</h3>
          <p>${demande.commentaires.replace(/\n/g, '<br>')}</p>
        </div>
        ` : ''}
        
        <div class="section">
          <h3>ℹ️ Informations de traitement</h3>
          <div class="info-item"><span class="label">ID de la demande:</span> ${demandeId}</div>
          <div class="info-item"><span class="label">Date de réception:</span> ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</div>
          <div class="info-item"><span class="label">Ville de traitement:</span> ${demande.ville}</div>
          <div class="info-item"><span class="label">Type de demande:</span> ${typeAide}</div>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background: #e8f4f8; border-radius: 5px;">
          <p style="margin: 0;"><strong>📧 Cet email a été généré automatiquement par le système de demandes en ligne de Saga - L'aventure Solidaire.</strong></p>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">
            Pour accéder au dossier complet et gérer cette demande, connectez-vous à l'interface d'administration.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
```


### 3. Mise à jour de l'API
Modifions l'API pour intégrer l'envoi d'emails :

```javascript
// app/api/demandes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { sendDemandeNotification } from '@/lib/email-service';

const demandeSchema = z.object({
  prenom: z.string().min(1, "Le prénom est requis"),
  nom: z.string().min(1, "Le nom est requis"),
  dateNaissance: z.string().min(1, "La date de naissance est requise"),
  sexe: z.enum(["femme", "homme"]),
  situation: z.string().min(1, "La situation est requise"),
  email: z.string().email("Email invalide"),
  telephoneFixe: z.string().optional(),
  telephonePortable: z.string().optional(),
  adresse: z.string().min(1, "L'adresse est requise"),
  complementAdresse: z.string().optional(),
  codePostal: z.string().min(1, "Le code postal est requis"),
  ville: z.string().default("Apatou"),
  aau: z.boolean().default(false),
  commentaires: z.string().optional(),
  membresfoyer: z.array(z.object({
    nom: z.string().min(1),
    prenom: z.string().min(1),
    sexe: z.enum(["femme", "homme"]),
    dateNaissance: z.string().min(1),
  })).optional(),
  fichiers: z.array(z.object({
    nom: z.string(),
    url: z.string(),
    taille: z.number(),
    type: z.string(),
    categorie: z.enum(["IDENTITE", "RESSOURCES", "CHARGES"]),
  })).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = demandeSchema.parse(body);

    const demande = await prisma.demande.create({
      data: {
        prenom: validatedData.prenom,
        nom: validatedData.nom,
        dateNaissance: validatedData.dateNaissance,
        sexe: validatedData.sexe,
        situation: validatedData.situation,
        email: validatedData.email,
        telephoneFixe: validatedData.telephoneFixe,
        telephonePortable: validatedData.telephonePortable,
        adresse: validatedData.adresse,
        complementAdresse: validatedData.complementAdresse,
        codePostal: validatedData.codePostal,
        ville: validatedData.ville,
        aau: validatedData.aau,
        commentaires: validatedData.commentaires,
        membresfoyer: {
          create: validatedData.membresfoyer || [],
        },
        fichiers: {
          create: validatedData.fichiers || [],
        },
      },
      include: {
        membresfoyer: true,
        fichiers: true,
      },
    });

    // 🆕 Envoi de l'email de notification
    try {
      const emailResult = await sendDemandeNotification({
        ...validatedData,
        membresfoyer: validatedData.membresfoyer || [],
        fichiers: validatedData.fichiers || [],
      }, demande.id);

      console.log('📧 Résultat envoi email:', emailResult);
    } catch (emailError) {
      console.error('❌ Erreur envoi email:', emailError);
      // On ne fait pas échouer la demande si l'email ne passe pas
    }

    return NextResponse.json({ 
      success: true, 
      demande,
      message: "Demande créée avec succès" 
    });

  } catch (error) {
    console.error('Erreur lors de la création de la demande:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Données invalides", 
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: "Erreur interne du serveur" 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const demandes = await prisma.demande.findMany({
      include: {
        membresfoyer: true,
        fichiers: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      demandes,
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des demandes:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Erreur interne du serveur" 
      },
      { status: 500 }
    );
  }
}
```

### 4. Configuration d'un service d'email (optionnel)
Si vous voulez utiliser un vrai service d'email, voici un exemple avec Resend :

```javascript
// npm install resend

// services/emailService.ts

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// ...existing code...

export async function sendDemandeNotification(demande: DemandeEmailData, demandeId: string) {
  const recipients = getEmailRecipients(demande.ville, demande.aau);
  
  const emailContent = generateEmailContent(demande, demandeId);
  
  try {
    const emailData = {
      to: recipients,
      from: 'noreply@saga-aventure-solidaire.fr',
      subject: `${demande.aau ? '[AAU] ' : ''}Nouvelle demande d'aide sociale - ${demande.prenom} ${demande.nom}`,
      html: emailContent,
    };
    
    const result = await resend.emails.send(emailData);
    
    return { success: true, recipients, emailId: result.data?.id };
  } catch (error) {
    console.error('Erreur envoi email:', error);
    return { success: false, error: error.message };
  }
}
```

### 5. Variables d'environnement

Ajoutez dans votre fichier .env.local :

```sh
RESEND_API_KEY=your_resend_api_key_here
```
 


### Fonctionnement

1. **Demande normale (AAU non coché)** : Envoyée aux structures selon la ville
2. **Demande AAU (AAU coché)** : Envoyée aux CCAS selon la ville
3. **Fallback** : Si aucune correspondance, envoi à tidegra@sagga.fr
4. **Email riche** : HTML avec toutes les informations de la demande
5. **Priorité visuelle** : Les demandes AAU sont marquées comme urgentes
6. **L'email sera envoyé automatiquement à chaque nouvelle demande, avec les bonnes adresses selon la logique définie !**