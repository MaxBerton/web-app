import Link from "next/link"
import { getClientRequests } from "@/lib/requests"

export default async function ClientDashboardPage() {
  const requests = await getClientRequests()

  return (
    <main className="grid">
      <section className="card grid">
        <h1>Dashboard client</h1>
        <p>Vue rapide de vos demandes en cours.</p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link className="btn" href="/app/demandes/nouvelle">
            Creer une demande
          </Link>
          <Link className="btn" href="/app/demandes">
            Voir toutes les demandes
          </Link>
        </div>
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
