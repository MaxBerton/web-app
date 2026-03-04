import Link from "next/link"
import { getClientRequests } from "@/lib/requests"

export default async function ClientRequestsPage() {
  const requests = await getClientRequests()

  return (
    <main className="card grid">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Mes demandes</h1>
        <Link className="btn" href="/app/demandes/nouvelle">
          Nouvelle demande
        </Link>
      </div>

      {requests.length === 0 ? (
        <p>Empty state: vous n'avez aucune demande pour le moment.</p>
      ) : (
        <div className="grid">
          {requests.map((request) => (
            <Link key={request.id} className="card" href={`/app/demandes/${request.id}`}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{request.type}</strong>
                <span>{request.status}</span>
              </div>
              <small>{new Date(request.created_at).toLocaleString("fr-FR")}</small>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
