import { createServiceRoleClient } from "@/lib/supabase/server"

/** Statuts considérés comme "demandes en cours" (non terminées / non annulées) */
const STATUS_EN_COURS = [
  "draft",
  "submitted",
  "need_info",
  "estimating",
  "quote_sent",
  "accepted",
  "scheduled",
  "in_progress",
]

export default async function AdminDashboardPage() {
  const supabase = createServiceRoleClient()
  const [
    { count: requestsEnCours },
    { count: activeSubscriptions },
    { count: comptesEnregistres },
  ] = await Promise.all([
    supabase
      .from("requests")
      .select("*", { count: "exact", head: true })
      .in("status", STATUS_EN_COURS),
    supabase.from("subscriptions").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).neq("role", "admin"),
  ])

  return (
    <>
      <div className="admin-topbar">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="mt-0.5 text-sm text-[var(--admin-text-muted)]">Vue d&apos;ensemble du backoffice</p>
        </div>
      </div>

      <div className="admin-stats-row">
        <div className="admin-stat-card">
          <div className="admin-stat-label">Demandes en cours</div>
          <div className="admin-stat-value">{requestsEnCours ?? 0}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Abonnements actifs</div>
          <div className="admin-stat-value">{activeSubscriptions ?? 0}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Comptes enregistrés</div>
          <div className="admin-stat-value">{comptesEnregistres ?? 0}</div>
        </div>
      </div>
    </>
  )
}
