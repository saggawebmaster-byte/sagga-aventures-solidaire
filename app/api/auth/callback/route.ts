import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  
  try {
    console.log("🔄 [/api/auth/callback] Vérification de la session pour redirection")
    console.log("🔄 [/api/auth/callback] Callback URL:", callbackUrl)

    // Vérifier la session avec Better Auth
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user) {
      console.log("❌ [/api/auth/callback] Aucune session - redirection vers login")
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // console.log("✅ [/api/auth/callback] Session valide - redirection vers:", callbackUrl)
    
    // Rediriger vers l'URL de callback ou la page d'accueil
    return NextResponse.redirect(new URL(callbackUrl, request.url))
  } catch (error) {
    console.error("❌ [/api/auth/callback] Erreur lors de la redirection:", error)
    return NextResponse.redirect(new URL('/', request.url))
  }
}
