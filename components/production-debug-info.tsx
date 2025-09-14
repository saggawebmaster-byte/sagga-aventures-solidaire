"use client"

import { useSession } from "@/lib/auth-client"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export function ProductionDebugInfo() {
    const { data: session, isPending } = useSession()
    const [userRole, setUserRole] = useState<string | null>(null)
    const [roleLoading, setRoleLoading] = useState(true)
    const [roleError, setRoleError] = useState<string | null>(null)
    const [authFlow, setAuthFlow] = useState<string[]>([])
    const router = useRouter()
    const searchParams = useSearchParams()

    const callbackUrl = searchParams.get('callbackUrl')

    useEffect(() => {
        // Log du flow d'authentification
        const flow = []
        flow.push(`${new Date().toISOString()} - Composant ProductionDebugInfo monté`)
        flow.push(`${new Date().toISOString()} - URL actuelle: ${window.location.href}`)
        flow.push(`${new Date().toISOString()} - Callback URL: ${callbackUrl || 'Non défini'}`)
        flow.push(`${new Date().toISOString()} - Session loading: ${isPending}`)
        flow.push(`${new Date().toISOString()} - Session présente: ${session ? 'Oui' : 'Non'}`)

        if (session?.user) {
            flow.push(`${new Date().toISOString()} - User ID: ${session.user.id}`)
            flow.push(`${new Date().toISOString()} - User email: ${session.user.email}`)
            flow.push(`${new Date().toISOString()} - User role (session): ${(session.user as any).role || 'Non défini'}`)
        }

        setAuthFlow(flow)
    }, [session, isPending, callbackUrl])

    useEffect(() => {
        if (session?.user) {
            setAuthFlow(prev => [...prev, `${new Date().toISOString()} - Récupération du rôle via API...`])

            // Récupérer le rôle via notre API
            fetch('/api/user/role')
                .then(res => {
                    setAuthFlow(prev => [...prev, `${new Date().toISOString()} - API Response status: ${res.status}`])
                    if (!res.ok) {
                        throw new Error(`HTTP ${res.status}`)
                    }
                    return res.json()
                })
                .then(data => {
                    setAuthFlow(prev => [...prev, `${new Date().toISOString()} - Rôle récupéré: ${data.role}`])
                    setUserRole(data.role)
                    setRoleLoading(false)

                    // Si l'utilisateur est admin et qu'on est sur la page de login avec un callback, rediriger
                    if (data.role === 'ADMIN' && callbackUrl && window.location.pathname === '/auth/login') {
                        setAuthFlow(prev => [...prev, `${new Date().toISOString()} - Redirection vers: ${callbackUrl}`])
                        router.push(callbackUrl)
                    }
                })
                .catch(err => {
                    setAuthFlow(prev => [...prev, `${new Date().toISOString()} - Erreur API: ${err.message}`])
                    setRoleError(err.message)
                    setRoleLoading(false)
                })
        } else if (!isPending) {
            setRoleLoading(false)
        }
    }, [session, isPending, callbackUrl, router])

    return (
        <div className="fixed bottom-4 right-4 max-w-md bg-white border border-gray-300 shadow-lg rounded-lg p-4 z-50 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-sm">🔍 Debug Production</h3>
                <div className="text-xs text-gray-500">
                    {process.env.NODE_ENV} - {process.env.VERCEL_ENV || 'local'}
                </div>
            </div>

            <div className="space-y-2 text-xs">
                <div className="border-b pb-2">
                    <div><strong>Base URL:</strong> {process.env.NEXT_PUBLIC_BETTER_AUTH_URL}</div>
                    <div><strong>Session:</strong> {isPending ? '⏳' : session?.user ? '✅' : '❌'}</div>
                    <div><strong>Rôle API:</strong> {roleLoading ? '⏳' : userRole || roleError || '❌'}</div>
                </div>

                <div>
                    <strong>Flow d'authentification:</strong>
                    <div className="mt-1 space-y-1 max-h-32 overflow-y-auto bg-gray-50 p-2 rounded text-xs font-mono">
                        {authFlow.map((step, index) => (
                            <div key={index} className="text-xs">{step}</div>
                        ))}
                    </div>
                </div>

                {session?.user && (
                    <div className="border-t pt-2">
                        <strong>Détails utilisateur:</strong>
                        <div className="ml-2 space-y-1">
                            <div>ID: {session.user.id}</div>
                            <div>Email: {session.user.email}</div>
                            <div>Cookies: ✅ (Session active)</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
