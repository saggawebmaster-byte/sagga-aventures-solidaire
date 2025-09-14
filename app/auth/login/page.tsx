import { LoginForm } from "@/components/login-form"
import { AuthLayout } from "@/components/auth-layout"
import { ProductionDebugInfo } from "@/components/production-debug-info"
import Link from "next/link"

export default function AuthLoginPage() {
  return (
    <AuthLayout
      title="Bon retour parmi nous !"
      subtitle="Connectez-vous à votre compte administrateur pour gérer et suivre les demandes reçues"
    >
      <LoginForm />

      {/* <div className="text-center">
      <p className="text-sm text-muted-foreground">
        Vous n&apos;avez pas encore de compte ?{" "}
        <Link
        href="/auth/register"
        className="font-medium text-primary hover:text-primary/80 transition-colors"
        >
        Rejoignez notre réseau solidaire
        </Link>
      </p>
      </div> */}

      {/* Composant de debug pour la production */}
      {process.env.NODE_ENV === 'production' && <ProductionDebugInfo />}
    </AuthLayout>
  )
}
