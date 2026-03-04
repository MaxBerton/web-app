"use client"

import { inputClass, labelClass, type WizardDetails } from "./wizard-fields"

const CATEGORIES = [
  { value: "demenagement", label: "Déménagement" },
  { value: "stockage", label: "Stockage" },
  { value: "nettoyage", label: "Nettoyage" },
  { value: "autre", label: "Autre" },
]

type Props = {
  details: WizardDetails
  onChange: (d: WizardDetails) => void
}

function update(details: WizardDetails, key: string, value: unknown): WizardDetails {
  return { ...details, [key]: value }
}

export function StepDetailsOther({ details, onChange }: Props) {
  return (
    <div className="grid gap-4">
      <p className="text-sm text-dr-tri-muted">
        Précisez votre besoin pour que nous puissions vous recontacter.
      </p>

      <label className={labelClass}>
        Catégorie
        <select
          value={(details.category as string) ?? ""}
          onChange={(e) => onChange(update(details, "category", e.target.value))}
          className={inputClass}
        >
          <option value="">—</option>
          {CATEGORIES.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>

      <label className={labelClass}>
        Contraintes ou précisions
        <textarea
          rows={4}
          value={(details.constraints as string) ?? ""}
          onChange={(e) => onChange(update(details, "constraints", e.target.value))}
          placeholder="Décrivez votre situation et vos contraintes..."
          className={inputClass}
        />
      </label>
    </div>
  )
}
