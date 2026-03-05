"use client"

import { useState, useRef } from "react"
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
type Step = 1 | 2 | 3 | 4

const WIZARD_STEPS: { step: Step; label: string; shortLabel: string }[] = [
  { step: 1, label: "Photos", shortLabel: "Photos" },
  { step: 2, label: "Détails", shortLabel: "Détails" },
  { step: 3, label: "Lieu", shortLabel: "Lieu" },
  { step: 4, label: "Disponibilités", shortLabel: "Dispo" },
]

// Jardin & travaux : pas d'étape Photos (devis sur surface + fréquence, pas de photo)
const WIZARD_STEPS_OTHER: { step: 1 | 2 | 3; label: string; shortLabel: string }[] = [
  { step: 1, label: "Détails", shortLabel: "Détails" },
  { step: 2, label: "Lieu", shortLabel: "Lieu" },
  { step: 3, label: "Disponibilités", shortLabel: "Dispo" },
]

const serviceToDetailsStep: Record<string, React.ComponentType<{ details: WizardDetails; onChange: (d: WizardDetails) => void }>> = {
  clearance: StepDetailsDebarras,
  transport: StepDetailsTransport,
  moving: StepDetailsInstallation,
  recycling: StepDetailsRecyclage,
  other: StepDetailsOther,
}

type RequestWizardProps = {
  initialType?: string
}

export function RequestWizard({ initialType = "" }: RequestWizardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const selectedFilesRef = useRef<File[]>([])
  const [step, setStep] = useState<Step>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    type: initialType,
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
    // Pour type=other, générer la description depuis la catégorie + contraintes si description vide
    const autoDescription = isOther && !form.description?.trim()
      ? [form.details?.category as string, form.details?.constraints as string].filter(Boolean).join(" — ") || "Jardin & travaux"
      : form.description
    fd.set("description", autoDescription)
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
    if (!isOther && !form.description?.trim()) {
      setError("La description est obligatoire.")
      setStep(2)
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

  const isOther = form.type === "other"
  const currentSteps = isOther ? WIZARD_STEPS_OTHER : WIZARD_STEPS
  const totalSteps = currentSteps.length
  const canNextStep1 = Boolean(form.type)
  const isLivraisonSimple =
    form.type === "transport" && form.details?.transport_type === "livraison_simple"
  const livraisonSimpleComplete =
    (form.details?.livraison_simple_step as number) === 6
  const canNextStep2 = isOther
    ? Boolean((form.details?.category as string)?.trim())
    : Boolean(form.description?.trim()) && (!isLivraisonSimple || livraisonSimpleComplete)

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      {/* Fil d'Ariane / Stepper */}
      <nav aria-label="Étapes de la demande" className="card py-4">
        <ol className="flex flex-wrap items-center justify-between gap-2 sm:gap-0" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {currentSteps.map(({ step: s, label, shortLabel }, index) => {
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
                    onClick={() => isClickable && setStep(s as Step)}
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
          Étape {step} sur {totalSteps}
        </p>
      </nav>

      {error && (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}

      {/* Step 1 — Photos (uniquement pour les types autres que Jardin & travaux) */}
      {!isOther && step === 1 && (
        <section className="card grid gap-4" aria-labelledby="step1-heading">
          <h2 id="step1-heading" className="text-lg font-semibold text-dr-tri-dark">Photos (optionnel)</h2>
          <StepAttachments
            inputRef={fileInputRef}
            onFilesChange={(files) => {
              selectedFilesRef.current = files
            }}
          />
          <div className="flex justify-end pt-2">
            <button type="button" className="btn" onClick={() => setStep(2)}>
              Suivant
            </button>
          </div>
        </section>
      )}

      {/* Détails — Step 1 pour other, Step 2 pour les autres types */}
      {(isOther && step === 1) || (!isOther && step === 2) ? (
        <section className="card grid gap-4" aria-labelledby="step-details-heading">
          <h2 id="step-details-heading" className="text-lg font-semibold text-dr-tri-dark">Détails</h2>

          {!isOther && (
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
          )}

          {DetailsStepComponent && (
            <DetailsStepComponent
              details={form.details}
              onChange={(details) => setForm((f) => ({ ...f, details }))}
            />
          )}

          <div className="flex justify-between pt-2">
            {!isOther ? (
              <button type="button" className="btn" onClick={() => setStep(1)}>
                Précédent
              </button>
            ) : (
              <span />
            )}
            <button type="button" className="btn" onClick={() => setStep(isOther ? 2 : 3)} disabled={!canNextStep2}>
              Suivant
            </button>
          </div>
        </section>
      ) : null}

      {/* Lieu — Step 2 pour other, Step 3 pour les autres types */}
      {(isOther && step === 2) || (!isOther && step === 3) ? (
        <section className="card grid gap-4" aria-labelledby="step-lieu-heading">
          <h2 id="step-lieu-heading" className="text-lg font-semibold text-dr-tri-dark">Lieu</h2>
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
            hideFloorAndAccess={isOther && (form.details?.category as string) === "jardin"}
          />
          <div className="flex justify-between pt-2">
            <button type="button" className="btn" onClick={() => setStep(isOther ? 1 : 2)}>
              Précédent
            </button>
            <button type="button" className="btn" onClick={() => setStep(isOther ? 3 : 4)}>
              Suivant
            </button>
          </div>
        </section>
      ) : null}

      {/* Disponibilités + Envoyer — Step 3 pour other, Step 4 pour les autres types */}
      {(isOther && step === 3) || (!isOther && step === 4) ? (
        <section className="card grid gap-4" aria-labelledby="step4-heading">
          <h2 id="step4-heading" className="text-lg font-semibold text-dr-tri-dark">Disponibilités</h2>
          <StepPreferredDates
            preferredDates={form.preferred_dates}
            onPreferredDatesChange={(v) => setForm((f) => ({ ...f, preferred_dates: v }))}
          />
          {!isOther && (
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
          )}
          <p className="text-sm text-dr-tri-muted">
            Une fois votre demande envoyée, vous recevrez un devis dans votre espace client. Vous pourrez également communiquer via un chat dédié.
          </p>
          <div className="flex justify-between pt-2">
            <button type="button" className="btn" onClick={() => setStep(3)}>
              Précédent
            </button>
            <button type="submit" className="btn" disabled={isSubmitting}>
              {isSubmitting ? "Envoi en cours…" : "Envoyer ma demande"}
            </button>
          </div>
        </section>
      ) : null}
    </form>
  )
}
