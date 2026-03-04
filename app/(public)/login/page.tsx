import Link from "next/link"
import { signInAction } from "../auth-actions"

type LoginPageProps = {
  searchParams: Promise<{ error?: string; info?: string; next?: string; detail?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const nextPath = params.next?.startsWith("/") ? params.next : "/app"
  const errorMessage =
    params.error === "email_not_confirmed"
      ? "Votre email n'est pas confirme. Verifiez votre boite mail."
      : params.error
        ? "Erreur connexion: " + decodeURIComponent(params.detail ?? "verifiez vos identifiants")
        : null
  const infoMessage =
    params.info === "check_email"
      ? "Compte cree. Confirmez votre email avant de vous connecter."
      : null

  return (
    <main className="card grid" style={{ maxWidth: 440 }}>
      <h1>Connexion</h1>
      {errorMessage ? <p>{errorMessage}</p> : null}
      {infoMessage ? <p>{infoMessage}</p> : null}
      <form className="grid" action={signInAction}>
        <input type="hidden" name="next" value={nextPath} />
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
