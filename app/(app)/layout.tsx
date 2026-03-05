import Link from "next/link"
import { requireUser } from "@/lib/auth"
import { Logo } from "@/components/Logo"

export default async function ClientLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireUser()

  return (
    <div className="app-dr min-h-screen bg-dr-tri-background text-dr-tri-dark">
      <div className="shell grid">
        <header className="card flex flex-wrap items-center justify-between gap-4 border-dr-tri-border bg-white">
          <div className="flex items-center gap-3">
            <Logo href="/app" size="sm" showText={false} direction="row" />
          </div>
          <nav className="flex w-full flex-wrap items-center gap-3 text-sm sm:w-auto">
            <Link href="/app" className="text-dr-tri-dark hover:text-dr-tri-primary">
              Mon tri
            </Link>
            <Link href="/app/demandes" className="text-dr-tri-dark hover:text-dr-tri-primary">
              Mes demandes
            </Link>
            <Link href="/app/contact" className="text-dr-tri-dark hover:text-dr-tri-primary">
              Contact
            </Link>
            <span className="ml-auto" aria-hidden />
            <Link href="/app/profile" className="text-dr-tri-dark hover:text-dr-tri-primary">
              Profil
            </Link>
          </nav>
        </header>
        {children}
      </div>
    </div>
  )
}
