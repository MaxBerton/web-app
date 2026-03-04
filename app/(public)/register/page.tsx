import Link from "next/link"
import { registerAction } from "../auth-actions"

type RegisterPageProps = {
  searchParams: Promise<{ error?: string; detail?: string }>
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams
  const errorMessage =
    params.error === "user_already_exists" || params.error === "email_exists"
      ? "Cet email est deja utilise. Essaie de te connecter ou de reinitialiser le mot de passe."
      : params.error
        ? "Erreur inscription: " + decodeURIComponent(params.detail ?? "cause inconnue")
        : null

  return (
    <main className="card grid" style={{ maxWidth: 440 }}>
      <h1>Creation de compte</h1>
      {errorMessage ? <p>{errorMessage}</p> : null}
      <form className="grid" action={registerAction}>
        <label className="grid" style={{ gap: "0.35rem" }}>
          Email
          <input name="email" type="email" required />
        </label>
        <label className="grid" style={{ gap: "0.35rem" }}>
          Mot de passe
          <input name="password" type="password" minLength={8} required />
        </label>
        <button className="btn" type="submit">
          Creer mon compte
        </button>
      </form>
      <Link href="/login">J'ai deja un compte</Link>
    </main>
  )
}
