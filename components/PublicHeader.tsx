"use client"

import Link from "next/link"
import { useState } from "react"
import { Logo } from "@/components/Logo"

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
]

export function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="shrink-0 border-b border-dr-tri-border bg-white/80 backdrop-blur-sm">
      <div className="container-dr flex h-24 items-center justify-between gap-4">
        <Logo href="/" size="sm" showText={false} direction="row" />

        {/* Desktop: Nav + Se connecter + CTA */}
        <nav
          className="hidden items-center gap-6 lg:flex"
          aria-label="Navigation principale"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-dr-tri-dark hover:text-dr-tri-primary"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/auth/login"
            className="text-dr-tri-muted hover:text-dr-tri-primary"
          >
            Se connecter
          </Link>
          <Link
            href="/contact"
            className="btn-primary whitespace-nowrap px-6 py-2.5 text-base"
          >
            Demander une intervention
          </Link>
        </nav>

        {/* Mobile: CTA + Burger */}
        <div className="flex items-center gap-3 lg:hidden">
          <Link
            href="/contact"
            className="btn-primary whitespace-nowrap px-4 py-2 text-sm"
          >
            Demander une intervention
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-dr-tri border border-dr-tri-border text-dr-tri-dark hover:bg-dr-tri-light-green"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label="Ouvrir le menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        id="mobile-nav"
        className={`overflow-hidden border-t border-dr-tri-border bg-white transition-[height] duration-200 ease-out lg:hidden ${menuOpen ? "h-auto" : "h-0 border-t-0"}`}
        aria-hidden={!menuOpen}
      >
        <nav className="container-dr flex flex-col gap-1 py-4" aria-label="Navigation mobile">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-3 text-dr-tri-dark hover:text-dr-tri-primary"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/auth/login"
            className="mt-2 py-3 text-dr-tri-muted hover:text-dr-tri-primary"
            onClick={() => setMenuOpen(false)}
          >
            Se connecter
          </Link>
        </nav>
      </div>
    </header>
  )
}
