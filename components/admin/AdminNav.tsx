"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/demandes", label: "Demandes" },
  { href: "/admin/recyclage", label: "Recyclage" },
  { href: "/admin/services", label: "Configuration" },
] as const

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="admin-nav" aria-label="Navigation backoffice">
      {items.map(({ href, label }) => {
        const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={`admin-nav-item ${isActive ? "admin-nav-item-active" : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
