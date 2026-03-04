import Link from "next/link"
import { requireUser } from "@/lib/auth"
import { signOutAction } from "@/app/actions/auth"
import { Logo } from "@/components/Logo"

export default async function ClientLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireUser()

  return (
    <div className="app-dr min-h-screen bg-dr-tri-background text-dr-tri-dark">
      <div className="shell grid">
        <header className="card flex flex-wrap items-center justify-between gap-4 border-dr-tri-border bg-white">
          <div className="flex items-center gap-3">
            <Logo href="/app" size="sm" showText={false} direction="row" />
            <span className="text-sm font-medium text-dr-tri-muted border-l border-dr-tri-border pl-3">
              Espace client
            </span>
          </div>
          <nav className="flex flex-wrap items-center gap-3 text-sm">
            <Link href="/app" className="text-dr-tri-dark hover:text-dr-tri-primary">
              Dashboard
            </Link>
            <Link href="/app/demandes" className="text-dr-tri-dark hover:text-dr-tri-primary">
              Demandes
            </Link>
            <Link href="/app/documents" className="text-dr-tri-dark hover:text-dr-tri-primary">
              Documents
            </Link>
            <Link href="/app/profile" className="text-dr-tri-dark hover:text-dr-tri-primary">
              Profil
            </Link>
            <Link href="/app/contact" className="text-dr-tri-dark hover:text-dr-tri-primary">
              Contact
            </Link>
            <span className="text-dr-tri-muted">{user.email}</span>
            <form action={signOutAction}>
              <button className="btn" type="submit">
                Déconnexion
              </button>
            </form>
          </nav>
        </header>
        {children}
      </div>
    </div>
  )
}
