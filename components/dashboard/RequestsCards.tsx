import Link from "next/link"
import type { RequestWithAddress } from "@/lib/requests"
import { getRequestTypeLabel } from "@/lib/dashboard"
import { StatusBadge } from "./StatusBadge"

type RequestsCardsProps = {
  requests: RequestWithAddress[]
}

function formatAddress(addr: RequestWithAddress["addresses"]): string {
  if (!addr) return "—"
  const parts = [addr.street, [addr.postal_code, addr.city].filter(Boolean).join(" ")].filter(
    Boolean
  )
  return parts.length ? parts.join(", ") : "—"
}

export function RequestsCards({ requests }: RequestsCardsProps) {
  return (
    <ul className="grid gap-3" style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {requests.map((request) => (
        <li key={request.id} className="card grid gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm text-dr-tri-muted">
              {new Date(request.created_at).toLocaleDateString("fr-FR")}
            </span>
            <StatusBadge status={request.status} />
          </div>
          <p className="font-medium text-dr-tri-dark">{getRequestTypeLabel(request.type)}</p>
          <p className="truncate text-sm text-dr-tri-muted">{formatAddress(request.addresses)}</p>
          <Link href={`/app/demandes/${request.id}`} className="btn mt-1 w-fit text-sm">
            Voir
          </Link>
        </li>
      ))}
    </ul>
  )
}
