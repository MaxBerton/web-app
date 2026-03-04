import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getRequestStatusLabel } from "@/lib/dashboard"
import { REQUEST_STATUSES } from "@/lib/types"
import { updateRequestStatusAction } from "./actions"

type AdminRequestsPageProps = {
  searchParams: Promise<{ status?: string }>
}

export default async function AdminRequestsPage({ searchParams }: AdminRequestsPageProps) {
  const { status } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from("requests")
    .select("id, type, status, description, created_at")
    .order("created_at", { ascending: false })

  if (status) {
    query = query.eq("status", status)
  }

  const { data: requests } = await query

  return (
    <main className="grid">
      <section className="card grid">
        <h1>Pipeline des demandes</h1>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <Link className="btn" href="/admin/demandes">
            Tous
          </Link>
          {REQUEST_STATUSES.map((value) => (
            <Link key={value} className="btn" href={`/admin/demandes?status=${value}`}>
              {value}
            </Link>
          ))}
        </div>
      </section>

      <section className="card grid">
        {!requests?.length ? (
          <p>Empty state: aucune demande sur ce filtre.</p>
        ) : (
          requests.map((request) => (
            <article key={request.id} className="card grid">
              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem" }}>
                <div className="grid" style={{ gap: "0.2rem" }}>
                  <strong>{request.type}</strong>
                  <small>{new Date(request.created_at).toLocaleString("fr-FR")}</small>
                </div>
                <Link className="btn" href={`/admin/demandes/${request.id}`}>
                  Ouvrir
                </Link>
              </div>

              <p>{request.description ?? "Sans description."}</p>

              <form action={updateRequestStatusAction} style={{ display: "flex", gap: "0.5rem" }}>
                <input type="hidden" name="request_id" value={request.id} />
                <select name="status" defaultValue={request.status}>
                  {REQUEST_STATUSES.map((value) => (
                    <option key={value} value={value}>
                      {getRequestStatusLabel(value)}
                    </option>
                  ))}
                </select>
                <button className="btn" type="submit">
                  Changer statut
                </button>
              </form>
            </article>
          ))
        )}
      </section>
    </main>
  )
}
