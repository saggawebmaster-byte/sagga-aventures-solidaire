import { auth } from "@/lib/auth"

export type UserRole = "USER" | "ADMIN"

export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: new Headers()
  })
  
  return session?.user || null
}

export async function getCurrentUserRole(): Promise<UserRole | null> {
  const user = await getCurrentUser()
  return (user?.role as UserRole) || null
}

export async function isAdmin(): Promise<boolean> {
  const role = await getCurrentUserRole()
  return role === "ADMIN"
}

export async function requireAdmin() {
  const admin = await isAdmin()
  if (!admin) {
    throw new Error("Access denied: Admin role required")
  }
  return true
}

// Types pour l'utilisation côté client
export interface UserWithRole {
  id: string
  name?: string | null
  email: string
  role: UserRole
  image?: string | null
}
