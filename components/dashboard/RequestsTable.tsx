import Link from "next/link"
import type { RequestWithAddress } from "@/lib/requests"
import { getRequestTypeLabel } from "@/lib/dashboard"
import { StatusBadge } from "./StatusBadge"

type RequestsTableProps = {
  requests: RequestWithAddress[]
}

function formatAddress(addr: RequestWithAddress["addresses"]): string {
  if (!addr) return "—"
  const parts = [addr.street, [addr.postal_code, addr.city].filter(Boolean).join(" ")].filter(
    Boolean
  )
  return parts.length ? parts.join(", ") : "—"
}

export function RequestsTable({ requests }: RequestsTableProps) {
  return (
    <div className="card overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-dr-tri-border text-dr-tri-muted">
            <th className="pb-2 pr-4 pt-0 font-medium">Date</th>
            <th className="pb-2 pr-4 pt-0 font-medium">Service</th>
            <th className="pb-2 pr-4 pt-0 font-medium">Adresse</th>
            <th className="pb-2 pr-4 pt-0 font-medium">Statut</th>
            <th className="pb-2 pl-4 pt-0 text-right font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id} className="border-b border-dr-tri-border/50">
              <td className="py-3 pr-4 text-dr-tri-dark">
                {new Date(request.created_at).toLocaleDateString("fr-FR")}
              </td>
              <td className="py-3 pr-4 text-dr-tri-dark">
                {getRequestTypeLabel(request.type)}
              </td>
              <td className="max-w-[200px] truncate py-3 pr-4 text-dr-tri-muted">
                {formatAddress(request.addresses)}
              </td>
              <td className="py-3 pr-4">
                <StatusBadge status={request.status} />
              </td>
              <td className="py-3 pl-4 text-right">
                <Link href={`/app/demandes/${request.id}`} className="btn text-sm">
                  Voir
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
