import Link from "next/link"
import { signInAction } from "../auth-actions"

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams

  return (
    <main className="card grid" style={{ maxWidth: 440 }}>
      <h1>Connexion</h1>
      {params.error ? <p>Erreur: verifiez vos identifiants.</p> : null}
      <form className="grid" action={signInAction}>
        <label className="grid" style={{ gap: "0.35rem" }}>
          Email
          <input name="email" type="email" required />
        </label>
        <label className="grid" style={{ gap: "0.35rem" }}>
          Mot de passe
          <input name="password" type="password" required />
        </label>
        <button className="btn" type="submit">
          Se connecter
        </button>
      </form>
      <Link href="/register">Creer un compte</Link>
    </main>
  )
}
