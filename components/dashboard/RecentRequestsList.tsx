import Link from "next/link"
import type { RequestRow } from "@/lib/requests"
import { getRequestTypeLabel, getRequestStatusLabel } from "@/lib/dashboard"

type RecentRequestsListProps = {
  requests: RequestRow[]
}

export function RecentRequestsList({ requests }: RecentRequestsListProps) {
  const list = requests.slice(0, 5)

  if (list.length === 0) {
    return null
  }

  return (
    <section aria-labelledby="recent-requests-title">
      <h2 id="recent-requests-title" className="mb-3 text-lg font-semibold text-dr-tri-dark">
        Demandes en cours
      </h2>
      <ul className="grid gap-2" style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {list.map((request) => (
          <li
            key={request.id}
            className="card flex flex-wrap items-center justify-between gap-2"
          >
            <span className="text-sm text-dr-tri-muted">
              {new Date(request.created_at).toLocaleDateString("fr-FR")} •{" "}
              {getRequestTypeLabel(request.type)} • {getRequestStatusLabel(request.status)}
            </span>
            <Link href={`/app/demandes/${request.id}`} className="btn text-sm">
              Voir
            </Link>
          </li>
        ))}
      </ul>
      {requests.length > 5 && (
        <p className="mt-3">
          <Link href="/app/demandes" className="text-dr-tri-primary hover:underline">
            Voir toutes les demandes
          </Link>
        </p>
      )}
    </section>
  )
}
