"use client"

import { useState, useRef } from "react"
import { inputClass, labelClass } from "./wizard-fields"
import { createRequestAction } from "@/app/(app)/app/demandes/actions"

// ─── Constants ────────────────────────────────────────────────────────────────

type DebarrasStep = 1 | 2 | 3 | 4

const STEP_LABELS: Record<DebarrasStep, { label: string; short: string }> = {
  1: { label: "Lieu & contenu", short: "Lieu" },
  2: { label: "Accès", short: "Accès" },
  3: { label: "Options & photos", short: "Options" },
  4: { label: "Date & résumé", short: "Résumé" },
}

const SPACE_TYPES = [
  { value: "cave", label: "Cave" },
  { value: "grenier", label: "Grenier" },
  { value: "garage", label: "Garage" },
  { value: "appartement", label: "Appartement" },
  { value: "maison", label: "Maison" },
  { value: "local", label: "Local" },
]

const ENCOMBREMENT = [
  { value: "faible", label: "Faible — quelques objets isolés" },
  { value: "moyen", label: "Moyen — l'équivalent d'une chambre" },
  { value: "important", label: "Important — plusieurs pièces ou grand espace" },
  { value: "tres_important", label: "Très important — logement complet ou dépôt" },
]

const ITEMS_TYPES = [
  { value: "meubles", label: "Meubles" },
  { value: "cartons", label: "Cartons" },
  { value: "electromenager", label: "Électroménager" },
  { value: "encombrants", label: "Encombrants" },
  { value: "gravats", label: "Gravats" },
  { value: "dechets_elec", label: "Déchets électroniques (DEEE)" },
  { value: "dangereux", label: "Objets dangereux (peintures, produits chimiques)" },
]

const DESTINATION = [
  { value: "dechetterie", label: "Tout à la déchetterie" },
  { value: "tri_don", label: "Tri : don + déchetterie" },
  { value: "tri_revente", label: "Tri : revente + déchetterie" },
  { value: "a_definir", label: "À définir avec l'équipe" },
]

const DISTANCE_PARKING = [
  { value: "devant", label: "Devant la porte / entrée directe" },
  { value: "proche", label: "À moins de 50 m" },
  { value: "loin", label: "Plus de 50 m" },
]

const ACCES_CAMION = [
  { value: "facile", label: "Facile — rue large, pas de contrainte" },
  { value: "etroit", label: "Étroit — ruelle ou voie limitée" },
  { value: "difficile", label: "Difficile — zone piétonne, accès restreint" },
]

const CRENEAUX = [
  { value: "matin", label: "Matin (8h–12h)" },
  { value: "aprem", label: "Après-midi (12h–17h)" },
  { value: "journee", label: "Toute la journée" },
  { value: "flexible", label: "Flexible" },
]

const MAX_FILES = 5

// ─── State types ──────────────────────────────────────────────────────────────

type AccessBlock = {
  adresse: string
  cp: string
  ville: string
  etage: string
  ascenseur: string
  distance_parking: string
  acces_camion: string
  notes: string
}

const EMPTY_ACCESS: AccessBlock = {
  adresse: "", cp: "", ville: "", etage: "",
  ascenseur: "", distance_parking: "", acces_camion: "", notes: "",
}

type DebarrasForm = {
  space_type: string
  encombrement: string
  items_types: string[]
  objets_particuliers: string
  acces: AccessBlock
  demontage: boolean
  destination: string
  date_souhaitee: string
  creneau: string
}

const INITIAL: DebarrasForm = {
  space_type: "",
  encombrement: "",
  items_types: [],
  objets_particuliers: "",
  acces: { ...EMPTY_ACCESS },
  demontage: false,
  destination: "",
  date_souhaitee: "",
  creneau: "",
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className={labelClass}>{label}{children}</label>
}

function SelectField({
  value, onChange, options, placeholder = "— Choisir —",
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

function SummaryRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="flex gap-2 text-sm">
      <span className="w-44 shrink-0 font-medium text-dr-tri-muted">{label}</span>
      <span className="text-dr-tri-dark">{value}</span>
    </div>
  )
}

function SummaryBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-dr-tri-border bg-dr-tri-background p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-dr-tri-muted">{title}</p>
      <div className="grid gap-1.5">{children}</div>
    </div>
  )
}

function Stepper({ step }: { step: DebarrasStep }) {
  return (
    <nav aria-label="Étapes" className="card py-4">
      <ol className="flex flex-wrap items-center justify-between gap-y-2"
        style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {([1, 2, 3, 4] as const).map((s, i) => {
          const isCurrent = step === s
          const isPast = step > s
          return (
            <li key={s} className="flex items-center shrink-0">
              {i > 0 && <span className="mx-1 hidden h-px w-8 bg-dr-tri-border sm:mx-2 sm:block sm:w-12" aria-hidden />}
              <span className="flex flex-col items-center gap-0.5 sm:flex-row sm:gap-1.5">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  isCurrent ? "bg-dr-tri-primary text-white ring-2 ring-dr-tri-primary ring-offset-2"
                  : isPast ? "bg-dr-tri-light-green text-dr-tri-primary"
                  : "bg-dr-tri-background text-dr-tri-muted"
                }`} aria-current={isCurrent ? "step" : undefined}>
                  {isPast ? "✓" : s}
                </span>
                <span className={`text-xs font-medium ${isCurrent ? "text-dr-tri-dark" : "text-dr-tri-muted"}`}>
                  <span className="hidden sm:inline">{STEP_LABELS[s].label}</span>
                  <span className="sm:hidden">{STEP_LABELS[s].short}</span>
                </span>
              </span>
            </li>
          )
        })}
      </ol>
      <p className="mt-2 text-center text-xs text-dr-tri-muted" aria-live="polite">Étape {step} sur 4</p>
    </nav>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function DebarrasWizard() {
  const [step, setStep] = useState<DebarrasStep>(1)
  const [form, setForm] = useState<DebarrasForm>(INITIAL)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const set = <K extends keyof DebarrasForm>(key: K, value: DebarrasForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const setAccess = (key: keyof AccessBlock, value: string) =>
    setForm((f) => ({ ...f, acces: { ...f.acces, [key]: value } }))

  const toggleItemType = (value: string) => {
    setForm((f) => {
      const arr = f.items_types.includes(value)
        ? f.items_types.filter((v) => v !== value)
        : [...f.items_types, value]
      return { ...f, items_types: arr }
    })
  }

  const accessIsValid = () =>
    form.acces.adresse.trim() !== "" && form.acces.ville.trim() !== ""

  const canNext: Record<DebarrasStep, boolean> = {
    1: true,
    2: accessIsValid(),
    3: true,
    4: false,
  }

  const next = () => setStep((s) => Math.min(s + 1, 4) as DebarrasStep)
  const prev = () => setStep((s) => Math.max(s - 1, 1) as DebarrasStep)

  const handleSubmit = async () => {
    setError(null)
    setIsSubmitting(true)
    try {
      const spaceLabel = SPACE_TYPES.find((t) => t.value === form.space_type)?.label ?? "Débarras"
      const fd = new FormData()
      fd.set("type", "clearance")
      fd.set("description", spaceLabel)
      fd.set("street", form.acces.adresse)
      fd.set("postal_code", form.acces.cp)
      fd.set("city", form.acces.ville)
      fd.set("requested_dates", form.date_souhaitee ? JSON.stringify([form.date_souhaitee]) : "[]")
      fd.set("details_json", JSON.stringify({
        space_type: form.space_type || undefined,
        encombrement: form.encombrement || undefined,
        items_types: form.items_types.length ? form.items_types : undefined,
        objets_particuliers: form.objets_particuliers || undefined,
        acces: {
          etage: form.acces.etage || undefined,
          ascenseur: form.acces.ascenseur || undefined,
          distance_parking: form.acces.distance_parking || undefined,
          acces_camion: form.acces.acces_camion || undefined,
          notes: form.acces.notes || undefined,
        },
        options: {
          demontage: form.demontage,
          destination: form.destination || undefined,
        },
        creneau: form.creneau || undefined,
      }))

      const input = fileInputRef.current
      if (input?.files) {
        for (let i = 0; i < Math.min(input.files.length, MAX_FILES); i++) {
          fd.append("attachments", input.files[i])
        }
      }
      await createRequestAction(fd)
    } catch (err: unknown) {
      if (err && typeof err === "object" && "digest" in err &&
        String((err as { digest?: string }).digest).startsWith("NEXT_")) throw err
      setError(err instanceof Error ? err.message : "Une erreur est survenue.")
    } finally {
      setIsSubmitting(false)
    }
  }

  function NavButtons({ disableNext }: { disableNext?: boolean }) {
    return (
      <div className="flex justify-between pt-2">
        {step > 1 ? <button type="button" className="btn" onClick={prev}>Précédent</button> : <span />}
        <button type="button" className="btn disabled:opacity-40" onClick={next}
          disabled={disableNext ?? !canNext[step]}>
          Suivant
        </button>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <Stepper step={step} />

      {error && (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>
      )}

      {/* ── Step 1 — Lieu & contenu ────────────────────────────────────────────── */}
      {step === 1 && (
        <section className="card grid gap-5" aria-labelledby="s1-title">
          <div>
            <h2 id="s1-title" className="text-lg font-semibold text-dr-tri-dark">Lieu à vider & contenu</h2>
            <p className="mt-1 text-sm text-dr-tri-muted">
              Ces informations nous aident à estimer le volume et les conditions d&apos;accès.
            </p>
          </div>

          <Field label="Type d'espace">
            <SelectField value={form.space_type} onChange={(v) => set("space_type", v)} options={SPACE_TYPES} />
          </Field>

          <Field label="Niveau d'encombrement">
            <SelectField value={form.encombrement} onChange={(v) => set("encombrement", v)} options={ENCOMBREMENT} />
          </Field>

          <div>
            <p className="mb-2 text-sm text-dr-tri-muted">Types d&apos;objets présents</p>
            <div className="flex flex-wrap gap-3">
              {ITEMS_TYPES.map((o) => (
                <label key={o.value} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.items_types.includes(o.value)}
                    onChange={() => toggleItemType(o.value)}
                    className="h-4 w-4 rounded accent-dr-tri-primary"
                  />
                  <span className="text-sm text-dr-tri-dark">{o.label}</span>
                </label>
              ))}
            </div>
          </div>

          <Field label="Objets particuliers ou informations utiles">
            <textarea
              rows={3}
              value={form.objets_particuliers}
              onChange={(e) => set("objets_particuliers", e.target.value)}
              placeholder="Ex. piano, coffre-fort, amiante possible, accès par escalier étroit…"
              className={inputClass}
            />
          </Field>

          <NavButtons disableNext={false} />
        </section>
      )}

      {/* ── Step 2 — Accès ───────────────────────────────────────────────────── */}
      {step === 2 && (
        <section className="card grid gap-5" aria-labelledby="s2-title">
          <div>
            <h2 id="s2-title" className="text-lg font-semibold text-dr-tri-dark">Accès</h2>
            <p className="mt-1 text-sm text-dr-tri-muted">
              Adresse du lieu à vider et conditions d&apos;accès pour le véhicule.
            </p>
          </div>

          <Field label="Adresse (rue, n°) *">
            <input type="text" value={form.acces.adresse} onChange={(e) => setAccess("adresse", e.target.value)}
              placeholder="Ex. Avenue de la Gare 10" className={inputClass} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Code postal *">
              <input type="text" value={form.acces.cp} onChange={(e) => setAccess("cp", e.target.value)}
                placeholder="Ex. 1003" maxLength={5} className={inputClass} />
            </Field>
            <Field label="Ville *">
              <input type="text" value={form.acces.ville} onChange={(e) => setAccess("ville", e.target.value)}
                placeholder="Ex. Lausanne" className={inputClass} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Étage">
              <input type="text" value={form.acces.etage} onChange={(e) => setAccess("etage", e.target.value)}
                placeholder="RDC, 1er, 2e…" className={inputClass} />
            </Field>
            <Field label="Ascenseur">
              <SelectField value={form.acces.ascenseur} onChange={(v) => setAccess("ascenseur", v)}
                options={[{ value: "oui", label: "Oui" }, { value: "non", label: "Non" }]} placeholder="—" />
            </Field>
          </div>
          <div className="grid gap-3 rounded-lg border border-dr-tri-border bg-dr-tri-background p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-dr-tri-muted">Accès véhicule</p>
            <Field label="Distance parking / dépôt du camion">
              <SelectField value={form.acces.distance_parking} onChange={(v) => setAccess("distance_parking", v)} options={DISTANCE_PARKING} />
            </Field>
            <Field label="Accès camion">
              <SelectField value={form.acces.acces_camion} onChange={(v) => setAccess("acces_camion", v)} options={ACCES_CAMION} />
            </Field>
          </div>
          <Field label="Notes d'accès (code entrée, digicode, etc.)">
            <input type="text" value={form.acces.notes} onChange={(e) => setAccess("notes", e.target.value)}
              placeholder="Ex. Code porte 1234, sonner au 2e" className={inputClass} />
          </Field>

          <NavButtons disableNext={!canNext[2]} />
        </section>
      )}

      {/* ── Step 3 — Options & photos ───────────────────────────────────────── */}
      {step === 3 && (
        <section className="card grid gap-5" aria-labelledby="s3-title">
          <h2 id="s3-title" className="text-lg font-semibold text-dr-tri-dark">Options & photos</h2>

          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" checked={form.demontage}
              onChange={(e) => set("demontage", e.target.checked)}
              className="h-4 w-4 rounded accent-dr-tri-primary" />
            <span className="text-sm text-dr-tri-dark">Démontage des meubles avant évacuation</span>
          </label>

          <Field label="Destination du contenu">
            <SelectField value={form.destination} onChange={(v) => set("destination", v)} options={DESTINATION} />
          </Field>

          <div className="grid gap-2 rounded-lg border border-dr-tri-border bg-dr-tri-background p-4">
            <span className="text-sm font-medium text-dr-tri-dark">Photos (optionnel)</span>
            <p className="text-xs text-dr-tri-muted">
              Les photos permettent une estimation plus précise. Max. {MAX_FILES} fichiers.
            </p>
            <input ref={fileInputRef} type="file" name="attachments" accept="image/*,.pdf" multiple
              className="block w-full text-sm text-dr-tri-muted file:mr-3 file:rounded file:border-0 file:bg-dr-tri-primary file:px-4 file:py-2 file:text-white" />
          </div>

          <NavButtons disableNext={false} />
        </section>
      )}

      {/* ── Step 4 — Date & résumé ───────────────────────────────────────────── */}
      {step === 4 && (
        <section className="card grid gap-5" aria-labelledby="s4-title">
          <h2 id="s4-title" className="text-lg font-semibold text-dr-tri-dark">Date & résumé</h2>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Date souhaitée">
              <input type="date" value={form.date_souhaitee}
                onChange={(e) => set("date_souhaitee", e.target.value)} className={inputClass} />
            </Field>
            <Field label="Créneau">
              <SelectField value={form.creneau} onChange={(v) => set("creneau", v)} options={CRENEAUX} />
            </Field>
          </div>

          <SummaryBlock title="Lieu & contenu">
            <SummaryRow label="Type d'espace" value={SPACE_TYPES.find((t) => t.value === form.space_type)?.label} />
            <SummaryRow label="Encombrement" value={ENCOMBREMENT.find((e) => e.value === form.encombrement)?.label} />
            <SummaryRow label="Types d'objets" value={form.items_types.length
              ? form.items_types.map((v) => ITEMS_TYPES.find((t) => t.value === v)?.label).filter(Boolean).join(", ")
              : undefined} />
            <SummaryRow label="Précisions" value={form.objets_particuliers} />
          </SummaryBlock>

          <SummaryBlock title="Accès">
            <SummaryRow label="Adresse" value={[form.acces.adresse, [form.acces.cp, form.acces.ville].filter(Boolean).join(" ")].filter(Boolean).join(", ")} />
            <SummaryRow label="Étage" value={form.acces.etage} />
            <SummaryRow label="Ascenseur" value={form.acces.ascenseur} />
            <SummaryRow label="Parking" value={DISTANCE_PARKING.find((o) => o.value === form.acces.distance_parking)?.label} />
            <SummaryRow label="Accès camion" value={ACCES_CAMION.find((o) => o.value === form.acces.acces_camion)?.label} />
            <SummaryRow label="Notes" value={form.acces.notes} />
          </SummaryBlock>

          <SummaryBlock title="Options">
            <SummaryRow label="Démontage" value={form.demontage ? "Oui" : "Non"} />
            <SummaryRow label="Destination" value={DESTINATION.find((d) => d.value === form.destination)?.label} />
          </SummaryBlock>

          {(form.date_souhaitee || form.creneau) && (
            <SummaryBlock title="Date souhaitée">
              <SummaryRow label="Date" value={form.date_souhaitee
                ? new Date(form.date_souhaitee).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
                : undefined} />
              <SummaryRow label="Créneau" value={CRENEAUX.find((c) => c.value === form.creneau)?.label} />
            </SummaryBlock>
          )}

          <div className="rounded-lg border border-dr-tri-border bg-dr-tri-background px-4 py-3 text-sm text-dr-tri-muted">
            Une fois votre demande envoyée, vous recevrez un devis directement dans votre espace client. Vous pourrez aussi échanger avec nous via un chat dédié à votre demande.
          </div>

          <div className="flex justify-between pt-2">
            <button type="button" className="btn" onClick={prev} disabled={isSubmitting}>Précédent</button>
            <button type="button" onClick={handleSubmit} disabled={isSubmitting}
              className="btn disabled:opacity-50">
              {isSubmitting ? "Envoi en cours…" : "Envoyer ma demande"}
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
