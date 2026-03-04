import { getRequestStatusLabel } from "@/lib/dashboard"

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-dr-tri-border text-dr-tri-muted",
  submitted: "bg-dr-tri-light-green text-dr-tri-primary",
  need_info: "bg-amber-100 text-amber-800",
  estimating: "bg-dr-tri-light-green text-dr-tri-primary",
  quote_sent: "bg-dr-tri-light-green text-dr-tri-primary",
  accepted: "bg-dr-tri-light-green text-dr-tri-primary",
  scheduled: "bg-dr-tri-light-green text-dr-tri-dark",
  in_progress: "bg-dr-tri-primary/15 text-dr-tri-primary",
  done: "bg-dr-tri-light-green text-dr-tri-primary",
  invoiced: "bg-dr-tri-light-green text-dr-tri-primary",
  paid: "bg-dr-tri-light-green text-dr-tri-primary",
  canceled: "bg-red-100 text-red-800",
}

type StatusBadgeProps = {
  status: string
  className?: string
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const label = getRequestStatusLabel(status)
  const style = STATUS_STYLES[status] ?? "bg-dr-tri-border text-dr-tri-muted"
  return (
    <span
      className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${style} ${className}`}
    >
      {label}
    </span>
  )
}
