import { requireAdmin } from "@/lib/auth"
import { getAdminRecyclingSubscriptions } from "@/lib/recycling"

export default async function AdminRecyclagePage() {
  await requireAdmin()
  const rows = await getAdminRecyclingSubscriptions()

  return (
    <>
      <div className="admin-topbar">
        <div>
          <h1 className="admin-page-title">Recyclage</h1>
          <p className="mt-0.5 text-sm text-[var(--admin-text-muted)]">
            Clients et adresses pour les passages
          </p>
        </div>
        <p className="text-sm text-[var(--admin-text-muted)]">
          {rows.length} abonnement(s)
        </p>
      </div>

      <section className="admin-table-wrap">
        {rows.length === 0 ? (
          <p className="p-4 text-sm text-[var(--admin-text-muted)]">
            Aucun abonnement recyclage actif ou suspendu.
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Adresse de passage</th>
                <th>Prochain passage</th>
                <th>Statut</th>
                <th>Passages / mois</th>
                <th>Bacs</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <span className="font-medium text-[var(--admin-text)]">{row.client_name}</span>
                    {row.client_email && (
                      <span className="block text-xs text-[var(--admin-text-muted)]">
                        {row.client_email}
                      </span>
                    )}
                  </td>
                  <td className="text-[var(--admin-text-muted)] max-w-[280px]">
                    {row.address_display}
                  </td>
                  <td className="whitespace-nowrap text-[var(--admin-text)]">
                    {row.next_pickup_date
                      ? new Date(row.next_pickup_date + "T12:00:00").toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td>
                    <span
                      className={
                        row.status === "active"
                          ? "text-[var(--admin-text)]"
                          : "text-[var(--admin-text-muted)]"
                      }
                    >
                      {row.status === "active" ? "Actif" : "Suspendu"}
                    </span>
                  </td>
                  <td className="text-[var(--admin-text)]">{row.passes_per_month}</td>
                  <td className="text-[var(--admin-text-muted)]">
                    {row.bins_count} p&apos;tits
                    {row.large_bins_count > 0 && `, ${row.large_bins_count} grands`}
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
