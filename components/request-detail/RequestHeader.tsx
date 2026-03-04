import Link from "next/link"
import { getRequestTypeLabel, getRequestNextStepHint } from "@/lib/dashboard"
import { StatusBadge } from "@/components/dashboard/StatusBadge"

type RequestHeaderProps = {
  id: string
  type: string
  status: string
  createdAt: string
  showNewRequestButton?: boolean
}

export function RequestHeader({
  id,
  type,
  status,
  createdAt,
  showNewRequestButton = true,
}: RequestHeaderProps) {
  const shortId = id.slice(0, 8)
  const dateFormatted = new Date(createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <header className="card flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-sm text-dr-tri-muted">
          #{shortId} · Créée le {dateFormatted}
        </p>
        <h1 className="mt-1 text-xl font-bold text-dr-tri-dark">{getRequestTypeLabel(type)}</h1>
        <div className="mt-2">
          <StatusBadge status={status} />
        </div>
        {getRequestNextStepHint(status) && (
          <p className="mt-2 text-sm text-dr-tri-muted">
            {getRequestNextStepHint(status)}
          </p>
        )}
      </div>
      {showNewRequestButton && (
        <Link href="/app/demandes/nouvelle" className="btn shrink-0">
          Nouvelle demande
        </Link>
      )}
    </header>
  )
}
