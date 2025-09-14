import { RegisterForm } from "@/components/register-form"
import { AuthLayout } from "@/components/auth-layout"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Rejoignez notre mission !"
      subtitle="Créez votre compte et participez à la lutte contre la précarité alimentaire en Guyane"
    >
      <RegisterForm />

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Vous avez déjà un compte ?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Connectez-vous
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
