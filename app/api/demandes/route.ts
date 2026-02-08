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
  nombrePersonnesFoyer: z.number().optional(), // Nouveau champ
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

    // Envoyer la notification email après la création réussie
    try {
      // Calculer le nombre correct de personnes dans le foyer
      const nombrePersonnes = validatedData.nombrePersonnesFoyer || (validatedData.membresfoyer?.length || 0) + 1;
      
      // Adapter les données pour le service email
      const emailData = {
        prenom: validatedData.prenom,
        nom: validatedData.nom,
        dateNaissance: validatedData.dateNaissance,
        telephone: validatedData.telephonePortable || validatedData.telephoneFixe || '',
        email: validatedData.email,
        adresse: validatedData.adresse,
        ville: validatedData.ville,
        codePostal: validatedData.codePostal,
        situationFamiliale: validatedData.situation,
        nombreEnfants: validatedData.membresfoyer?.length || 0,
        nombrePersonnesFoyer: nombrePersonnes, // Utiliser le nombre calculé
        sourcesRevenus: [], // Pas de données détaillées dans le formulaire actuel
        montantRevenus: 0,   // Pas de données détaillées dans le formulaire actuel
        chargesLogement: 0,  // Pas de données détaillées dans le formulaire actuel
        autresCharges: 0,    // Pas de données détaillées dans le formulaire actuel
        prestationsCaf: [],  // Pas de données détaillées dans le formulaire actuel
        dettesActuelles: '',
        difficultesRencontrees: validatedData.commentaires || '',
        demandesPrecedentes: '',
        attentesBesoins: validatedData.commentaires || '',
        aau: validatedData.aau,
        membres: validatedData.membresfoyer?.map(membre => ({
          prenom: membre.prenom,
          nom: membre.nom,
          dateNaissance: membre.dateNaissance,
          lienParente: 'Membre du foyer'
        })),
        fichiers: validatedData.fichiers || [], // Envoyer les fichiers complets avec URLs
        fichierJustificatifs: validatedData.fichiers?.length ? 
          `${validatedData.fichiers.length} fichier(s) joint(s)` : undefined,
        createdAt: demande.createdAt
      };

      const emailResult = await sendDemandeNotification(emailData);
      
      if (!emailResult.success) {
        console.error('Erreur envoi email:', emailResult.error);
        // Ne pas faire échouer la création de la demande si l'email échoue
      }

    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email:', emailError);
      // Continue quand même, l'email n'est pas critique
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

    return NextResponse.json({ success: true, demandes });
  } catch (error) {
    console.error('Erreur lors de la récupération des demandes:', error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}