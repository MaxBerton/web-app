import type { DetailEntry } from "@/lib/request-details-labels"

type RequestDetailsCardProps = {
  description: string | null
  address: { street: string | null; postal_code: string | null; city: string | null } | null
  requestedDates: string[] | null
  accessConstraints: string | null
  /** Détails complémentaires (payload : type de lieu, volume, étage, etc.) */
  detailEntries?: DetailEntry[]
}

function formatAddress(addr: RequestDetailsCardProps["address"]): string {
  if (!addr) return "—"
  const parts = [addr.street, [addr.postal_code, addr.city].filter(Boolean).join(" ")].filter(
    Boolean
  )
  return parts.length ? parts.join(", ") : "—"
}

export function RequestDetailsCard({
  description,
  address,
  requestedDates,
  accessConstraints,
  detailEntries = [],
}: RequestDetailsCardProps) {
  const hasDates = requestedDates && requestedDates.length > 0
  return (
    <section className="card" aria-labelledby="details-heading">
      <h2 id="details-heading" className="mb-3 text-lg font-semibold text-dr-tri-dark">
        Détails de la demande
      </h2>
      <div className="grid gap-3 text-sm">
        <div>
          <p className="text-dr-tri-muted">Description</p>
          <p className="mt-0.5 text-dr-tri-dark whitespace-pre-wrap">{description?.trim() || "—"}</p>
        </div>
        <div>
          <p className="text-dr-tri-muted">Adresse d&apos;intervention</p>
          <p className="mt-0.5 text-dr-tri-dark">{formatAddress(address)}</p>
        </div>
        {hasDates && (
          <div>
            <p className="text-dr-tri-muted">Dates pour le passage</p>
            <ul className="mt-0.5 list-inside list-disc text-dr-tri-dark space-y-0.5">
              {requestedDates!.map((d) => (
                <li key={d}>
                  {new Date(d).toLocaleDateString("fr-FR", {
                    weekday: "short",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </li>
              ))}
            </ul>
          </div>
        )}
        {accessConstraints && (
          <div>
            <p className="text-dr-tri-muted">Notes d&apos;accès (code, digicode…)</p>
            <p className="mt-0.5 text-dr-tri-dark whitespace-pre-wrap">{accessConstraints}</p>
          </div>
        )}
        {detailEntries.length > 0 && (
          <div className="border-t border-dr-tri-border pt-3 mt-1">
            <p className="text-dr-tri-muted mb-2">Informations complémentaires</p>
            <ul className="grid gap-2" style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {detailEntries.map(({ label, value }) => (
                <li key={label} className="flex flex-wrap gap-x-2">
                  <span className="text-dr-tri-muted shrink-0">{label}</span>
                  <span className="text-dr-tri-dark">{value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
