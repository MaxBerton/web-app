type Appointment = {
  id: string
  scheduled_at: string
  status: string
  notes: string | null
}

type AppointmentCardProps = {
  appointment: Appointment | null
}

const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
  scheduled: "À confirmer",
  in_progress: "En cours",
  completed: "Terminé",
  canceled: "Annulé",
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  if (!appointment) {
    return (
      <section className="card" aria-labelledby="appointment-heading">
        <h2 id="appointment-heading" className="mb-3 text-lg font-semibold text-dr-tri-dark">
          Rendez-vous
        </h2>
        <p className="text-sm text-dr-tri-muted">Aucun rendez-vous planifié pour l&apos;instant.</p>
      </section>
    )
  }

  const statusLabel = APPOINTMENT_STATUS_LABELS[appointment.status] ?? appointment.status
  const isConfirmed = ["in_progress", "completed"].includes(appointment.status)

  return (
    <section className="card" aria-labelledby="appointment-heading">
      <h2 id="appointment-heading" className="mb-3 text-lg font-semibold text-dr-tri-dark">
        Rendez-vous
      </h2>
      <div className="grid gap-2 text-sm">
        <p className="text-dr-tri-dark">
          <strong>Date et heure</strong> ·{" "}
          {new Date(appointment.scheduled_at).toLocaleString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <p className="text-dr-tri-muted">
          Statut : <span className={isConfirmed ? "text-dr-tri-primary" : "text-dr-tri-dark"}>{statusLabel}</span>
        </p>
        {appointment.notes && (
          <p className="mt-2 text-dr-tri-muted">
            <strong>Notes</strong> · {appointment.notes}
          </p>
        )}
      </div>
    </section>
  )
}
