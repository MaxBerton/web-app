import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getClientRequests } from "@/lib/requests"

export default async function ClientDashboardPage() {
  const supabase = await createClient()
  const [requests, { data: invoicesData }] = await Promise.all([
    getClientRequests(),
    supabase
      .from("invoices")
      .select("id, request_id, amount_cents, currency, status, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
  ])

  const invoices = invoicesData ?? []

  return (
    <main className="grid">
      <section className="card grid">
        <h1>Dashboard client</h1>
        <p>Vue rapide de vos demandes et factures.</p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link className="btn" href="/app/demandes/nouvelle">
            Creer une demande
          </Link>
          <Link className="btn" href="/app/demandes">
            Voir toutes les demandes
          </Link>
          <Link className="btn" href="/app/documents">
            Devis et factures
          </Link>
        </div>
      </section>

      <section className="card grid">
        <h2>Factures emises</h2>
        {invoices.length === 0 ? (
          <p>Aucune facture pour le moment.</p>
        ) : (
          <ul className="grid" style={{ margin: 0, paddingLeft: "1rem" }}>
            {invoices.map((inv) => (
              <li key={inv.id}>
                <Link href={`/app/demandes/${inv.request_id}`}>
                  {(inv.amount_cents / 100).toFixed(2)} {inv.currency.toUpperCase()} - {inv.status}
                </Link>
                {" · "}
                <a href={`/api/invoices/${inv.id}/pdf`} target="_blank" rel="noreferrer">
                  PDF
                </a>
              </li>
            ))}
          </ul>
        )}
        {invoices.length > 0 ? (
          <Link className="btn" href="/app/documents">
            Voir tous les documents
          </Link>
        ) : null}
      </section>

      <section className="card grid">
        <h2>Dernieres demandes</h2>
        {requests.length === 0 ? (
          <p>Aucune demande pour le moment.</p>
        ) : (
          <ul className="grid" style={{ margin: 0, paddingLeft: "1rem" }}>
            {requests.slice(0, 5).map((request) => (
              <li key={request.id}>
                <Link href={`/app/demandes/${request.id}`}>
                  {request.type} - <em>{request.status}</em>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
