"use client"

import { inputClass, labelClass, type WizardDetails } from "./wizard-fields"

const TASK_TYPES = [
  { value: "mise_en_place", label: "Mise en place" },
  { value: "montage_simple", label: "Montage simple" },
  { value: "deplacement_lourd", label: "Déplacement lourd" },
  { value: "autre", label: "Autre" },
]

const DURATIONS = [
  { value: "30min", label: "30 min" },
  { value: "1h", label: "1 h" },
  { value: "2h", label: "2 h" },
  { value: "demi-journee", label: "Demi-journée" },
]

type Props = {
  details: WizardDetails
  onChange: (d: WizardDetails) => void
}

function update(details: WizardDetails, key: string, value: unknown): WizardDetails {
  return { ...details, [key]: value }
}

export function StepDetailsInstallation({ details, onChange }: Props) {
  return (
    <div className="grid gap-4">
      <p className="text-sm text-dr-tri-muted">
        Type de tâche et durée estimée.
      </p>

      <label className={labelClass}>
        Type de tâche
        <select
          value={(details.task_type as string) ?? ""}
          onChange={(e) => onChange(update(details, "task_type", e.target.value))}
          className={inputClass}
        >
          <option value="">—</option>
          {TASK_TYPES.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>

      <label className={labelClass}>
        Nombre d&apos;éléments
        <input
          type="number"
          min={1}
          value={(details.items_count as number) ?? ""}
          onChange={(e) => onChange(update(details, "items_count", e.target.value === "" ? undefined : e.target.value))}
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        Durée estimée
        <select
          value={(details.estimated_duration as string) ?? ""}
          onChange={(e) => onChange(update(details, "estimated_duration", e.target.value))}
          className={inputClass}
        >
          <option value="">—</option>
          {DURATIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={(details.requires_tools as boolean) ?? false}
            onChange={(e) => onChange(update(details, "requires_tools", e.target.checked))}
          />
          <span className="text-sm text-dr-tri-dark">Outillage nécessaire</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={(details.requires_wall_fixing as boolean) ?? false}
            onChange={(e) => onChange(update(details, "requires_wall_fixing", e.target.checked))}
          />
          <span className="text-sm text-dr-tri-dark">Fixation murale</span>
        </label>
      </div>

    </div>
  )
}
