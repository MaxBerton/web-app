import Link from "next/link"

export default function HomePage() {
  return (
    <main className="card grid">
      <h1>Plateforme Dr.Tri</h1>
      <p>On transporte, on installe, on debarrasse.</p>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <Link className="btn" href="/services">
          Voir les services
        </Link>
        <Link className="btn" href="/app">
          Aller a mon espace
        </Link>
      </div>
    </main>
  )
}
