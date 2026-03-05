"use client"

import { useState } from "react"
import { MapboxAddressInput, type MapboxAddressValue } from "@/components/address/MapboxAddressInput"
import { inputClass, labelClass, type WizardDetails } from "./wizard-fields"

const PARKING_DISTANCE = [
  { value: "<10m", label: "Moins de 10 m" },
  { value: "10-50m", label: "10 à 50 m" },
  { value: ">50m", label: "Plus de 50 m" },
]

function updateDetails(details: WizardDetails, key: string, value: unknown): WizardDetails {
  return { ...details, [key]: value }
}

type StepLocationProps = {
  street: string
  postalCode: string
  city: string
  addressLat?: number | null
  addressLng?: number | null
  preferredDates: string[]
  accessNotes: string
  details: WizardDetails
  onStreetChange: (v: string) => void
  onPostalCodeChange: (v: string) => void
  onCityChange: (v: string) => void
  onAddressSelect?: (v: MapboxAddressValue) => void
  onPreferredDatesChange: (v: string[]) => void
  onAccessNotesChange: (v: string) => void
  onDetailsChange: (d: WizardDetails) => void
  /** Afficher le bloc "Dates de RDV souhaitées". À false pour l’étape Lieu quand les dates sont en étape Dispo (ex. débarras). */
  showPreferredDates?: boolean
  /** Masquer étage, ascenseur, distance parking (ex. Jardin / extérieur). */
  hideFloorAndAccess?: boolean
}

export function StepLocation({
  street,
  postalCode,
  city,
  addressLat,
  addressLng,
  preferredDates,
  accessNotes,
  details,
  onStreetChange,
  onPostalCodeChange,
  onCityChange,
  onAddressSelect,
  onPreferredDatesChange,
  onAccessNotesChange,
  onDetailsChange,
  showPreferredDates = true,
  hideFloorAndAccess = false,
}: StepLocationProps) {
  const [dateToAdd, setDateToAdd] = useState("")
  const addressValue: MapboxAddressValue = {
    street,
    postal_code: postalCode,
    city,
    lat: addressLat ?? null,
    lng: addressLng ?? null,
  }

  const addDate = () => {
    if (!dateToAdd.trim()) return
    const next = [...preferredDates, dateToAdd.trim()].filter(
      (d, i, arr) => arr.indexOf(d) === i
    ).sort()
    onPreferredDatesChange(next)
    setDateToAdd("")
  }

  const removeDate = (date: string) => {
    onPreferredDatesChange(preferredDates.filter((d) => d !== date))
  }

  return (
    <div className="grid gap-4">
      <p className="text-sm text-dr-tri-muted">
        Adresse d&apos;intervention{showPreferredDates ? " et disponibilités" : ""}.
      </p>

      <label className={labelClass}>
        Adresse
        <MapboxAddressInput
          value={addressValue}
          onSelect={onAddressSelect}
          placeholder="Rechercher une adresse…"
          className={inputClass}
        />
      </label>

      {showPreferredDates && (
        <div className={labelClass}>
          <span className="block text-sm text-dr-tri-muted mb-1.5">
            Dates de RDV souhaitées (optionnel)
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={dateToAdd}
              onChange={(e) => setDateToAdd(e.target.value)}
              className={inputClass}
              style={{ maxWidth: "12rem" }}
            />
            <button
              type="button"
              onClick={addDate}
              className="btn text-sm"
            >
              Ajouter
            </button>
          </div>
          {preferredDates.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-2" style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {preferredDates.map((d) => (
                <li
                  key={d}
                  className="inline-flex items-center gap-1 rounded-full bg-dr-tri-background border border-dr-tri-border px-3 py-1 text-sm text-dr-tri-dark"
                >
                  {new Date(d).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                  <button
                    type="button"
                    onClick={() => removeDate(d)}
                    className="ml-1 rounded p-0.5 hover:bg-dr-tri-border text-dr-tri-muted hover:text-dr-tri-dark"
                    aria-label="Retirer cette date"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {!hideFloorAndAccess && (
        <>
          <label className={labelClass}>
            Étage (0 = RDC)
            <input
              type="number"
              min={0}
              value={(details.floors as number) ?? ""}
              onChange={(e) => onDetailsChange(updateDetails(details, "floors", e.target.value === "" ? undefined : parseInt(e.target.value, 10)))}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Ascenseur
            <select
              value={(details.has_elevator as string) ?? ""}
              onChange={(e) => onDetailsChange(updateDetails(details, "has_elevator", e.target.value || undefined))}
              className={inputClass}
            >
              <option value="">—</option>
              <option value="yes">Oui</option>
              <option value="no">Non</option>
            </select>
          </label>
          <label className={labelClass}>
            Distance parking
            <select
              value={(details.parking_distance as string) ?? ""}
              onChange={(e) => onDetailsChange(updateDetails(details, "parking_distance", e.target.value))}
              className={inputClass}
            >
              <option value="">—</option>
              {PARKING_DISTANCE.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
        </>
      )}

      <label className={labelClass}>
        Notes d&apos;accès (code d&apos;entrée, digicode, etc.)
        <textarea
          rows={2}
          value={accessNotes}
          onChange={(e) => onAccessNotesChange(e.target.value)}
          placeholder="Ex. Code d'entrée 1234, interphone A"
          className={inputClass}
        />
      </label>
    </div>
  )
}
