import Link from "next/link"

type RequestsPaginationProps = {
  currentPage: number
  totalItems: number
  pageSize: number
  status: string
  service: string
  q: string
}

function buildQuery(params: {
  status: string
  service: string
  q: string
  page: number
}): string {
  const sp = new URLSearchParams()
  if (params.status) sp.set("status", params.status)
  if (params.service) sp.set("service", params.service)
  if (params.q) sp.set("q", params.q)
  if (params.page > 1) sp.set("page", String(params.page))
  const qs = sp.toString()
  return qs ? `?${qs}` : ""
}

export function RequestsPagination({
  currentPage,
  totalItems,
  pageSize,
  status,
  service,
  q,
}: RequestsPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  if (totalPages <= 1) return null

  return (
    <nav
      className="flex flex-wrap items-center justify-between gap-4 border-t border-dr-tri-border pt-4"
      aria-label="Pagination des demandes"
    >
      <p className="text-sm text-dr-tri-muted">
        Page {currentPage} sur {totalPages}
        {totalItems > 0 && (
          <span className="ml-2">
            ({totalItems} demande{totalItems > 1 ? "s" : ""})
          </span>
        )}
      </p>
      <div className="flex gap-2">
        {hasPrev && (
          <Link
            href={`/app/demandes${buildQuery({
              status,
              service,
              q,
              page: currentPage - 1,
            })}`}
            className="btn"
          >
            Précédent
          </Link>
        )}
        {hasNext && (
          <Link
            href={`/app/demandes${buildQuery({
              status,
              service,
              q,
              page: currentPage + 1,
            })}`}
            className="btn"
          >
            Suivant
          </Link>
        )}
      </div>
    </nav>
  )
}
