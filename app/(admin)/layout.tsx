import Link from "next/link"
import { requireAdmin } from "@/lib/auth"
import { signOutAction } from "@/app/actions/auth"

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireAdmin()

  return (
    <div className="shell grid">
      <header className="card" style={{ display: "flex", justifyContent: "space-between" }}>
        <strong>Backoffice admin</strong>
        <nav style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/demandes">Demandes</Link>
          <Link href="/admin/services">Configuration</Link>
          <span>{user.email}</span>
          <form action={signOutAction}>
            <button className="btn" type="submit">
              Deconnexion
            </button>
          </form>
        </nav>
      </header>
      {children}
    </div>
  )
}
