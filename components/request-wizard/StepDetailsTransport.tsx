"use client"

import { inputClass, labelClass, type WizardDetails } from "./wizard-fields"

const TRANSPORT_TYPES = [
  { value: "livraison", label: "Livraison" },
  { value: "retrait", label: "Retrait (magasin, entrepôt…)" },
  { value: "transport", label: "Transport (déplacement A → B)" },
]

const OBJECT_TYPES = [
  { value: "meubles", label: "Meubles" },
  { value: "electromenager", label: "Électroménager" },
  { value: "colis", label: "Colis / cartons" },
  { value: "palette", label: "Palette(s)" },
  { value: "autre", label: "Autre" },
]

const WEIGHT_CATEGORIES = [
  { value: "leger", label: "Léger" },
  { value: "moyen", label: "Moyen" },
  { value: "lourd", label: "Lourd" },
]

const TIME_WINDOWS = [
  { value: "matin", label: "Matin" },
  { value: "apres-midi", label: "Après-midi" },
  { value: "soir", label: "Soir" },
]

type Props = {
  details: WizardDetails
  onChange: (d: WizardDetails) => void
}

function update(details: WizardDetails, key: string, value: unknown): WizardDetails {
  return { ...details, [key]: value }
}

export function StepDetailsTransport({ details, onChange }: Props) {
  const transportType = (details.transport_type as string) || ""

  return (
    <div className="grid gap-6">
      <p className="text-sm text-dr-tri-muted">
        Précisez le type de prestation, les objets à déplacer et les adresses.
      </p>

      {/* Choix de la prestation */}
      <label className={labelClass}>
        Type de prestation
        <select
          value={transportType}
          onChange={(e) => onChange(update(details, "transport_type", e.target.value))}
          className={inputClass}
        >
          <option value="">— Choisir —</option>
          {TRANSPORT_TYPES.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>

      {/* 1. Type d'objet à déplacer (affiché dès qu'une prestation est choisie) */}
      {transportType && (
        <fieldset className="grid gap-4 rounded-lg border border-dr-tri-border bg-dr-tri-background p-4">
          <legend className="text-sm font-medium text-dr-tri-dark">
            1. Type d&apos;objet à déplacer
          </legend>
          <label className={labelClass}>
            Type d&apos;objet
            <select
              value={(details.object_type as string) ?? ""}
              onChange={(e) => onChange(update(details, "object_type", e.target.value))}
              className={inputClass}
            >
              <option value="">—</option>
              {OBJECT_TYPES.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            Nombre d&apos;objets / colis
            <input
              type="number"
              min={1}
              value={(details.items_count as number) ?? ""}
              onChange={(e) => onChange(update(details, "items_count", e.target.value === "" ? undefined : e.target.value))}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Dimensions du plus gros objet (L x l x h en cm, optionnel)
            <input
              type="text"
              value={(details.largest_item_dimensions as string) ?? ""}
              onChange={(e) => onChange(update(details, "largest_item_dimensions", e.target.value))}
              placeholder="Ex. 200 x 80 x 50"
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Catégorie de poids
            <select
              value={(details.weight_category as string) ?? ""}
              onChange={(e) => onChange(update(details, "weight_category", e.target.value))}
              className={inputClass}
            >
              <option value="">—</option>
              {WEIGHT_CATEGORIES.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
        </fieldset>
      )}

      {/* 2. Lieu de départ (pour livraison = prise en charge ; pour retrait = lieu de retrait) */}
      {transportType && (
        <fieldset className="grid gap-4 rounded-lg border border-dr-tri-border bg-dr-tri-background p-4">
          <legend className="text-sm font-medium text-dr-tri-dark">
            2. Lieu de départ
          </legend>
          <label className={labelClass}>
            Adresse de prise en charge
            <input
              type="text"
              value={(details.pickup_address as string) ?? ""}
              onChange={(e) => onChange(update(details, "pickup_address", e.target.value))}
              placeholder="Ex. Avenue de la Gare 10, Lausanne"
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Escaliers
            <input
              type="text"
              value={(details.stairs_pickup as string) ?? ""}
              onChange={(e) => onChange(update(details, "stairs_pickup", e.target.value))}
              placeholder="Ex. 2 étages, RDC"
              className={inputClass}
            />
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={(details.has_elevator_pickup as boolean) ?? false}
              onChange={(e) => onChange(update(details, "has_elevator_pickup", e.target.checked))}
            />
            <span className="text-sm text-dr-tri-dark">Ascenseur</span>
          </label>
        </fieldset>
      )}

      {/* 3. Lieu de livraison (pour livraison, transport et retrait) */}
      {transportType && (
        <fieldset className="grid gap-4 rounded-lg border border-dr-tri-border bg-dr-tri-background p-4">
          <legend className="text-sm font-medium text-dr-tri-dark">
            3. Lieu de livraison{transportType === "retrait" ? " (où livrer)" : ""}
          </legend>
          <label className={labelClass}>
            Adresse de livraison
            <input
              type="text"
              value={(details.dropoff_address as string) ?? ""}
              onChange={(e) => onChange(update(details, "dropoff_address", e.target.value))}
              placeholder="Ex. Rue du Lac 5, Genève"
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Escaliers
            <input
              type="text"
              value={(details.stairs_dropoff as string) ?? ""}
              onChange={(e) => onChange(update(details, "stairs_dropoff", e.target.value))}
              placeholder="Ex. RDC, 1er étage"
              className={inputClass}
            />
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={(details.has_elevator_dropoff as boolean) ?? false}
              onChange={(e) => onChange(update(details, "has_elevator_dropoff", e.target.checked))}
            />
            <span className="text-sm text-dr-tri-dark">Ascenseur</span>
          </label>
        </fieldset>
      )}

      {/* Options communes */}
      {transportType && (
        <div className="grid gap-4">
          <label className={labelClass}>
            Créneau préféré
            <select
              value={(details.time_window as string) ?? ""}
              onChange={(e) => onChange(update(details, "time_window", e.target.value))}
              className={inputClass}
            >
              <option value="">—</option>
              {TIME_WINDOWS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
        </div>
      )}
    </div>
  )
}
