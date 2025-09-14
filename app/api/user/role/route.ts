import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Vérifier la session avec Better Auth
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user) {
      return Response.json({ error: "Non authentifié" }, { status: 401 })
    }

    // Récupérer le rôle depuis la base de données
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (!user) {
      return Response.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    return Response.json({ role: user.role })
  } catch (error) {
    console.error("Erreur lors de la récupération du rôle:", error)
    return Response.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
