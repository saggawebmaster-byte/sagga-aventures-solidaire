import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const updateStatusSchema = z.object({
  status: z.enum(['EN_ATTENTE', 'EN_COURS', 'ACCEPTEE', 'REFUSEE']),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status } = updateStatusSchema.parse(body);

    const demande = await prisma.demande.update({
      where: { id: params.id },
      data: { status },
      include: {
        membresfoyer: true,
        fichiers: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      demande,
      message: "Statut mis à jour avec succès" 
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Statut invalide", 
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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const demande = await prisma.demande.findUnique({
      where: { id: params.id },
      include: {
        membresfoyer: true,
        fichiers: true,
      },
    });

    if (!demande) {
      return NextResponse.json(
        { success: false, error: "Demande non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, demande });
  } catch (error) {
    console.error('Erreur lors de la récupération de la demande:', error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.demande.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Demande supprimée avec succès" 
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la demande:', error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}