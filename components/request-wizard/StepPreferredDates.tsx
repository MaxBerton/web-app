"use client"

import { useState } from "react"
import { inputClass, labelClass } from "./wizard-fields"

type StepPreferredDatesProps = {
  preferredDates: string[]
  onPreferredDatesChange: (v: string[]) => void
}

export function StepPreferredDates({
  preferredDates,
  onPreferredDatesChange,
}: StepPreferredDatesProps) {
  const [dateToAdd, setDateToAdd] = useState("")

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
    <div className={labelClass}>
      <span className="block text-sm text-dr-tri-muted mb-1.5">
        Indiquez les dates qui vous conviennent pour préparer le passage (optionnel)
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
  )
}
