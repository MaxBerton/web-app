import { requireAdmin } from "@/lib/auth"
import { signOutAction } from "@/app/actions/auth"
import { Logo } from "@/components/Logo"
import { AdminNav } from "@/components/admin/AdminNav"

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireAdmin()

  return (
    <div className="admin-dr flex min-h-screen bg-[var(--admin-bg)] text-[var(--admin-text)]">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <Logo href="/admin" size="sm" showText={false} direction="row" />
        </div>
        <AdminNav />
        <div className="flex-1" />
        <div className="border-t border-[var(--admin-card-border)] pt-3 px-3">
          <form action={signOutAction}>
            <button className="btn w-full justify-center text-sm" type="submit">
              Déconnexion
            </button>
          </form>
        </div>
      </aside>
      <div className="admin-main">
        {children}
      </div>
    </div>
  )
}
