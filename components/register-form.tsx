"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signUp } from "@/lib/auth-client"
import { toast } from "@/hooks/use-toast"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export function RegisterForm({
  className,
  ...props
}: Readonly<React.ComponentPropsWithoutRef<"div">>) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      try {
        const { error } = await signUp.email({
          email,
          password,
          name,
        })

        if (error) {
          toast({
            title: "Erreur d'inscription",
            description: error.message || "Une erreur s'est produite lors de l'inscription",
            variant: "destructive",
          })
          return
        }

        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé avec succès !",
        })

        router.push("/dashboard")
      } catch (err) {
        console.error("Erreur d'inscription:", err)
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
          <Label htmlFor="name" className="text-sm font-medium">
            Nom complet
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Votre nom complet"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="h-11 auth-input transition-all duration-200"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Adresse email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11 auth-input transition-all duration-200"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Mot de passe
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Choisissez un mot de passe sécurisé"
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
          <p className="text-xs text-muted-foreground">
            Minimum 8 caractères avec au moins une lettre et un chiffre
          </p>
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          disabled={isPending}
        >
          {isPending ? "Création du compte..." : "Créer mon compte"}
        </Button>
      </form>

      <div className="text-center text-xs text-muted-foreground">
        En créant un compte, vous acceptez nos{" "}
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
