import Link from "next/link"
import { requireUser } from "@/lib/auth"

export default async function ClientLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireUser()

  return (
    <div className="shell grid">
      <header className="card" style={{ display: "flex", justifyContent: "space-between" }}>
        <strong>Espace client</strong>
        <nav style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href="/app">Dashboard</Link>
          <Link href="/app/demandes">Demandes</Link>
          <Link href="/app/demandes/nouvelle">Nouvelle demande</Link>
          <span>{user.email}</span>
        </nav>
      </header>
      {children}
    </div>
  )
}
