import Link from "next/link"
import { Logo } from "@/components/Logo"
import { PublicHeader } from "@/components/PublicHeader"

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col bg-dr-tri-background text-dr-tri-dark">
      <PublicHeader />
      <div className="flex-1">{children}</div>
      <footer className="shrink-0 border-t border-dr-tri-border bg-white">
        <div className="container-dr py-12">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <Logo href="/" size="sm" showText={false} direction="row" className="inline-flex" />
              <p className="mt-2 text-sm text-dr-tri-muted">
                On transporte, on installe, on débarrasse. Service local, intervention rapide.
              </p>
            </div>
            <nav className="flex flex-col gap-2" aria-label="Liens du site">
              <span className="text-sm font-semibold text-dr-tri-dark">Navigation</span>
              <Link href="/" className="text-dr-tri-muted hover:text-dr-tri-primary">
                Accueil
              </Link>
              <Link href="/services" className="text-dr-tri-muted hover:text-dr-tri-primary">
                Services
              </Link>
              <Link href="/a-propos" className="text-dr-tri-muted hover:text-dr-tri-primary">
                À propos
              </Link>
              <Link href="/contact" className="text-dr-tri-muted hover:text-dr-tri-primary">
                Contact
              </Link>
            </nav>
            <div>
              <span className="text-sm font-semibold text-dr-tri-dark">Espace client</span>
              <p className="mt-2">
                <Link
                  href="/auth/login"
                  className="text-dr-tri-muted hover:text-dr-tri-primary"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
          <div className="mt-10 border-t border-dr-tri-border pt-6 text-center text-sm text-dr-tri-muted">
            © {new Date().getFullYear()} Dr.Tri. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  )
}
