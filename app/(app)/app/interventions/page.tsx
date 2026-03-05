import Link from "next/link"
import { requireUser } from "@/lib/auth"
import { getClientAppointments } from "@/lib/interventions"
import { getRequestTypeLabel } from "@/lib/dashboard"

const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
  scheduled: "Planifié",
  in_progress: "En cours",
  completed: "Terminé",
  cancelled: "Annulé",
}

const APPOINTMENT_STATUS_COLORS: Record<string, string> = {
  scheduled: "bg-blue-50 text-blue-700 border-blue-200",
  in_progress: "bg-amber-50 text-amber-700 border-amber-200",
  completed: "bg-dr-tri-light-green text-dr-tri-primary border-dr-tri-border",
  cancelled: "bg-red-50 text-red-700 border-red-200",
}

export default async function InterventionsPage() {
  await requireUser()
  const appointments = await getClientAppointments()

  const now = new Date()
  const upcoming = appointments.filter((a) => new Date(a.scheduled_at) >= now && a.status !== "cancelled")
  const past = appointments.filter((a) => new Date(a.scheduled_at) < now || a.status === "completed" || a.status === "cancelled")

  return (
    <main className="grid gap-6">
      <header className="border-b border-dr-tri-border pb-4">
        <h1 className="text-xl font-bold text-dr-tri-dark">Mes interventions</h1>
        <p className="mt-1 text-sm text-dr-tri-muted">Historique et prochains passages planifiés</p>
      </header>

      {appointments.length === 0 ? (
        <div className="card grid gap-3 text-center py-10">
          <p className="text-lg font-semibold text-dr-tri-dark">Aucune intervention planifiée</p>
          <p className="text-sm text-dr-tri-muted">
            Créez une demande pour planifier votre première intervention.
          </p>
          <Link href="/app/demandes/nouvelle" className="btn mx-auto w-fit">
            Créer une demande
          </Link>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <section aria-labelledby="upcoming-title">
              <h2 id="upcoming-title" className="mb-3 text-base font-semibold text-dr-tri-dark">
                À venir ({upcoming.length})
              </h2>
              <div className="grid gap-3">
                {upcoming.map((apt) => (
                  <AppointmentCard key={apt.id} appointment={apt} isUpcoming />
                ))}
              </div>
            </section>
          )}

          {past.length > 0 && (
            <section aria-labelledby="past-title">
              <h2 id="past-title" className="mb-3 text-base font-semibold text-dr-tri-dark">
                Passées ({past.length})
              </h2>
              <div className="grid gap-3">
                {past.map((apt) => (
                  <AppointmentCard key={apt.id} appointment={apt} isUpcoming={false} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  )
}

function AppointmentCard({ appointment: a, isUpcoming }: { appointment: ReturnType<typeof Object.create>; isUpcoming: boolean }) {
  const date = new Date(a.scheduled_at)
  const statusLabel = APPOINTMENT_STATUS_LABELS[a.status] ?? a.status
  const statusColor = APPOINTMENT_STATUS_COLORS[a.status] ?? "bg-gray-50 text-gray-700 border-gray-200"

  return (
    <article className={`card flex flex-wrap items-start gap-4 ${!isUpcoming ? "opacity-75" : ""}`}>
      <div className="flex min-w-[6rem] flex-col items-center rounded-dr-tri bg-dr-tri-light-green px-3 py-2 text-center">
        <span className="text-xs font-medium uppercase tracking-wide text-dr-tri-muted">
          {date.toLocaleDateString("fr-FR", { weekday: "short" })}
        </span>
        <span className="text-2xl font-bold text-dr-tri-primary leading-none">
          {date.getDate()}
        </span>
        <span className="text-xs font-medium text-dr-tri-muted">
          {date.toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}
        </span>
        <span className="mt-1 text-xs text-dr-tri-muted">
          {date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-base font-semibold text-dr-tri-dark">
            {getRequestTypeLabel(a.request_type)}
          </span>
          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColor}`}>
            {statusLabel}
          </span>
        </div>
        {a.request_description && (
          <p className="text-sm text-dr-tri-muted line-clamp-2">{a.request_description}</p>
        )}
        {a.notes && (
          <p className="text-xs text-dr-tri-muted italic">{a.notes}</p>
        )}
        <Link
          href={`/app/demandes/${a.request_id}`}
          className="mt-1 text-xs font-medium text-dr-tri-primary hover:underline w-fit"
        >
          Voir la demande →
        </Link>
      </div>
    </article>
  )
}
