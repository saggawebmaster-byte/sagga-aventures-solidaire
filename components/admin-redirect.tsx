"use client"

import { useSession } from "@/lib/auth-client"
import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export function AdminRedirect() {
    const { data: session } = useSession()
    const [userRole, setUserRole] = useState<string | null>(null)
    const [redirectAttempts, setRedirectAttempts] = useState(0)
    const [isRedirecting, setIsRedirecting] = useState(false)
    const redirectAttempted = useRef(false)
    const router = useRouter()
    const searchParams = useSearchParams()

    const callbackUrl = searchParams.get('callbackUrl')

    useEffect(() => {
        if (session?.user && typeof window !== 'undefined' && !redirectAttempted.current) {
            // Récupérer le rôle via notre API
            fetch('/api/user/role')
                .then(res => res.json())
                .then(data => {
                    setUserRole(data.role)

                    // Si l'utilisateur est admin et qu'on est sur la page de login avec un callback
                    if (data.role === 'ADMIN' && callbackUrl && window.location.pathname === '/auth/login') {
                        redirectAttempted.current = true
                        setIsRedirecting(true)

                        console.log('🔄 Tentative de redirection...', {
                            role: data.role,
                            callbackUrl,
                            currentPath: window.location.pathname
                        })

                        // Essayer la redirection avec délai progressif
                        setTimeout(() => {
                            setRedirectAttempts(1)
                            router.push(callbackUrl)
                        }, 500)

                        setTimeout(() => {
                            if (window.location.pathname === '/auth/login') {
                                setRedirectAttempts(2)
                                router.replace(callbackUrl)
                            }
                        }, 2000)

                        setTimeout(() => {
                            if (window.location.pathname === '/auth/login') {
                                setRedirectAttempts(3)
                                window.location.href = callbackUrl
                            }
                        }, 4000)
                    }
                })
                .catch(err => {
                    console.error('Erreur lors de la récupération du rôle pour redirection:', err)
                })
        }
    }, [session, callbackUrl, router])

    // Affichage conditionnel si on est admin sur la page de login
    if (session?.user && userRole === 'ADMIN' && callbackUrl && isRedirecting &&
        typeof window !== 'undefined' && window.location.pathname === '/auth/login') {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#752D8B] mx-auto mb-4"></div>
                    <h3 className="text-lg font-semibold mb-2">Redirection en cours...</h3>
                    <p className="text-gray-600 mb-4">Vous êtes connecté en tant qu'administrateur</p>
                    <p className="text-sm text-gray-500">
                        Tentative {redirectAttempts}/3
                    </p>

                    {redirectAttempts >= 3 && (
                        <div className="mt-4">
                            <p className="text-sm text-red-600 mb-2">Redirection automatique échouée</p>
                            <button
                                onClick={() => window.location.href = callbackUrl}
                                className="bg-[#752D8B] text-white px-4 py-2 rounded hover:bg-[#652575] transition-colors"
                            >
                                Aller au dashboard admin
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return null
}
