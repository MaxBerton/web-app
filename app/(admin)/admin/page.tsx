import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const [{ count: requestsCount }, { count: activeSubscriptions }] = await Promise.all([
    supabase.from("requests").select("*", { count: "exact", head: true }),
    supabase.from("subscriptions").select("*", { count: "exact", head: true }).eq("status", "active"),
  ])

  return (
    <main className="grid">
      <section className="card grid">
        <h1>Dashboard administrateur</h1>
        <p>Pilotage rapide du pipeline V1.</p>
      </section>

      <section className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <article className="card grid">
          <h2>Demandes</h2>
          <strong>{requestsCount ?? 0}</strong>
          <Link className="btn" href="/admin/demandes">
            Ouvrir le pipeline
          </Link>
        </article>

        <article className="card grid">
          <h2>Abonnements actifs</h2>
          <strong>{activeSubscriptions ?? 0}</strong>
        </article>
      </section>
    </main>
  )
}
