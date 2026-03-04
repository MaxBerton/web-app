"use client"

import { inputClass, labelClass, type WizardDetails } from "./wizard-fields"

const SPACE_TYPES = [
  { value: "cave", label: "Cave" },
  { value: "grenier", label: "Grenier" },
  { value: "garage", label: "Garage" },
  { value: "appartement", label: "Appartement" },
  { value: "maison", label: "Maison" },
  { value: "local", label: "Local" },
]

const ITEMS_TYPES = [
  { value: "meubles", label: "Meubles" },
  { value: "cartons", label: "Cartons" },
  { value: "electromenager", label: "Électroménager" },
  { value: "encombrants", label: "Encombrants" },
  { value: "gravats", label: "Gravats" },
  { value: "autre", label: "Autre" },
]

const VOLUME_LEVELS = [
  { value: "S", label: "S" },
  { value: "M", label: "M" },
  { value: "L", label: "L" },
  { value: "XL", label: "XL" },
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

export function StepDetailsDebarras({ details, onChange }: Props) {
  return (
    <div className="grid gap-4">
      <p className="text-sm text-dr-tri-muted">
        Ces informations nous aident à estimer le volume et les conditions d&apos;accès.
      </p>

      <label className={labelClass}>
        Type de lieu
        <select
          value={(details.space_type as string) ?? ""}
          onChange={(e) => onChange(update(details, "space_type", e.target.value))}
          className={inputClass}
        >
          <option value="">—</option>
          {SPACE_TYPES.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>

      <fieldset>
        <legend className="text-sm text-dr-tri-muted mb-2">Types d&apos;objets</legend>
        <div className="flex flex-wrap gap-3">
          {ITEMS_TYPES.map((o) => {
            const arr = (details.items_types as string[]) ?? []
            const checked = arr.includes(o.value)
            return (
              <label key={o.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onChange(toggleArray(details, "items_types", o.value))}
                />
                <span className="text-sm text-dr-tri-dark">{o.label}</span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <label className={labelClass}>
        Volume estimé
        <select
          value={(details.volume_level as string) ?? ""}
          onChange={(e) => onChange(update(details, "volume_level", e.target.value))}
          className={inputClass}
        >
          <option value="">—</option>
          {VOLUME_LEVELS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={(details.disassembly_needed as boolean) ?? false}
          onChange={(e) => onChange(update(details, "disassembly_needed", e.target.checked))}
        />
        <span className="text-sm text-dr-tri-dark">Démontage nécessaire</span>
      </label>
    </div>
  )
}
