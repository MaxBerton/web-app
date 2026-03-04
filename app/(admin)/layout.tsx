import Link from "next/link"
import { requireAdmin } from "@/lib/auth"

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
          <span>{user.email}</span>
        </nav>
      </header>
      {children}
    </div>
  )
}
