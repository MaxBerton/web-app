"use client"

import { useState, useRef } from "react"
import { MapboxAddressInput, type MapboxAddressValue } from "@/components/address/MapboxAddressInput"
import { inputClass, labelClass } from "./wizard-fields"
import { createRequestAction } from "@/app/(app)/app/demandes/actions"

// ─── Constants ────────────────────────────────────────────────────────────────

type TransportStep = 1 | 2 | 3 | 4 | 5 | 6
type TransportType = "livraison_simple" | "transport_objets_meubles" | "demenagement_complet" | ""

const TRANSPORT_TYPES = [
  {
    value: "livraison_simple" as const,
    label: "Livraison simple",
    hint: "1 objet de A vers B — IKEA, marketplace, électroménager, meuble acheté…",
  },
  {
    value: "transport_objets_meubles" as const,
    label: "Transport d'objets / meubles",
    hint: "Plusieurs objets ou meubles entre deux adresses.",
  },
  {
    value: "demenagement_complet" as const,
    label: "Déménagement complet",
    hint: "Logement complet, plusieurs pièces.",
  },
]

// Objet — livraison simple
const OBJECT_TYPES = [
  { value: "meuble", label: "Meuble (armoire, canapé, table…)" },
  { value: "electromenager", label: "Électroménager (frigo, machine…)" },
  { value: "colis_volumineux", label: "Colis / carton volumineux" },
  { value: "materiel_pro", label: "Matériel professionnel" },
  { value: "autre", label: "Autre" },
]

const TAILLES = [
  { value: "petit", label: "Petit — tient dans les bras (carton, chaise)" },
  { value: "moyen", label: "Moyen — 1 personne (table basse, TV)" },
  { value: "grand", label: "Grand — 2 personnes (canapé, frigo)" },
  { value: "tres_grand", label: "Très grand / hors-norme (piano, armoire)" },
]

const POIDS = [
  { value: "leger", label: "Léger (< 30 kg)" },
  { value: "moyen", label: "Moyen (30–80 kg)" },
  { value: "lourd", label: "Lourd (80–150 kg)" },
  { value: "tres_lourd", label: "Très lourd (> 150 kg)" },
]

// Objet — déménagement complet
const TYPE_LOGEMENT = [
  { value: "studio", label: "Studio / T1" },
  { value: "t2", label: "T2 / 2 pièces" },
  { value: "t3", label: "T3 / 3 pièces" },
  { value: "t4_plus", label: "T4 et plus" },
  { value: "maison", label: "Maison" },
  { value: "bureau", label: "Bureaux / local pro" },
]

const ENCOMBREMENT = [
  { value: "peu_meuble", label: "Peu meublé — quelques meubles essentiels" },
  { value: "standard", label: "Standard — logement meublé normalement" },
  { value: "tres_meuble", label: "Très meublé — nombreux meubles et objets" },
  { value: "cave_grenier", label: "Cave / grenier / débarras en plus" },
]

const VOLUME_DEMENAGEMENT = [
  { value: "petit", label: "Petit volume — fourgonnette (< 10 m³)" },
  { value: "moyen", label: "Camion moyen (10–25 m³)" },
  { value: "grand", label: "Grand camion (25–40 m³)" },
  { value: "tres_grand", label: "Plusieurs camions (> 40 m³)" },
]

// Adresses
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

// ─── Options par type ─────────────────────────────────────────────────────────

const OPTIONS_LIVRAISON = [
  { key: "opt_assemblage" as const, label: "Assemblage / montage de l'objet", hint: "Installation et mise en place sur place" },
  { key: "opt_montage_meuble" as const, label: "Montage meuble (ex. IKEA)", hint: "Lecture de notice et montage complet" },
  { key: "opt_reprise_ancien" as const, label: "Reprise de l'ancien objet", hint: "Emport et évacuation de l'objet remplacé" },
  { key: "opt_evacuation_emballages" as const, label: "Évacuation des emballages", hint: "Cartons, mousses, plastiques" },
]

const OPTIONS_TRANSPORT = [
  { key: "opt_demontage" as const, label: "Démontage avant transport", hint: "Démontage des meubles à l'adresse de départ" },
  { key: "opt_remontage" as const, label: "Remontage à destination", hint: "Remontage et installation dans le nouveau lieu" },
  { key: "opt_protection_meubles" as const, label: "Protection / emballage des meubles", hint: "Couvertures, films plastiques, cartons" },
  { key: "opt_reprise_ancien" as const, label: "Reprise d'anciens objets", hint: "Évacuation d'objets à remplacer ou jeter" },
]

const OPTIONS_DEMENAGEMENT = [
  { key: "opt_demontage" as const, label: "Démontage & remontage complet", hint: "Tous les meubles démontés, remontés à destination" },
  { key: "opt_emballage_pro" as const, label: "Emballage professionnel", hint: "Cartons fournis, emballage par nos équipes" },
  { key: "opt_garde_meuble" as const, label: "Garde-meuble temporaire", hint: "Stockage intermédiaire si délai entre départ et arrivée" },
  { key: "opt_nettoyage" as const, label: "Nettoyage logement départ", hint: "État des lieux de sortie facilité" },
]

// ─── Labels contextuels ───────────────────────────────────────────────────────

const STEP_LABELS_BY_TYPE: Record<
  TransportType,
  { step2: string; step3: string; step4: string; step3Sub: string; step4Sub: string }
> = {
  livraison_simple: {
    step2: "Décrivez l'objet à livrer",
    step3: "Adresse de récupération",
    step4: "Adresse de livraison",
    step3Sub: "D'où faut-il récupérer l'objet ?",
    step4Sub: "Où faut-il déposer l'objet ?",
  },
  transport_objets_meubles: {
    step2: "Décrivez les objets à transporter",
    step3: "Adresse de départ",
    step4: "Adresse d'arrivée",
    step3Sub: "D'où faut-il charger les objets ?",
    step4Sub: "Où faut-il les déposer ?",
  },
  demenagement_complet: {
    step2: "Votre logement actuel",
    step3: "Logement actuel (départ)",
    step4: "Nouveau logement (arrivée)",
    step3Sub: "Adresse du logement à vider.",
    step4Sub: "Adresse du logement à emménager.",
  },
  "": {
    step2: "Décrivez les objets",
    step3: "Adresse de départ",
    step4: "Adresse d'arrivée",
    step3Sub: "",
    step4Sub: "",
  },
}

// ─── State types ──────────────────────────────────────────────────────────────

type AddressBlock = {
  adresse: string
  cp: string
  ville: string
  lat: number | null
  lng: number | null
  etage: string
  ascenseur: string
  distance_parking: string
  acces_camion: string
  notes: string
}

const EMPTY_ADDRESS: AddressBlock = {
  adresse: "", cp: "", ville: "", lat: null, lng: null,
  etage: "", ascenseur: "", distance_parking: "", acces_camion: "", notes: "",
}

type TransportForm = {
  transport_type: TransportType
  // Objet — livraison simple
  object_type: string
  taille: string
  poids: string
  fragile: string
  nb_objets: string
  // Objet — transport meubles
  objets_liste: string
  taille_plus_grand: string
  poids_plus_lourd: string
  fragile_items: boolean
  // Objet — déménagement
  type_logement: string
  encombrement: string
  volume_demenagement: string
  objets_particuliers: string
  // Options — livraison
  opt_assemblage: boolean
  opt_montage_meuble: boolean
  opt_reprise_ancien: boolean
  opt_evacuation_emballages: boolean
  // Options — transport
  opt_demontage: boolean
  opt_remontage: boolean
  opt_protection_meubles: boolean
  // Options — déménagement
  opt_emballage_pro: boolean
  opt_garde_meuble: boolean
  opt_nettoyage: boolean
  // Lieux
  recup: AddressBlock
  depot: AddressBlock
  // Date
  date_souhaitee: string
  date_arrivee: string
  creneau: string
}

const INITIAL: TransportForm = {
  transport_type: "",
  object_type: "", taille: "", poids: "", fragile: "", nb_objets: "",
  objets_liste: "", taille_plus_grand: "", poids_plus_lourd: "", fragile_items: false,
  type_logement: "", encombrement: "", volume_demenagement: "", objets_particuliers: "",
  opt_assemblage: false, opt_montage_meuble: false, opt_reprise_ancien: false, opt_evacuation_emballages: false,
  opt_demontage: false, opt_remontage: false, opt_protection_meubles: false,
  opt_emballage_pro: false, opt_garde_meuble: false, opt_nettoyage: false,
  recup: { ...EMPTY_ADDRESS },
  depot: { ...EMPTY_ADDRESS },
  date_souhaitee: "", date_arrivee: "", creneau: "",
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

function OptionCard({
  checked, onChange, label, hint,
}: { checked: boolean; onChange: (v: boolean) => void; label: string; hint: string }) {
  return (
    <label className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
      checked ? "border-dr-tri-primary bg-dr-tri-light-green" : "border-dr-tri-border bg-white hover:border-dr-tri-primary/50"
    }`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 rounded accent-dr-tri-primary"
      />
      <span className="grid gap-0.5">
        <span className="text-sm font-medium text-dr-tri-dark">{label}</span>
        <span className="text-xs text-dr-tri-muted">{hint}</span>
      </span>
    </label>
  )
}

function AddressForm({
  value, onChange, showCreneau, creneauValue, onCreneauChange,
}: {
  value: AddressBlock
  onChange: (v: AddressBlock) => void
  showCreneau?: boolean
  creneauValue?: string
  onCreneauChange?: (v: string) => void
}) {
  const set = (key: keyof AddressBlock, v: string | number | null) => onChange({ ...value, [key]: v })
  return (
    <div className="grid gap-4">
      <Field label="Adresse *">
        <MapboxAddressInput
          value={{
            street: value.adresse,
            postal_code: value.cp,
            city: value.ville,
            lat: value.lat,
            lng: value.lng,
          }}
          onSelect={(v: MapboxAddressValue) => {
            set("adresse", v.street)
            set("cp", v.postal_code)
            set("ville", v.city)
            set("lat", v.lat)
            set("lng", v.lng)
          }}
          placeholder="Rechercher une adresse…"
          className={inputClass}
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Étage">
          <input type="text" value={value.etage} onChange={(e) => set("etage", e.target.value)}
            placeholder="RDC, 1er, 2e…" className={inputClass} />
        </Field>
        <Field label="Ascenseur">
          <SelectField value={value.ascenseur} onChange={(v) => set("ascenseur", v)}
            options={[{ value: "oui", label: "Oui" }, { value: "non", label: "Non" }]} placeholder="—" />
        </Field>
      </div>
      <div className="grid gap-3 rounded-lg border border-dr-tri-border bg-dr-tri-background p-3">
        <p className="text-xs font-medium uppercase tracking-wide text-dr-tri-muted">Accès véhicule</p>
        <Field label="Distance parking / dépôt du camion">
          <SelectField value={value.distance_parking} onChange={(v) => set("distance_parking", v)} options={DISTANCE_PARKING} />
        </Field>
        <Field label="Accès camion">
          <SelectField value={value.acces_camion} onChange={(v) => set("acces_camion", v)} options={ACCES_CAMION} />
        </Field>
      </div>
      <Field label="Notes d'accès (code entrée, digicode, etc.)">
        <input type="text" value={value.notes} onChange={(e) => set("notes", e.target.value)}
          placeholder="Ex. Code porte 1234, sonner au 2e" className={inputClass} />
      </Field>
      {showCreneau && onCreneauChange && (
        <Field label="Créneau souhaité">
          <SelectField value={creneauValue ?? ""} onChange={onCreneauChange} options={CRENEAUX} />
        </Field>
      )}
    </div>
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

function Stepper({ step, labels }: { step: TransportStep; labels: Record<TransportStep, { label: string; short: string }> }) {
  return (
    <nav aria-label="Étapes" className="card py-4">
      <ol className="flex flex-wrap items-center justify-between gap-y-2"
        style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {([1, 2, 3, 4, 5, 6] as const).map((s, i) => {
          const isCurrent = step === s
          const isPast = step > s
          return (
            <li key={s} className="flex items-center shrink-0">
              {i > 0 && <span className="mx-1 hidden h-px w-4 bg-dr-tri-border sm:mx-1.5 sm:block sm:w-5" aria-hidden />}
              <span className="flex flex-col items-center gap-0.5 sm:flex-row sm:gap-1.5">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  isCurrent ? "bg-dr-tri-primary text-white ring-2 ring-dr-tri-primary ring-offset-2"
                  : isPast ? "bg-dr-tri-light-green text-dr-tri-primary"
                  : "bg-dr-tri-background text-dr-tri-muted"
                }`} aria-current={isCurrent ? "step" : undefined}>
                  {isPast ? "✓" : s}
                </span>
                <span className={`text-xs font-medium ${isCurrent ? "text-dr-tri-dark" : "text-dr-tri-muted"}`}>
                  <span className="hidden sm:inline">{labels[s].label}</span>
                  <span className="sm:hidden">{labels[s].short}</span>
                </span>
              </span>
            </li>
          )
        })}
      </ol>
      <p className="mt-2 text-center text-xs text-dr-tri-muted" aria-live="polite">Étape {step} sur 6</p>
    </nav>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function TransportWizard() {
  const [step, setStep] = useState<TransportStep>(1)
  const [form, setForm] = useState<TransportForm>(INITIAL)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const set = <K extends keyof TransportForm>(key: K, value: TransportForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const tt = form.transport_type
  const isLivraison = tt === "livraison_simple"
  const isTransport = tt === "transport_objets_meubles"
  const isDemenagement = tt === "demenagement_complet"

  const ctx = STEP_LABELS_BY_TYPE[tt] ?? STEP_LABELS_BY_TYPE[""]

  const stepLabels: Record<TransportStep, { label: string; short: string }> = {
    1: { label: "Prestation", short: "Prest." },
    2: { label: isLivraison ? "Objet" : isDemenagement ? "Logement" : "Objets", short: isLivraison ? "Objet" : isDemenagement ? "Logem." : "Objets" },
    3: { label: isLivraison ? "Récupération" : isDemenagement ? "Départ" : "Départ", short: isLivraison ? "Récup." : "Départ" },
    4: { label: isLivraison ? "Livraison" : isDemenagement ? "Arrivée" : "Arrivée", short: isLivraison ? "Livr." : "Arrivée" },
    5: { label: "Options & date", short: "Options" },
    6: { label: "Résumé", short: "Résumé" },
  }

  const addressIsValid = (a: AddressBlock) => a.adresse.trim() !== "" && a.ville.trim() !== ""

  const canNext: Record<TransportStep, boolean> = {
    1: tt !== "",
    2: true,
    3: addressIsValid(form.recup),
    4: addressIsValid(form.depot),
    5: true,
    6: false,
  }

  const next = () => setStep((s) => Math.min(s + 1, 6) as TransportStep)
  const prev = () => setStep((s) => Math.max(s - 1, 1) as TransportStep)

  const handleSubmit = async () => {
    setError(null)
    setIsSubmitting(true)
    try {
      const transportLabel = TRANSPORT_TYPES.find((t) => t.value === tt)?.label ?? tt
      const fd = new FormData()
      fd.set("type", "transport")
      fd.set("description", transportLabel)
      fd.set("street", form.depot.adresse)
      fd.set("postal_code", form.depot.cp)
      fd.set("city", form.depot.ville)
      if (form.depot.lat != null && form.depot.lng != null) {
        fd.set("latitude", String(form.depot.lat))
        fd.set("longitude", String(form.depot.lng))
      }
      const dates = [form.date_souhaitee, isDemenagement ? form.date_arrivee : ""].filter(Boolean)
      fd.set("requested_dates", dates.length ? JSON.stringify(dates) : "[]")

      const objet = isLivraison
        ? { type: form.object_type || undefined, taille: form.taille || undefined, poids: form.poids || undefined, fragile: form.fragile || undefined, nb_objets: form.nb_objets || undefined }
        : isTransport
          ? { liste: form.objets_liste || undefined, taille_plus_grand: form.taille_plus_grand || undefined, poids_plus_lourd: form.poids_plus_lourd || undefined, fragile_items: form.fragile_items }
          : { type_logement: form.type_logement || undefined, encombrement: form.encombrement || undefined, volume: form.volume_demenagement || undefined, objets_particuliers: form.objets_particuliers || undefined }

      const options = isLivraison
        ? { assemblage: form.opt_assemblage, montage_meuble: form.opt_montage_meuble, reprise_ancien: form.opt_reprise_ancien, evacuation_emballages: form.opt_evacuation_emballages }
        : isTransport
          ? { demontage: form.opt_demontage, remontage: form.opt_remontage, protection_meubles: form.opt_protection_meubles, reprise_ancien: form.opt_reprise_ancien }
          : { demontage_remontage: form.opt_demontage, emballage_pro: form.opt_emballage_pro, garde_meuble: form.opt_garde_meuble, nettoyage: form.opt_nettoyage }

      fd.set("details_json", JSON.stringify({
        transport_type: tt,
        objet,
        options,
        adresse_depart: form.recup,
        adresse_arrivee: form.depot,
        date_depart: form.date_souhaitee || undefined,
        date_arrivee: isDemenagement ? (form.date_arrivee || undefined) : undefined,
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
      <Stepper step={step} labels={stepLabels} />

      {error && (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>
      )}

      {/* ── Step 1 — Type de prestation ──────────────────────────────────────── */}
      {step === 1 && (
        <section className="card grid gap-5" aria-labelledby="s1-title">
          <h2 id="s1-title" className="text-lg font-semibold text-dr-tri-dark">
            De quel type de prestation avez-vous besoin ?
          </h2>
          <div className="grid gap-3">
            {TRANSPORT_TYPES.map((t) => (
              <label key={t.value} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                tt === t.value ? "border-dr-tri-primary bg-dr-tri-light-green" : "border-dr-tri-border bg-white hover:border-dr-tri-primary/50"
              }`}>
                <input type="radio" name="transport_type" value={t.value}
                  checked={tt === t.value} onChange={() => set("transport_type", t.value)}
                  className="mt-0.5 accent-dr-tri-primary" />
                <span className="grid gap-0.5">
                  <span className="text-sm font-medium text-dr-tri-dark">{t.label}</span>
                  <span className="text-xs text-dr-tri-muted">{t.hint}</span>
                </span>
              </label>
            ))}
          </div>
          <NavButtons />
        </section>
      )}

      {/* ── Step 2 — Objet (selon type) ──────────────────────────────────────── */}
      {step === 2 && (
        <section className="card grid gap-5" aria-labelledby="s2-title">
          <div>
            <h2 id="s2-title" className="text-lg font-semibold text-dr-tri-dark">{ctx.step2}</h2>
            <p className="mt-1 text-sm text-dr-tri-muted">
              Ces informations nous permettent d&apos;estimer le véhicule et les ressources nécessaires.
            </p>
          </div>

          {/* ── Livraison simple ── */}
          {isLivraison && (
            <>
              <Field label="Type d'objet">
                <SelectField value={form.object_type} onChange={(v) => set("object_type", v)} options={OBJECT_TYPES} />
              </Field>
              <Field label="Taille approximative">
                <SelectField value={form.taille} onChange={(v) => set("taille", v)} options={TAILLES} />
              </Field>
              <Field label="Catégorie de poids">
                <SelectField value={form.poids} onChange={(v) => set("poids", v)} options={POIDS} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Fragile">
                  <SelectField value={form.fragile} onChange={(v) => set("fragile", v)}
                    options={[{ value: "oui", label: "Oui" }, { value: "non", label: "Non" }]} placeholder="—" />
                </Field>
                <Field label="Nombre d'objets">
                  <input type="number" min={1} value={form.nb_objets}
                    onChange={(e) => set("nb_objets", e.target.value)} placeholder="1" className={inputClass} />
                </Field>
              </div>
            </>
          )}

          {/* ── Transport objets / meubles ── */}
          {isTransport && (
            <>
              <Field label="Listez approximativement les objets à transporter">
                <textarea
                  rows={4}
                  value={form.objets_liste}
                  onChange={(e) => set("objets_liste", e.target.value)}
                  placeholder={"Ex. :\n– 1 armoire 2 portes\n– 1 table salle à manger + 6 chaises\n– 3 cartons de livres"}
                  className={inputClass}
                />
              </Field>
              <div className="grid gap-3 rounded-lg border border-dr-tri-border bg-dr-tri-background p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-dr-tri-muted">Pour estimer le camion</p>
                <Field label="Taille du plus encombrant">
                  <SelectField value={form.taille_plus_grand} onChange={(v) => set("taille_plus_grand", v)} options={TAILLES} />
                </Field>
                <Field label="Poids du plus lourd">
                  <SelectField value={form.poids_plus_lourd} onChange={(v) => set("poids_plus_lourd", v)} options={POIDS} />
                </Field>
              </div>
              <label className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" checked={form.fragile_items}
                  onChange={(e) => set("fragile_items", e.target.checked)}
                  className="h-4 w-4 rounded accent-dr-tri-primary" />
                <span className="text-sm text-dr-tri-dark">Certains objets sont fragiles</span>
              </label>
            </>
          )}

          {/* ── Déménagement complet ── */}
          {isDemenagement && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Type de logement">
                  <SelectField value={form.type_logement} onChange={(v) => set("type_logement", v)} options={TYPE_LOGEMENT} />
                </Field>
                <Field label="Niveau d'encombrement">
                  <SelectField value={form.encombrement} onChange={(v) => set("encombrement", v)} options={ENCOMBREMENT} />
                </Field>
              </div>
              <Field label="Volume estimé">
                <SelectField value={form.volume_demenagement} onChange={(v) => set("volume_demenagement", v)} options={VOLUME_DEMENAGEMENT} />
              </Field>
              <Field label="Objets particuliers (piano, coffre-fort, œuvres d'art…)">
                <input type="text" value={form.objets_particuliers}
                  onChange={(e) => set("objets_particuliers", e.target.value)}
                  placeholder="Ex. Piano droit, coffre-fort 80 kg" className={inputClass} />
              </Field>
            </>
          )}

          {/* Photos — tous les cas */}
          <div className="grid gap-2 rounded-lg border border-dr-tri-border bg-dr-tri-background p-4">
            <span className="text-sm font-medium text-dr-tri-dark">Photos (optionnel)</span>
            <p className="text-xs text-dr-tri-muted">
              {isTransport
                ? "Photos des objets ou de l'espace pour mieux estimer."
                : isDemenagement
                  ? "Photos du logement pour faciliter l'estimation."
                  : "Photos de l'objet pour mieux estimer votre demande."}
              {" "}Max. {MAX_FILES} fichiers.
            </p>
            <input ref={fileInputRef} type="file" name="attachments" accept="image/*,.pdf" multiple
              className="block w-full text-sm text-dr-tri-muted file:mr-3 file:rounded file:border-0 file:bg-dr-tri-primary file:px-4 file:py-2 file:text-white" />
          </div>

          <NavButtons disableNext={false} />
        </section>
      )}

      {/* ── Step 3 — Adresse de départ / récupération ────────────────────────── */}
      {step === 3 && (
        <section className="card grid gap-5" aria-labelledby="s3-title">
          <div>
            <h2 id="s3-title" className="text-lg font-semibold text-dr-tri-dark">{ctx.step3}</h2>
            <p className="mt-1 text-sm text-dr-tri-muted">{ctx.step3Sub}</p>
          </div>
          <AddressForm value={form.recup} onChange={(v) => set("recup", v)}
            showCreneau={isLivraison}
            creneauValue={form.creneau}
            onCreneauChange={(v) => set("creneau", v)} />
          <NavButtons disableNext={!canNext[3]} />
        </section>
      )}

      {/* ── Step 4 — Adresse d'arrivée / livraison ───────────────────────────── */}
      {step === 4 && (
        <section className="card grid gap-5" aria-labelledby="s4-title">
          <div>
            <h2 id="s4-title" className="text-lg font-semibold text-dr-tri-dark">{ctx.step4}</h2>
            <p className="mt-1 text-sm text-dr-tri-muted">{ctx.step4Sub}</p>
          </div>
          <AddressForm value={form.depot} onChange={(v) => set("depot", v)} />
          <NavButtons disableNext={!canNext[4]} />
        </section>
      )}

      {/* ── Step 5 — Options + Date ───────────────────────────────────────────── */}
      {step === 5 && (
        <section className="card grid gap-6" aria-labelledby="s5-title">
          <h2 id="s5-title" className="text-lg font-semibold text-dr-tri-dark">Options & date</h2>

          <div className="grid gap-3">
            <p className="text-sm font-medium text-dr-tri-dark">Services supplémentaires</p>
            <p className="text-xs text-dr-tri-muted">Ces options seront intégrées au devis.</p>

            {isLivraison && OPTIONS_LIVRAISON.map(({ key, label, hint }) => (
              <OptionCard key={key} checked={form[key] as boolean}
                onChange={(v) => set(key, v)} label={label} hint={hint} />
            ))}

            {isTransport && OPTIONS_TRANSPORT.map(({ key, label, hint }) => (
              <OptionCard key={key} checked={form[key] as boolean}
                onChange={(v) => set(key, v)} label={label} hint={hint} />
            ))}

            {isDemenagement && OPTIONS_DEMENAGEMENT.map(({ key, label, hint }) => (
              <OptionCard key={key} checked={form[key] as boolean}
                onChange={(v) => set(key, v)} label={label} hint={hint} />
            ))}
          </div>

          <div className="grid gap-3 border-t border-dr-tri-border pt-4">
            <p className="text-sm font-medium text-dr-tri-dark">
              {isDemenagement ? "Dates souhaitées" : "Date souhaitée"}
            </p>
            {isDemenagement ? (
              <div className="grid gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Date de départ (libération)">
                    <input type="date" value={form.date_souhaitee}
                      onChange={(e) => set("date_souhaitee", e.target.value)} className={inputClass} />
                  </Field>
                  <Field label="Date d'arrivée (emménagement)">
                    <input type="date" value={form.date_arrivee}
                      onChange={(e) => set("date_arrivee", e.target.value)} className={inputClass} />
                  </Field>
                </div>
                <p className="text-xs text-dr-tri-muted">
                  Si les deux dates sont identiques ou proches, nous prévoirons le déménagement en une seule journée.
                </p>
                <Field label="Créneau préféré">
                  <SelectField value={form.creneau} onChange={(v) => set("creneau", v)} options={CRENEAUX} />
                </Field>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Date">
                  <input type="date" value={form.date_souhaitee}
                    onChange={(e) => set("date_souhaitee", e.target.value)} className={inputClass} />
                </Field>
                <Field label="Créneau">
                  <SelectField value={form.creneau} onChange={(v) => set("creneau", v)} options={CRENEAUX} />
                </Field>
              </div>
            )}
          </div>

          <NavButtons disableNext={false} />
        </section>
      )}

      {/* ── Step 6 — Résumé ───────────────────────────────────────────────────── */}
      {step === 6 && (
        <section className="card grid gap-5" aria-labelledby="s6-title">
          <h2 id="s6-title" className="text-lg font-semibold text-dr-tri-dark">Résumé de votre demande</h2>

          <SummaryBlock title="Prestation">
            <SummaryRow label="Type" value={TRANSPORT_TYPES.find((t) => t.value === tt)?.label} />
          </SummaryBlock>

          {/* Objet — livraison */}
          {isLivraison && (
            <SummaryBlock title="Objet">
              <SummaryRow label="Type" value={OBJECT_TYPES.find((o) => o.value === form.object_type)?.label} />
              <SummaryRow label="Taille" value={TAILLES.find((t) => t.value === form.taille)?.label} />
              <SummaryRow label="Poids" value={POIDS.find((p) => p.value === form.poids)?.label} />
              <SummaryRow label="Fragile" value={form.fragile} />
              <SummaryRow label="Nombre" value={form.nb_objets} />
            </SummaryBlock>
          )}

          {/* Objet — transport */}
          {isTransport && (
            <SummaryBlock title="Objets à transporter">
              {form.objets_liste && (
                <div className="text-sm">
                  <span className="font-medium text-dr-tri-muted">Liste :</span>
                  <p className="mt-1 whitespace-pre-line text-dr-tri-dark">{form.objets_liste}</p>
                </div>
              )}
              <SummaryRow label="Plus encombrant" value={TAILLES.find((t) => t.value === form.taille_plus_grand)?.label} />
              <SummaryRow label="Plus lourd" value={POIDS.find((p) => p.value === form.poids_plus_lourd)?.label} />
              <SummaryRow label="Fragile" value={form.fragile_items ? "Oui, certains objets sont fragiles" : undefined} />
            </SummaryBlock>
          )}

          {/* Objet — déménagement */}
          {isDemenagement && (
            <SummaryBlock title="Logement">
              <SummaryRow label="Type" value={TYPE_LOGEMENT.find((t) => t.value === form.type_logement)?.label} />
              <SummaryRow label="Encombrement" value={ENCOMBREMENT.find((e) => e.value === form.encombrement)?.label} />
              <SummaryRow label="Volume estimé" value={VOLUME_DEMENAGEMENT.find((v) => v.value === form.volume_demenagement)?.label} />
              <SummaryRow label="Objets particuliers" value={form.objets_particuliers} />
            </SummaryBlock>
          )}

          <SummaryBlock title={ctx.step3}>
            <SummaryRow label="Adresse" value={[form.recup.adresse, [form.recup.cp, form.recup.ville].filter(Boolean).join(" ")].filter(Boolean).join(", ")} />
            <SummaryRow label="Étage" value={form.recup.etage} />
            <SummaryRow label="Ascenseur" value={form.recup.ascenseur} />
            <SummaryRow label="Parking" value={DISTANCE_PARKING.find((o) => o.value === form.recup.distance_parking)?.label} />
            <SummaryRow label="Accès camion" value={ACCES_CAMION.find((o) => o.value === form.recup.acces_camion)?.label} />
            <SummaryRow label="Notes" value={form.recup.notes} />
          </SummaryBlock>

          <SummaryBlock title={ctx.step4}>
            <SummaryRow label="Adresse" value={[form.depot.adresse, [form.depot.cp, form.depot.ville].filter(Boolean).join(" ")].filter(Boolean).join(", ")} />
            <SummaryRow label="Étage" value={form.depot.etage} />
            <SummaryRow label="Ascenseur" value={form.depot.ascenseur} />
            <SummaryRow label="Parking" value={DISTANCE_PARKING.find((o) => o.value === form.depot.distance_parking)?.label} />
            <SummaryRow label="Accès camion" value={ACCES_CAMION.find((o) => o.value === form.depot.acces_camion)?.label} />
            <SummaryRow label="Notes" value={form.depot.notes} />
          </SummaryBlock>

          {(() => {
            const opts = isLivraison
              ? [
                  form.opt_assemblage && "Assemblage / montage",
                  form.opt_montage_meuble && "Montage meuble",
                  form.opt_reprise_ancien && "Reprise de l'ancien objet",
                  form.opt_evacuation_emballages && "Évacuation des emballages",
                ]
              : isTransport
                ? [
                    form.opt_demontage && "Démontage avant transport",
                    form.opt_remontage && "Remontage à destination",
                    form.opt_protection_meubles && "Protection / emballage meubles",
                    form.opt_reprise_ancien && "Reprise d'anciens objets",
                  ]
                : [
                    form.opt_demontage && "Démontage & remontage complet",
                    form.opt_emballage_pro && "Emballage professionnel",
                    form.opt_garde_meuble && "Garde-meuble temporaire",
                    form.opt_nettoyage && "Nettoyage logement départ",
                  ]
            const selected = opts.filter(Boolean).join(", ")
            return selected ? (
              <SummaryBlock title="Options">
                <SummaryRow label="Services demandés" value={selected} />
              </SummaryBlock>
            ) : null
          })()}

          {(form.date_souhaitee || form.date_arrivee || form.creneau) && (
            <SummaryBlock title={isDemenagement ? "Dates souhaitées" : "Date souhaitée"}>
              <SummaryRow
                label={isDemenagement ? "Date de départ" : "Date"}
                value={form.date_souhaitee
                  ? new Date(form.date_souhaitee).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
                  : undefined}
              />
              {isDemenagement && (
                <SummaryRow
                  label="Date d'arrivée"
                  value={form.date_arrivee
                    ? new Date(form.date_arrivee).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
                    : undefined}
                />
              )}
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
