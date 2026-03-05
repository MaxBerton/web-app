import Link from "next/link"
import { Logo } from "@/components/Logo"

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-dr-tri-background text-dr-tri-dark">
      <header className="auth-header border-b border-dr-tri-border bg-white">
        <div className="container-dr mx-auto flex h-24 items-center justify-between">
          <Logo href="/" size="sm" showText={false} direction="row" />
          <nav aria-label="Navigation authentification">
            <Link href="/contact" className="text-dr-tri-muted hover:text-dr-tri-primary focus:outline-none focus:ring-2 focus:ring-dr-tri-primary rounded-dr-tri px-2 py-1 text-sm font-medium transition-colors">
              Contact
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  )
}
