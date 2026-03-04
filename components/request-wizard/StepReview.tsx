"use client"

import type { WizardDetails } from "./wizard-fields"

const SERVICE_LABELS: Record<string, string> = {
  clearance: "Débarras",
  transport: "Transport & livraison",
  moving: "Installation / manutention",
  recycling: "Recyclage à domicile",
  other: "Autre",
}

type StepReviewProps = {
  serviceType: string
  description: string
  street: string
  postalCode: string
  city: string
  preferredDates: string[]
  accessNotes: string
  details: WizardDetails
}

function formatAddress(street: string, postalCode: string, city: string): string {
  const parts = [street, [postalCode, city].filter(Boolean).join(" ")].filter(Boolean)
  return parts.length ? parts.join(", ") : "—"
}

function DetailsSummary({ details, serviceType }: { details: WizardDetails; serviceType: string }) {
  const entries = Object.entries(details).filter(([, v]) => v !== undefined && v !== "" && (Array.isArray(v) ? v.length > 0 : true))
  if (entries.length === 0) return <p className="text-sm text-dr-tri-muted">—</p>
  return (
    <ul className="list-disc pl-4 text-sm text-dr-tri-dark space-y-1">
      {entries.map(([key, value]) => (
        <li key={key}>
          <span className="text-dr-tri-muted">{key.replace(/_/g, " ")} : </span>
          {Array.isArray(value) ? value.join(", ") : String(value)}
        </li>
      ))}
    </ul>
  )
}

export function StepReview({
  serviceType,
  description,
  street,
  postalCode,
  city,
  preferredDates,
  accessNotes,
  details,
}: StepReviewProps) {
  return (
    <div className="grid gap-4">
      <p className="text-sm text-dr-tri-muted">
        Vérifiez les informations avant envoi.
      </p>

      <div className="rounded-lg border border-dr-tri-border bg-dr-tri-background p-4 space-y-3">
        <div>
          <p className="text-xs font-medium text-dr-tri-muted">Service</p>
          <p className="font-medium text-dr-tri-dark">{SERVICE_LABELS[serviceType] ?? serviceType}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-dr-tri-muted">Description</p>
          <p className="text-dr-tri-dark whitespace-pre-wrap">{description || "—"}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-dr-tri-muted">Détails (étape 2)</p>
          <DetailsSummary details={details} serviceType={serviceType} />
        </div>
        <div>
          <p className="text-xs font-medium text-dr-tri-muted">Lieu</p>
          <p className="text-dr-tri-dark">{formatAddress(street, postalCode, city)}</p>
          {preferredDates.length > 0 && (
            <p className="text-sm text-dr-tri-muted mt-1">
              Dates de RDV souhaitées : {preferredDates.map((d) => new Date(d).toLocaleDateString("fr-FR")).join(", ")}
            </p>
          )}
          {accessNotes && (
            <p className="text-sm text-dr-tri-muted mt-1">Accès : {accessNotes}</p>
          )}
        </div>
      </div>
    </div>
  )
}
