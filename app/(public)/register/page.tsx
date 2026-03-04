import Link from "next/link"
import { registerAction } from "../auth-actions"

type RegisterPageProps = {
  searchParams: Promise<{ error?: string }>
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams

  return (
    <main className="card grid" style={{ maxWidth: 440 }}>
      <h1>Creation de compte</h1>
      {params.error ? <p>Erreur: inscription impossible pour le moment.</p> : null}
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
