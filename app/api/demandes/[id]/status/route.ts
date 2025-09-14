import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const statusSchema = z.object({
  status: z.enum(['ENVOYE', 'TRAITE'])
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status } = statusSchema.parse(body);

    // Vérifier que la demande existe
    const existingDemande = await prisma.demande.findUnique({
      where: { id: params.id }
    });

    if (!existingDemande) {
      return NextResponse.json(
        { success: false, error: "Demande introuvable" },
        { status: 404 }
      );
    }

    // Mettre à jour le statut
    const updatedDemande = await prisma.demande.update({
      where: { id: params.id },
      data: { status },
      include: {
        membresfoyer: true,
        fichiers: true,
      }
    });

    return NextResponse.json({ 
      success: true, 
      demande: updatedDemande,
      message: `Statut mis à jour vers: ${status}` 
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Statut invalide. Les statuts autorisés sont: ENVOYE, TRAITE", 
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
