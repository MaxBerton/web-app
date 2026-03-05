import Link from "next/link"
import { RegisterForm } from "@/components/auth/RegisterForm"

type RegisterPageProps = {
  searchParams: Promise<{ error?: string; detail?: string }>
}

export default async function AuthRegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams
  const serverErrorMessage =
    params.error === "user_already_exists" || params.error === "email_exists"
      ? "Cet email est déjà utilisé. Connectez-vous ou réinitialisez le mot de passe."
      : params.error === "password_mismatch"
        ? "Les mots de passe ne correspondent pas."
        : params.error
          ? "Erreur inscription : " + decodeURIComponent(params.detail ?? "cause inconnue")
          : null
  const inputClass =
    "w-full rounded-dr-tri border border-dr-tri-border bg-white px-3 py-2.5 text-dr-tri-dark placeholder-dr-tri-muted focus:border-dr-tri-primary focus:outline-none focus:ring-1 focus:ring-dr-tri-primary"

  return (
    <main id="content" className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <section className="w-full max-w-xl rounded-dr-tri-lg border border-dr-tri-border bg-white p-8 shadow-sm md:p-10">
        <header className="mb-7">
          <h1 className="text-3xl font-bold text-dr-tri-dark">Créer un compte</h1>
          <p className="mt-2 text-dr-tri-muted text-lg">
            Créez un compte pour suivre vos demandes et gérer vos interventions.
          </p>
        </header>

        <RegisterForm inputClass={inputClass} serverErrorMessage={serverErrorMessage} />

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
