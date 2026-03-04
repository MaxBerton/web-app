import Link from "next/link"
import { signInAction } from "@/app/actions/auth"

type LoginPageProps = {
  searchParams: Promise<{ error?: string; info?: string; next?: string; detail?: string }>
}

export default async function AuthLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const nextPath = params.next?.startsWith("/") ? params.next : "/app"
  const errorMessage =
    params.error === "email_not_confirmed"
      ? "Votre email n'est pas confirmé. Vérifiez votre boîte mail."
      : params.error
        ? "Erreur connexion : " + decodeURIComponent(params.detail ?? "vérifiez vos identifiants")
        : null
  const infoMessage =
    params.info === "check_email"
      ? "Compte créé. Confirmez votre email avant de vous connecter."
      : params.info === "password_updated"
        ? "Mot de passe mis à jour. Vous pouvez vous connecter."
        : null

  return (
    <main id="content" className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <section className="w-full max-w-md rounded-dr-tri-lg border border-dr-tri-border bg-white p-8 shadow-sm">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-dr-tri-dark">Connexion</h1>
          <p className="mt-2 text-dr-tri-muted">
            Connectez-vous à votre compte pour suivre vos demandes et gérer vos interventions.
          </p>
        </header>

        {errorMessage && (
          <p className="mb-4 rounded-dr-tri border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {errorMessage}
          </p>
        )}
        {infoMessage && (
          <p className="mb-4 rounded-dr-tri bg-dr-tri-light-green px-3 py-2 text-sm text-dr-tri-dark">
            {infoMessage}
          </p>
        )}

        <form action={signInAction} className="grid gap-4">
          <input type="hidden" name="next" value={nextPath} />
          <label className="grid gap-1.5 text-dr-tri-dark">
            E-mail
            <input
              type="email"
              name="email"
              required
              className="rounded-dr-tri border border-dr-tri-border px-3 py-2 focus:border-dr-tri-primary focus:outline-none focus:ring-1 focus:ring-dr-tri-primary"
            />
          </label>
          <label className="grid gap-1.5 text-dr-tri-dark">
            Mot de passe
            <input
              type="password"
              name="password"
              required
              className="rounded-dr-tri border border-dr-tri-border px-3 py-2 focus:border-dr-tri-primary focus:outline-none focus:ring-1 focus:ring-dr-tri-primary"
            />
          </label>
          <div className="text-sm">
            <Link href="/auth/forgot-password" className="link">
              Mot de passe oublié ?
            </Link>
          </div>
          <button type="submit" className="btn-primary mt-2">
            Se connecter
          </button>
        </form>

        <footer className="mt-8 border-t border-dr-tri-border pt-6 text-center text-dr-tri-muted">
          <p>
            Pas encore de compte ?{" "}
            <Link href="/auth/register" className="link">
              Créer un compte
            </Link>
          </p>
        </footer>
      </section>
    </main>
  )
}
