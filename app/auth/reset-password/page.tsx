import Link from "next/link"
import { ResetPasswordForm } from "./ResetPasswordForm"

export default function AuthResetPasswordPage() {
  return (
    <main id="content" className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <section className="w-full max-w-md rounded-dr-tri-lg border border-dr-tri-border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-dr-tri-dark">Nouveau mot de passe</h1>
        <p className="mt-2 text-dr-tri-muted">
          Définissez un nouveau mot de passe pour votre compte.
        </p>
        <ResetPasswordForm />
        <p className="mt-6">
          <Link href="/auth/login" className="link">
            Retour à la connexion
          </Link>
        </p>
      </section>
    </main>
  )
}
