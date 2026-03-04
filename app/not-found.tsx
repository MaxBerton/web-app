import Link from "next/link"

export default function RootNotFoundPage() {
  return (
    <main className="shell">
      <section className="card grid">
        <h1>Page introuvable</h1>
        <Link className="btn" href="/">
          Retour a l'accueil
        </Link>
      </section>
    </main>
  )
}
