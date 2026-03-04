import Link from "next/link"
import { registerAction } from "@/app/actions/auth"

type RegisterPageProps = {
  searchParams: Promise<{ error?: string; detail?: string }>
}

export default async function AuthRegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams
  const errorMessage =
    params.error === "user_already_exists" || params.error === "email_exists"
      ? "Cet email est déjà utilisé. Connectez-vous ou réinitialisez le mot de passe."
      : params.error === "password_mismatch"
        ? "Les mots de passe ne correspondent pas."
        : params.error
          ? "Erreur inscription : " + decodeURIComponent(params.detail ?? "cause inconnue")
          : null

  return (
    <main id="content" className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <section className="w-full max-w-md rounded-dr-tri-lg border border-dr-tri-border bg-white p-8 shadow-sm">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-dr-tri-dark">Créer un compte</h1>
          <p className="mt-2 text-dr-tri-muted">
            Créez un compte pour suivre vos demandes et gérer vos interventions.
          </p>
        </header>

        {errorMessage && (
          <p className="mb-4 rounded-dr-tri border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {errorMessage}
          </p>
        )}

        <form action={registerAction} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-dr-tri-dark">
              Prénom
              <input
                type="text"
                name="first_name"
                required
                className="rounded-dr-tri border border-dr-tri-border px-3 py-2 focus:border-dr-tri-primary focus:outline-none focus:ring-1 focus:ring-dr-tri-primary"
              />
            </label>
            <label className="grid gap-1.5 text-dr-tri-dark">
              Nom
              <input
                type="text"
                name="last_name"
                required
                className="rounded-dr-tri border border-dr-tri-border px-3 py-2 focus:border-dr-tri-primary focus:outline-none focus:ring-1 focus:ring-dr-tri-primary"
              />
            </label>
          </div>
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
              minLength={8}
              required
              className="rounded-dr-tri border border-dr-tri-border px-3 py-2 focus:border-dr-tri-primary focus:outline-none focus:ring-1 focus:ring-dr-tri-primary"
            />
          </label>
          <label className="grid gap-1.5 text-dr-tri-dark">
            Confirmer le mot de passe
            <input
              type="password"
              name="confirm_password"
              minLength={8}
              required
              className="rounded-dr-tri border border-dr-tri-border px-3 py-2 focus:border-dr-tri-primary focus:outline-none focus:ring-1 focus:ring-dr-tri-primary"
            />
          </label>
          <label className="flex gap-2 text-sm text-dr-tri-muted">
            <input type="checkbox" name="terms" required className="mt-0.5" />
            <span>J&apos;accepte les conditions d&apos;utilisation</span>
          </label>
          <button type="submit" className="btn-primary mt-2">
            Créer mon compte
          </button>
        </form>

        <footer className="mt-8 border-t border-dr-tri-border pt-6 text-center text-dr-tri-muted">
          <p>
            Déjà inscrit ?{" "}
            <Link href="/auth/login" className="link">
              Se connecter
            </Link>
          </p>
        </footer>
      </section>
    </main>
  )
}
