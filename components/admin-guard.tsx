"use client"

import { useSession } from "@/lib/auth-client"
import { ReactNode, useEffect, useState } from "react"

interface AdminGuardProps {
  readonly children: ReactNode
  readonly fallback?: ReactNode
}

export function AdminGuard({ children, fallback = null }: AdminGuardProps) {
  const { data: session, isPending } = useSession()
  const [userRole, setUserRole] = useState<string | null>(null)
  const [roleLoading, setRoleLoading] = useState(true)
  const [roleError, setRoleError] = useState<string | null>(null)

  useEffect(() => {
    if (session?.user) {
      // Récupérer le rôle via notre API
      fetch('/api/user/role')
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`)
          }
          return res.json()
        })
        .then(data => {
          setUserRole(data.role)
          setRoleLoading(false)
        })
        .catch(err => {
          console.error('Erreur lors de la récupération du rôle:', err)
          setRoleError(err.message)
          setRoleLoading(false)
        })
    } else if (!isPending) {
      setRoleLoading(false)
    }
  }, [session, isPending])

  if (isPending || roleLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session?.user) {
    return fallback || (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-muted-foreground mb-2">
            Non authentifié
          </h2>
          <p className="text-muted-foreground">
            Vous devez vous connecter pour accéder à cette page.
          </p>
        </div>
      </div>
    )
  }

  if (roleError) {
    return fallback || (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Erreur de vérification
          </h2>
          <p className="text-muted-foreground">
            Impossible de vérifier vos permissions: {roleError}
          </p>
        </div>
      </div>
    )
  }

  if (userRole !== "ADMIN") {
    return fallback || (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-muted-foreground mb-2">
            Accès restreint
          </h2>
          <p className="text-muted-foreground">
            Vous devez être administrateur pour accéder à cette page.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Rôle actuel: {userRole || 'Non défini'}
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

interface AdminLinkProps {
  readonly children: ReactNode
  readonly className?: string
}

export function AdminLink({ children, className }: AdminLinkProps) {
  const { data: session } = useSession()
  const [userRole, setUserRole] = useState<string | null>(null)
  const [roleLoading, setRoleLoading] = useState(true)

  useEffect(() => {
    if (session?.user) {
      fetch('/api/user/role')
        .then(res => res.json())
        .then(data => {
          setUserRole(data.role)
          setRoleLoading(false)
        })
        .catch(() => {
          setRoleLoading(false)
        })
    } else {
      setRoleLoading(false)
    }
  }, [session])

  if (roleLoading || !session?.user || userRole !== "ADMIN") {
    return null
  }

  return <span className={className}>{children}</span>
}
