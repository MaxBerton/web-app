import Link from "next/link"
import { forgotPasswordAction } from "@/app/actions/auth"

type ForgotPasswordPageProps = {
  searchParams: Promise<{ success?: string; error?: string }>
}

export default async function AuthForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  const params = await searchParams
  const showSuccess = params.success === "1"
  const showError = params.error === "missing_email" || params.error === "send_failed"

  return (
    <main id="content" className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <section className="w-full max-w-md rounded-dr-tri-lg border border-dr-tri-border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-dr-tri-dark">Mot de passe oublié</h1>
        <p className="mt-2 text-dr-tri-muted">
          Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.
        </p>

        {showSuccess && (
          <p className="mt-6 rounded-dr-tri bg-dr-tri-light-green px-3 py-2 text-sm text-dr-tri-dark">
            Si un compte existe pour cet e-mail, vous recevrez un lien pour réinitialiser votre mot de passe.
          </p>
        )}
        {showError && (
          <p className="mt-6 rounded-dr-tri border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {params.error === "missing_email"
              ? "Veuillez indiquer votre adresse e-mail."
              : "L'envoi a échoué. Réessayez ou contactez-nous."}
          </p>
        )}

        {!showSuccess && (
          <form action={forgotPasswordAction} className="mt-6 grid gap-4">
            <label className="grid gap-1.5 text-dr-tri-dark">
              E-mail
              <input
                type="email"
                name="email"
                required
                className="rounded-dr-tri border border-dr-tri-border px-3 py-2 focus:border-dr-tri-primary focus:outline-none focus:ring-1 focus:ring-dr-tri-primary"
              />
            </label>
            <button type="submit" className="btn-primary mt-2">
              Envoyer le lien
            </button>
          </form>
        )}

        <p className="mt-8">
          <Link href="/auth/login" className="link">
            Retour à la connexion
          </Link>
        </p>
      </section>
    </main>
  )
}
