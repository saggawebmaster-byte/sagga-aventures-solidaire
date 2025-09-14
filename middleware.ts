import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware simplifié pour protéger les routes
export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Routes qui nécessitent une authentification
  const protectedRoutes = ['/dashboard']
  // Routes qui nécessitent le rôle admin
  const adminRoutes = ['/admin']
  
  // Vérifier si la route actuelle est protégée
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  const isAdminRoute = adminRoutes.some(route => 
    pathname.startsWith(route)
  )

  if (isProtectedRoute || isAdminRoute) {
    // Vérifier la présence du cookie de session Better Auth
    const sessionCookie = request.cookies.get('better-auth.session_token') || 
                         request.cookies.get('better-auth.session') ||
                         request.cookies.get('session_token') ||
                         request.cookies.get('session')

    console.log('🔍 Middleware check:', {
      pathname,
      hasSessionCookie: !!sessionCookie,
      isAdminRoute,
      isProtectedRoute
    })

    if (!sessionCookie) {
      console.log('❌ No session cookie found, redirecting to login')
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Pour les routes admin, nous ferons la vérification du rôle côté client
    // car le middleware ne peut pas facilement décoder le token de session
    console.log('✅ Session cookie found, allowing access')
  }

  return NextResponse.next()
}

// Configuration du middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
