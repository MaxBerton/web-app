import Link from "next/link"

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="shell grid">
      <header className="card" style={{ display: "flex", justifyContent: "space-between" }}>
        <strong>Dr.Tri</strong>
        <nav style={{ display: "flex", gap: "0.75rem" }}>
          <Link href="/">Accueil</Link>
          <Link href="/services">Services</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/login">Connexion</Link>
        </nav>
      </header>
      {children}
    </div>
  )
}
