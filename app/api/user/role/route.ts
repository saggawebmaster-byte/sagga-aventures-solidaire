import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"

// Utiliser une instance globale de Prisma pour éviter les connexions multiples
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export async function GET(request: NextRequest) {
  try {
    // console.log("🔍 [/api/user/role] Début de la vérification du rôle")
    // console.log("🔍 [/api/user/role] Headers reçus:", Object.fromEntries(request.headers.entries()))

    // Vérifier la session avec Better Auth
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    // console.log("🔍 [/api/user/role] Session récupérée:", session ? "✅ Présente" : "❌ Absente")
    // console.log("🔍 [/api/user/role] User ID:", session?.user?.id)

    if (!session?.user) {
      // console.log("❌ [/api/user/role] Aucune session utilisateur trouvée")
      return Response.json({ error: "Non authentifié" }, { status: 401 })
    }

    // Récupérer le rôle depuis la base de données
    // console.log("🔍 [/api/user/role] Recherche du rôle pour l'utilisateur:", session.user.id)
    
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, email: true }
    })

    // console.log("🔍 [/api/user/role] Utilisateur trouvé:", user ? `✅ ${user.email} - Rôle: ${user.role}` : "❌ Non trouvé")

    if (!user) {
      // console.log("❌ [/api/user/role] Utilisateur non trouvé dans la base de données")
      return Response.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    // console.log("✅ [/api/user/role] Rôle retourné:", user.role)
    return Response.json({ role: user.role })
  } catch (error) {
    // console.error("❌ [/api/user/role] Erreur lors de la récupération du rôle:", error)
    return Response.json({ 
      error: "Erreur serveur", 
      details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined 
    }, { status: 500 })
  } finally {
    // Fermer la connexion Prisma uniquement en production
    if (process.env.NODE_ENV === "production") {
      await prisma.$disconnect()
    }
  }
}
