"use client"

import { useState, useTransition } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "@/lib/auth-client"
import { toast } from "@/hooks/use-toast"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export function LoginForm({
  className,
  ...props
}: Readonly<React.ComponentPropsWithoutRef<"div">>) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      try {
        const { error } = await signIn.email({
          email,
          password,
        })

        if (error) {
          toast({
            title: "Erreur de connexion",
            description: error.message || "Email ou mot de passe incorrect",
            variant: "destructive",
          })
          return
        }

        toast({
          title: "Connexion réussie",
          description: "Bienvenue !",
        })

        // Debug: Log the response and current environment
        console.log('🔍 Debug connexion:', {
          environment: process.env.NODE_ENV,
          baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
          currentURL: window.location.href,
          cookies: document.cookie
        })

        // Force a full page reload to ensure session is properly loaded
        window.location.href = "/admin"
      } catch (err) {
        console.error("Erreur de connexion:", err)
        toast({
          title: "Erreur",
          description: "Une erreur inattendue s'est produite",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <div className={cn("space-y-6", className)} {...props}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Adresse email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="exemple@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11 auth-input transition-all duration-200"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium">
              Mot de passe
            </Label>
            <Link
              href="#"
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Mot de passe oublié ?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 auth-input transition-all duration-200 pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 text-gray-500" />
              )}
            </Button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          disabled={isPending}
        >
          {isPending ? "Connexion en cours..." : "Se connecter"}
        </Button>
      </form>

      <div className="text-center text-xs text-muted-foreground">
        En vous connectant, vous acceptez nos{" "}
        <Link href="#" className="text-primary hover:text-primary/80 transition-colors">
          Conditions d&apos;utilisation
        </Link>{" "}
        et notre{" "}
        <Link href="#" className="text-primary hover:text-primary/80 transition-colors">
          Politique de confidentialité
        </Link>
        .
      </div>
    </div>
  )
}
