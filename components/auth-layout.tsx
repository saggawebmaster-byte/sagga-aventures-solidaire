import { ReactNode } from "react"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
  className?: string
}

export function AuthLayout({ children, title, subtitle, className }: Readonly<AuthLayoutProps>) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 auth-page">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:flex-col lg:justify-center lg:px-12 bg-gradient-to-br from-primary/10 via-primary/5 to-background relative overflow-hidden auth-gradient-overlay">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" />
        <div className="absolute inset-0 opacity-30">
          <div className="h-full w-full bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent('<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="#752D8B" fill-opacity="0.05"><circle cx="30" cy="30" r="4"/></g></g></svg>')}")`
          }} />
        </div>

        <div className="relative z-10 max-w-lg mx-auto text-center lg:text-left auth-page-enter">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg auth-logo-pulse">
              <Heart className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold text-primary">SAGGA</h1>
          </div>

          <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
            Solidarité Alimentaire en Guyane
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed">
            SAGGA fédère un réseau d&apos;épiceries sociales et solidaires pour lutter contre la précarité alimentaire.
            Ensemble, nous créons une plateforme unique d&apos;aide alimentaire participative en Guyane et aux Antilles.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">5+</div>
              <div className="text-sm text-muted-foreground">Épiceries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">2021</div>
              <div className="text-sm text-muted-foreground">Fondation</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Solidaire</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-col justify-center px-6 py-12 lg:px-8 bg-background">
        <div className="mx-auto w-full max-w-md auth-page-enter">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground auth-logo-pulse">
              <Heart className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold text-primary">SAGGA</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          <div className={cn("space-y-6", className)}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
