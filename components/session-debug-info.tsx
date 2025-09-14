"use client"

import { useSession } from "@/lib/auth-client"
import { useState, useEffect } from "react"

export function SessionDebugInfo() {
    const { data: session, isPending } = useSession()
    const [userRole, setUserRole] = useState<string | null>(null)
    const [roleError, setRoleError] = useState<string | null>(null)

    useEffect(() => {
        // Essayer de récupérer le rôle via notre API
        fetch('/api/user/role')
            .then(res => res.json())
            .then(data => {
                if (data.role) {
                    setUserRole(data.role)
                } else {
                    setRoleError(data.error || 'Rôle non trouvé')
                }
            })
            .catch(err => {
                setRoleError(err.message)
            })
    }, [session])

    if (isPending) {
        return <div className="p-4 bg-blue-50 border border-blue-200 rounded">
            ⏳ Chargement de la session...
        </div>
    }

    return (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded mb-4">
            <h3 className="font-semibold mb-2">🔍 Debug Session</h3>
            <div className="space-y-2 text-sm">
                <div><strong>Environnement:</strong> {process.env.NODE_ENV}</div>
                <div><strong>Base URL:</strong> {process.env.NEXT_PUBLIC_BETTER_AUTH_URL}</div>
                <div><strong>URL actuelle:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</div>
                <div><strong>Session utilisateur:</strong> {session?.user ? '✅ Connecté' : '❌ Non connecté'}</div>
                {session?.user && (
                    <div className="ml-4 space-y-1">
                        <div><strong>ID:</strong> {session.user.id}</div>
                        <div><strong>Email:</strong> {session.user.email}</div>
                        <div><strong>Nom:</strong> {session.user.name}</div>
                        <div><strong>Rôle (session):</strong> {(session.user as any).role || 'Non défini'}</div>
                        <div><strong>Rôle (API):</strong> {userRole || roleError || 'Chargement...'}</div>
                    </div>
                )}
                <div><strong>Cookies:</strong> {typeof document !== 'undefined' ? document.cookie.substring(0, 100) + '...' : 'N/A'}</div>
            </div>
        </div>
    )
}
