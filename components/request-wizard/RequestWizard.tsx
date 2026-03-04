"use client"

import { useState, useRef } from "react"
import { ServicePicker } from "./ServicePicker"
import { StepDetailsDebarras } from "./StepDetailsDebarras"
import { StepDetailsTransport } from "./StepDetailsTransport"
import { StepDetailsInstallation } from "./StepDetailsInstallation"
import { StepDetailsRecyclage } from "./StepDetailsRecyclage"
import { StepDetailsOther } from "./StepDetailsOther"
import { StepLocation } from "./StepLocation"
import { StepAttachments } from "./StepAttachments"
import { StepPreferredDates } from "./StepPreferredDates"
import { createRequestAction } from "@/app/(app)/app/demandes/actions"
import type { WizardDetails } from "./wizard-fields"
import { inputClass, labelClass } from "./wizard-fields"

const MAX_ATTACHMENTS = 5
type Step = 1 | 2 | 3 | 4 | 5

const WIZARD_STEPS: { step: Step; label: string; shortLabel: string }[] = [
  { step: 1, label: "Type de service", shortLabel: "Service" },
  { step: 2, label: "Photos", shortLabel: "Photos" },
  { step: 3, label: "Détails", shortLabel: "Détails" },
  { step: 4, label: "Lieu", shortLabel: "Lieu" },
  { step: 5, label: "Disponibilités", shortLabel: "Dispo" },
]

const serviceToDetailsStep: Record<string, React.ComponentType<{ details: WizardDetails; onChange: (d: WizardDetails) => void }>> = {
  clearance: StepDetailsDebarras,
  transport: StepDetailsTransport,
  moving: StepDetailsInstallation,
  recycling: StepDetailsRecyclage,
  other: StepDetailsOther,
}

export function RequestWizard() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const selectedFilesRef = useRef<File[]>([])
  const [step, setStep] = useState<Step>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    type: "",
    description: "",
    details: {} as WizardDetails,
    street: "",
    postal_code: "",
    city: "",
    preferred_dates: [] as string[],
    access_notes: "",
  })

  const DetailsStepComponent = form.type ? serviceToDetailsStep[form.type] ?? StepDetailsOther : null

  const buildFormData = (): FormData => {
    const fd = new FormData()
    fd.set("type", form.type || "other")
    fd.set("description", form.description)
    fd.set("street", form.street)
    fd.set("postal_code", form.postal_code)
    fd.set("city", form.city)
    fd.set("requested_dates", JSON.stringify(form.preferred_dates))
    fd.set("access_constraints", form.access_notes)
    fd.set("details_json", JSON.stringify(form.details))
    const input =
      fileInputRef.current ??
      document.querySelector<HTMLInputElement>('input[name="attachments"]')
    const files = input?.files
    if (files) {
      for (let i = 0; i < Math.min(files.length, MAX_ATTACHMENTS); i++) {
        fd.append("attachments", files[i])
      }
    }
    return fd
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!form.description?.trim()) {
      setError("La description est obligatoire.")
      setStep(3)
      return
    }
    if (!form.type) {
      setError("Veuillez choisir un type de service.")
      setStep(1)
      return
    }
    setIsSubmitting(true)
    try {
      await createRequestAction(buildFormData())
    } catch (err: unknown) {
      if (err && typeof err === "object" && "digest" in err && String((err as { digest?: string }).digest).startsWith("NEXT_")) {
        throw err
      }
      setError(err instanceof Error ? err.message : "Une erreur est survenue.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const canNextStep1 = Boolean(form.type)
  const canNextStep2 = Boolean(form.description?.trim())

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      {/* Fil d'Ariane / Stepper */}
      <nav aria-label="Étapes de la demande" className="card py-4">
        <ol className="flex flex-wrap items-center justify-between gap-2 sm:gap-0" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {WIZARD_STEPS.map(({ step: s, label, shortLabel }, index) => {
            const isCurrent = step === s
            const isPast = step > s
            const isClickable = isPast
            return (
              <li
                key={s}
                className="flex items-center shrink-0"
              >
                {index > 0 && (
                  <span
                    className="mx-1 hidden h-px w-4 flex-1 bg-dr-tri-border sm:mx-2 sm:block sm:w-8"
                    aria-hidden
                  />
                )}
                <span className="flex flex-col items-center gap-0.5 sm:flex-row sm:gap-2">
                  <button
                    type="button"
                    onClick={() => isClickable && setStep(s)}
                    disabled={!isClickable}
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                      isCurrent
                        ? "bg-dr-tri-primary text-white ring-2 ring-dr-tri-primary ring-offset-2"
                        : isPast
                          ? "bg-dr-tri-light-green text-dr-tri-primary hover:bg-dr-tri-primary hover:text-white"
                          : "bg-dr-tri-background text-dr-tri-muted"
                    } ${isClickable ? "cursor-pointer" : "cursor-default"}`}
                    aria-current={isCurrent ? "step" : undefined}
                    aria-label={`Étape ${s} : ${label}`}
                  >
                    {s}
                  </button>
                  <span
                    className={`text-xs font-medium sm:text-sm ${
                      isCurrent ? "text-dr-tri-dark" : isPast ? "text-dr-tri-muted" : "text-dr-tri-muted"
                    }`}
                  >
                    <span className="hidden sm:inline">{label}</span>
                    <span className="sm:hidden">{shortLabel}</span>
                  </span>
                </span>
              </li>
            )
          })}
        </ol>
        <p className="mt-2 text-center text-xs text-dr-tri-muted" aria-live="polite">
          Étape {step} sur 5
        </p>
      </nav>

      {error && (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}

      {/* Step 1 — Type de service */}
      {step === 1 && (
        <section className="card grid gap-4" aria-labelledby="step1-heading">
          <h2 id="step1-heading" className="text-lg font-semibold text-dr-tri-dark">Type de service</h2>
          <ServicePicker
            value={form.type}
            onChange={(value) => setForm((f) => ({ ...f, type: value, details: {} }))}
            required
          />
          <div className="flex justify-end">
            <button type="button" className="btn" onClick={() => setStep(2)} disabled={!canNextStep1}>
              Suivant
            </button>
          </div>
        </section>
      )}

      {/* Step 2 — Photos */}
      {step === 2 && (
        <section className="card grid gap-4" aria-labelledby="step2-heading">
          <h2 id="step2-heading" className="text-lg font-semibold text-dr-tri-dark">Photos (optionnel)</h2>
          <StepAttachments
            inputRef={fileInputRef}
            onFilesChange={(files) => {
              selectedFilesRef.current = files
            }}
          />
          <div className="flex justify-between pt-2">
            <button type="button" className="btn" onClick={() => setStep(1)}>
              Précédent
            </button>
            <button type="button" className="btn" onClick={() => setStep(3)}>
              Suivant
            </button>
          </div>
        </section>
      )}

      {/* Step 3 — Détails (description + détail service) */}
      {step === 3 && (
        <section className="card grid gap-4" aria-labelledby="step3-heading">
          <h2 id="step3-heading" className="text-lg font-semibold text-dr-tri-dark">Détails</h2>

          <label className={labelClass}>
            Description <span className="text-red-500">*</span>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Décrivez votre besoin..."
              className={inputClass}
            />
          </label>

          {DetailsStepComponent && (
            <DetailsStepComponent
              details={form.details}
              onChange={(details) => setForm((f) => ({ ...f, details }))}
            />
          )}

          <div className="flex justify-between pt-2">
            <button type="button" className="btn" onClick={() => setStep(2)}>
              Précédent
            </button>
            <button type="button" className="btn" onClick={() => setStep(4)} disabled={!canNextStep2}>
              Suivant
            </button>
          </div>
        </section>
      )}

      {/* Step 4 — Lieu (adresse + accès, sans dates pour garder dispo en étape 5) */}
      {step === 4 && (
        <section className="card grid gap-4" aria-labelledby="step4-heading">
          <h2 id="step4-heading" className="text-lg font-semibold text-dr-tri-dark">Lieu</h2>
          <StepLocation
            street={form.street}
            postalCode={form.postal_code}
            city={form.city}
            preferredDates={form.preferred_dates}
            accessNotes={form.access_notes}
            details={form.details}
            onStreetChange={(v) => setForm((f) => ({ ...f, street: v }))}
            onPostalCodeChange={(v) => setForm((f) => ({ ...f, postal_code: v }))}
            onCityChange={(v) => setForm((f) => ({ ...f, city: v }))}
            onPreferredDatesChange={(v) => setForm((f) => ({ ...f, preferred_dates: v }))}
            onAccessNotesChange={(v) => setForm((f) => ({ ...f, access_notes: v }))}
            onDetailsChange={(d) => setForm((f) => ({ ...f, details: d }))}
            showPreferredDates={false}
          />
          <div className="flex justify-between pt-2">
            <button type="button" className="btn" onClick={() => setStep(3)}>
              Précédent
            </button>
            <button type="button" className="btn" onClick={() => setStep(5)}>
              Suivant
            </button>
          </div>
        </section>
      )}

      {/* Step 5 — Dispo (demande de passage) + Envoyer la demande */}
      {step === 5 && (
        <section className="card grid gap-4" aria-labelledby="step5-heading">
          <h2 id="step5-heading" className="text-lg font-semibold text-dr-tri-dark">Disponibilités (demande de passage)</h2>
          <StepPreferredDates
            preferredDates={form.preferred_dates}
            onPreferredDatesChange={(v) => setForm((f) => ({ ...f, preferred_dates: v }))}
          />
          <label className={labelClass}>
            Nombre de personnes pour la manutention (estimé)
            <select
              value={(form.details.needs_helpers as string) ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, details: { ...f.details, needs_helpers: e.target.value } }))}
              className={inputClass}
            >
              <option value="">—</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3+">3+</option>
            </select>
          </label>
          <p className="text-sm text-dr-tri-muted">
            Vous allez recevoir un devis.
          </p>
          <div className="flex justify-between pt-2">
            <button type="button" className="btn" onClick={() => setStep(4)}>
              Précédent
            </button>
            <button type="submit" className="btn" disabled={isSubmitting}>
              {isSubmitting ? "Envoi en cours…" : "Envoyer la demande de passage"}
            </button>
          </div>
        </section>
      )}
    </form>
  )
}
