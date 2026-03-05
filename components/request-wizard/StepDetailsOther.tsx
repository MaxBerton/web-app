"use client"

import { inputClass, labelClass, type WizardDetails } from "./wizard-fields"

// Types de prestation — Jardin & travaux
const TYPE_PRESTATION = [
  { value: "jardin", label: "Jardin / extérieur", hint: "Tonte, taille, entretien jardin, terrasse" },
  { value: "bricolage", label: "Bricolage / petits travaux", hint: "Montage, réparation, peinture, petites installations" },
  { value: "entretien", label: "Entretien intérieur", hint: "Petits travaux à domicile, dépannage" },
  { value: "autre", label: "Autre", hint: "À préciser dans la description" },
]

// Détail selon le type (Jardin)
const SOUS_TYPES_JARDIN = [
  { value: "tonte", label: "Tonte pelouse" },
  { value: "taille_haies", label: "Taille haies / arbustes" },
  { value: "entretien_massifs", label: "Entretien massifs / jardin" },
  { value: "terrassement", label: "Terrassement / aménagement" },
  { value: "autre", label: "Autre (à préciser)" },
]

// Détail selon le type (Bricolage)
const SOUS_TYPES_BRICOLAGE = [
  { value: "montage", label: "Montage meuble / équipement" },
  { value: "peinture", label: "Peinture" },
  { value: "reparations", label: "Petites réparations" },
  { value: "installation", label: "Installation (étagères, tringles, etc.)" },
  { value: "autre", label: "Autre (à préciser)" },
]

const FREQUENCE = [
  { value: "ponctuel", label: "Ponctuel — une fois" },
  { value: "recurrent", label: "Récurrent — régulier" },
]

type Props = {
  details: WizardDetails
  onChange: (d: WizardDetails) => void
}

function update(details: WizardDetails, key: string, value: unknown): WizardDetails {
  return { ...details, [key]: value }
}

export function StepDetailsOther({ details, onChange }: Props) {
  const category = (details.category as string) ?? ""

  const handleCategoryChange = (value: string) => {
    onChange(update(update(details, "category", value), "subcategory", ""))
  }

  const showSubcategory = category === "jardin" || category === "bricolage"
  const subOptions = category === "jardin" ? SOUS_TYPES_JARDIN : category === "bricolage" ? SOUS_TYPES_BRICOLAGE : []

  return (
    <div className="grid gap-4">
      <p className="text-sm text-dr-tri-muted">
        Précisez votre besoin pour que nous puissions vous établir un devis.
      </p>

      <label className={labelClass}>
        Type de prestation <span className="text-red-500">*</span>
        <select
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className={inputClass}
        >
          <option value="">— Choisir —</option>
          {TYPE_PRESTATION.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {TYPE_PRESTATION.find((t) => t.value === category)?.hint && (
          <span className="mt-1 block text-xs text-dr-tri-muted">
            {TYPE_PRESTATION.find((t) => t.value === category)?.hint}
          </span>
        )}
      </label>

      {showSubcategory && (
        <label className={labelClass}>
          Détail de la prestation
          <select
            value={(details.subcategory as string) ?? ""}
            onChange={(e) => onChange(update(details, "subcategory", e.target.value))}
            className={inputClass}
          >
            <option value="">— Choisir —</option>
            {subOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      )}

      <label className={labelClass}>
        Surface ou indication (optionnel)
        <input
          type="text"
          value={(details.surface_or_hint as string) ?? ""}
          onChange={(e) => onChange(update(details, "surface_or_hint", e.target.value))}
          placeholder="Ex. 150 m², 2h, demi-journée"
          className={inputClass}
        />
      </label>

      {category === "jardin" && (
        <label className={labelClass}>
          Fréquence
          <select
            value={(details.frequency as string) ?? ""}
            onChange={(e) => onChange(update(details, "frequency", e.target.value))}
            className={inputClass}
          >
            <option value="">— Choisir —</option>
            {FREQUENCE.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      )}

      <label className={labelClass}>
        Description / contraintes
        <textarea
          rows={4}
          value={(details.constraints as string) ?? ""}
          onChange={(e) => onChange(update(details, "constraints", e.target.value))}
          placeholder="Précisions, accès, contraintes, horaires souhaités..."
          className={inputClass}
        />
      </label>
    </div>
  )
}
