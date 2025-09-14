"use client"

import { useSession } from "@/lib/auth-client"
import { ReactNode } from "react"

// Étendre le type Session pour inclure le rôle
interface UserWithRole {
  id: string
  email: string
  emailVerified: boolean
  name: string
  createdAt: Date
  updatedAt: Date
  image?: string | null
  role: "USER" | "ADMIN"
}

interface AdminGuardProps {
  readonly children: ReactNode
  readonly fallback?: ReactNode
}

export function AdminGuard({ children, fallback = null }: AdminGuardProps) {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Cast du session vers le type avec role
  const userWithRole = session?.user as UserWithRole | undefined

  if (!session?.user || userWithRole?.role !== "ADMIN") {
    return fallback || (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-muted-foreground mb-2">
            Accès restreint
          </h2>
          <p className="text-muted-foreground">
            Vous devez être administrateur pour accéder à cette page.
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

  // Cast du session vers le type avec role
  const userWithRole = session?.user as UserWithRole | undefined

  if (!session?.user || userWithRole?.role !== "ADMIN") {
    return null
  }

  return <span className={className}>{children}</span>
}
