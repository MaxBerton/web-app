import type { DashboardCounts } from "@/lib/dashboard"

type KpiCardsProps = DashboardCounts & {
  nextAppointment: { scheduled_at: string; request_id: string } | null
}

export function KpiCards({ enCours, terminees, nextAppointment }: KpiCardsProps) {
  const nextLabel = nextAppointment
    ? new Date(nextAppointment.scheduled_at).toLocaleDateString("fr-FR", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—"

  return (
    <section className="grid gap-4 sm:grid-cols-3" aria-label="Indicateurs">
      <div className="card">
        <p className="text-sm text-dr-tri-muted">Demandes en cours</p>
        <p className="text-2xl font-bold text-dr-tri-dark">{enCours}</p>
      </div>
      <div className="card">
        <p className="text-sm text-dr-tri-muted">Demandes terminées</p>
        <p className="text-2xl font-bold text-dr-tri-dark">{terminees}</p>
      </div>
      <div className="card">
        <p className="text-sm text-dr-tri-muted">Prochain rendez-vous</p>
        <p className="text-lg font-semibold text-dr-tri-dark">{nextLabel}</p>
      </div>
    </section>
  )
}
