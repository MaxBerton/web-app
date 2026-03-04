"use client"

import { inputClass, labelClass, type WizardDetails } from "./wizard-fields"

const MATERIALS = [
  { value: "papier_carton", label: "Papier / carton" },
  { value: "verre", label: "Verre" },
  { value: "pet", label: "PET" },
  { value: "plastique", label: "Plastique" },
  { value: "alu_fer", label: "Alu / fer" },
]

type Props = {
  details: WizardDetails
  onChange: (d: WizardDetails) => void
}

function update(details: WizardDetails, key: string, value: unknown): WizardDetails {
  return { ...details, [key]: value }
}

function toggleArray(details: WizardDetails, key: string, value: string): WizardDetails {
  const arr = ((details[key] as string[]) || []).slice()
  const i = arr.indexOf(value)
  if (i >= 0) arr.splice(i, 1)
  else arr.push(value)
  return { ...details, [key]: arr }
}

export function StepDetailsRecyclage({ details, onChange }: Props) {
  const isSubscription = (details.is_subscription as boolean) ?? false

  return (
    <div className="grid gap-4">
      <p className="text-sm text-dr-tri-muted">
        Abonnement ou passage ponctuel, et types de matériaux.
      </p>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={isSubscription}
          onChange={(e) => onChange(update(details, "is_subscription", e.target.checked))}
        />
        <span className="text-sm text-dr-tri-dark">Je souhaite un abonnement (passages réguliers)</span>
      </label>

      {isSubscription && (
        <>
          <label className={labelClass}>
            Fréquence (passages par mois)
            <input
              type="number"
              min={1}
              max={4}
              value={(details.frequency as number) ?? ""}
              onChange={(e) => onChange(update(details, "frequency", e.target.value === "" ? undefined : parseInt(e.target.value, 10)))}
              placeholder="1 à 4"
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Nombre de bacs (défaut 6)
            <input
              type="number"
              min={1}
              value={(details.bins_count as number) ?? 6}
              onChange={(e) => onChange(update(details, "bins_count", e.target.value === "" ? 6 : parseInt(e.target.value, 10)))}
              className={inputClass}
            />
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={(details.needs_bin_swap as boolean) ?? false}
              onChange={(e) => onChange(update(details, "needs_bin_swap", e.target.checked))}
            />
            <span className="text-sm text-dr-tri-dark">Échange de bacs nécessaire</span>
          </label>
        </>
      )}

      <fieldset>
        <legend className="text-sm text-dr-tri-muted mb-2">Matériaux concernés</legend>
        <div className="flex flex-wrap gap-3">
          {MATERIALS.map((o) => {
            const arr = (details.materials as string[]) ?? []
            const checked = arr.includes(o.value)
            return (
              <label key={o.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onChange(toggleArray(details, "materials", o.value))}
                />
                <span className="text-sm text-dr-tri-dark">{o.label}</span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <label className={labelClass}>
        Où sont situés les bacs ?
        <input
          type="text"
          value={(details.storage_location as string) ?? ""}
          onChange={(e) => onChange(update(details, "storage_location", e.target.value))}
          placeholder="Ex. Cave, entrée immeuble"
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        Jours préférés pour l&apos;accès
        <input
          type="text"
          value={(details.access_day_preference as string) ?? ""}
          onChange={(e) => onChange(update(details, "access_day_preference", e.target.value))}
          placeholder="Ex. Lundi, mercredi"
          className={inputClass}
        />
      </label>
    </div>
  )
}
