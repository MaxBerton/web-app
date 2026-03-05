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
    <>
      <div className="admin-topbar">
        <div>
          <h1 className="admin-page-title">Demandes</h1>
          <p className="mt-0.5 text-sm text-[var(--admin-text-muted)]">
            Pipeline des demandes clients
          </p>
        </div>
        <p className="text-sm text-[var(--admin-text-muted)]">
          {requests?.length ?? 0} résultat(s)
        </p>
      </div>

      <div className="admin-filter-bar">
        <Link href="/admin/demandes" className={`admin-chip ${!status ? "admin-chip-active" : ""}`}>
          Tous
        </Link>
        {REQUEST_STATUSES.map((value) => (
          <Link
            key={value}
            href={`/admin/demandes?status=${value}`}
            className={`admin-chip ${status === value ? "admin-chip-active" : ""}`}
          >
            {getRequestStatusLabel(value)}
          </Link>
        ))}
      </div>

      <section className="admin-table-wrap">
        {!requests?.length ? (
          <p className="p-4 text-sm text-[var(--admin-text-muted)]">
            Aucune demande trouvée pour ce filtre.
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Service</th>
                <th>Statut</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td className="whitespace-nowrap text-[var(--admin-text-muted)]">
                    {new Date(request.created_at).toLocaleString("fr-FR")}
                  </td>
                  <td className="font-medium text-[var(--admin-text)]">{request.type}</td>
                  <td className="text-[var(--admin-text)]">{getRequestStatusLabel(request.status)}</td>
                  <td className="max-w-[420px] truncate text-[var(--admin-text-muted)]">
                    {request.description ?? "Sans description."}
                  </td>
                  <td>
                    <div className="admin-inline-form">
                      <Link className="btn !py-1.5 !text-sm" href={`/admin/demandes/${request.id}`}>
                        Ouvrir
                      </Link>
                      <form action={updateRequestStatusAction} className="admin-inline-form">
                        <input type="hidden" name="request_id" value={request.id} />
                        <select className="admin-select" name="status" defaultValue={request.status}>
                          {REQUEST_STATUSES.map((value) => (
                            <option key={value} value={value}>
                              {getRequestStatusLabel(value)}
                            </option>
                          ))}
                        </select>
                        <button className="btn !py-1.5 !text-sm" type="submit">
                          Mettre à jour
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  )
}
