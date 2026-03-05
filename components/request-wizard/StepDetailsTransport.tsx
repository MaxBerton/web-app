"use client"

import { MapboxAddressInput, type MapboxAddressValue } from "@/components/address/MapboxAddressInput"
import { inputClass, labelClass, type WizardDetails } from "./wizard-fields"

const TRANSPORT_TYPES = [
  { value: "livraison_simple", label: "Livraison simple" },
  { value: "transport_objets_meubles", label: "Transport d'objets / meubles" },
  { value: "demenagement_complet", label: "Déménagement complet" },
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

const OUI_NON = [
  { value: "oui", label: "Oui" },
  { value: "non", label: "Non" },
]

const CRENEAUX = [
  { value: "matin", label: "Matin" },
  { value: "aprem", label: "Après-midi" },
  { value: "journee", label: "Toute la journée" },
]

type LivraisonSimpleStep = 1 | 2 | 3 | 4 | 5 | 6

const LIVRAISON_SIMPLE_STEP_LABELS: Record<LivraisonSimpleStep, string> = {
  1: "Objet à livrer",
  2: "Adresse de récupération",
  3: "Adresse de livraison",
  4: "Options",
  5: "Date",
  6: "Résumé",
}

type Props = {
  details: WizardDetails
  onChange: (d: WizardDetails) => void
}

function update(details: WizardDetails, key: string, value: unknown): WizardDetails {
  return { ...details, [key]: value }
}

function getSubStep(details: WizardDetails): LivraisonSimpleStep {
  const v = details.livraison_simple_step as number | undefined
  if (v != null && v >= 1 && v <= 6) return v as LivraisonSimpleStep
  return 1
}

export function StepDetailsTransport({ details, onChange }: Props) {
  const transportType = (details.transport_type as string) || ""
  const isLivraisonSimple = transportType === "livraison_simple"
  const subStep = getSubStep(details)

  const setSubStep = (s: LivraisonSimpleStep) => onChange(update(details, "livraison_simple_step", s))

  // ——— CAS LIVRAISON SIMPLE : 6 sous-étapes ———
  if (isLivraisonSimple) {
    return (
      <div className="grid gap-6">
        <p className="text-sm text-dr-tri-muted">
          Précisez les informations pour votre livraison simple.
        </p>

        {/* Sous-stepper */}
        <nav aria-label="Étapes livraison simple" className="rounded-lg border border-dr-tri-border bg-dr-tri-background p-3">
          <ol className="flex flex-wrap gap-2" style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {( [1, 2, 3, 4, 5, 6] as const ).map((s) => {
              const isCurrent = subStep === s
              const isPast = subStep > s
              return (
                <li key={s} className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setSubStep(s)}
                    className={`flex h-7 min-w-[1.75rem] items-center justify-center rounded text-xs font-medium transition-colors ${
                      isCurrent
                        ? "bg-dr-tri-primary text-white"
                        : isPast
                          ? "bg-dr-tri-light-green text-dr-tri-primary hover:bg-dr-tri-primary hover:text-white"
                          : "bg-dr-tri-background text-dr-tri-muted"
                    }`}
                    aria-current={isCurrent ? "step" : undefined}
                  >
                    {s}
                  </button>
                  <span className={`text-xs ${isCurrent ? "font-medium text-dr-tri-dark" : "text-dr-tri-muted"}`}>
                    {LIVRAISON_SIMPLE_STEP_LABELS[s]}
                  </span>
                  {s < 6 && <span className="mx-0.5 text-dr-tri-muted">·</span>}
                </li>
              )
            })}
          </ol>
        </nav>

        {/* Step 1 — Objet à livrer */}
        {subStep === 1 && (
          <fieldset className="grid gap-4 rounded-lg border border-dr-tri-border bg-white p-4">
            <legend className="text-sm font-medium text-dr-tri-dark">
              Step 1 — Objet à livrer
            </legend>
            <label className={labelClass}>
              Type d&apos;objet
              <select
                value={(details.object_type as string) ?? ""}
                onChange={(e) => onChange(update(details, "object_type", e.target.value))}
                className={inputClass}
              >
                <option value="">— Choisir —</option>
                {OBJECT_TYPES.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
            <label className={labelClass}>
              Dimensions approximatives (L x l x h en cm)
              <input
                type="text"
                value={(details.dimensions_approx as string) ?? ""}
                onChange={(e) => onChange(update(details, "dimensions_approx", e.target.value))}
                placeholder="Ex. 200 x 80 x 50"
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Poids estimé (kg)
              <input
                type="text"
                value={(details.poids_estime as string) ?? ""}
                onChange={(e) => onChange(update(details, "poids_estime", e.target.value))}
                placeholder="Ex. 25"
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Fragile
              <select
                value={(details.fragile as string) ?? ""}
                onChange={(e) => onChange(update(details, "fragile", e.target.value))}
                className={inputClass}
              >
                <option value="">—</option>
                {OUI_NON.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
            <label className={labelClass}>
              Nombre d&apos;objets (optionnel)
              <input
                type="number"
                min={1}
                value={(details.nb_objets as number) ?? ""}
                onChange={(e) => onChange(update(details, "nb_objets", e.target.value === "" ? undefined : e.target.value))}
                className={inputClass}
              />
            </label>
            <div className="flex justify-end">
              <button type="button" className="btn" onClick={() => setSubStep(2)}>
                Suivant
              </button>
            </div>
          </fieldset>
        )}

        {/* Step 2 — Adresse de récupération */}
        {subStep === 2 && (
          <fieldset className="grid gap-4 rounded-lg border border-dr-tri-border bg-white p-4">
            <legend className="text-sm font-medium text-dr-tri-dark">
              Step 2 — Adresse de récupération
            </legend>
            <label className={labelClass}>
              Adresse
              <MapboxAddressInput
                value={{
                  street: (details.adresse_recup_street as string) ?? "",
                  postal_code: (details.adresse_recup_cp as string) ?? "",
                  city: (details.adresse_recup_ville as string) ?? "",
                  lat: (details.adresse_recup_lat as number) ?? null,
                  lng: (details.adresse_recup_lng as number) ?? null,
                }}
                onSelect={(v) => {
                  const line = [v.street, v.postal_code, v.city].filter(Boolean).join(", ")
                  const next = update(update(update(update(update(
                    update(details, "adresse_recup", line),
                    "adresse_recup_street", v.street),
                    "adresse_recup_cp", v.postal_code),
                    "adresse_recup_ville", v.city),
                    "adresse_recup_lat", v.lat),
                    "adresse_recup_lng", v.lng)
                  onChange(next)
                }}
                placeholder="Rechercher une adresse…"
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Étage
              <input
                type="text"
                value={(details.etage_recup as string) ?? ""}
                onChange={(e) => onChange(update(details, "etage_recup", e.target.value))}
                placeholder="Ex. RDC, 2e"
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Ascenseur
              <select
                value={(details.ascenseur_recup as string) ?? ""}
                onChange={(e) => onChange(update(details, "ascenseur_recup", e.target.value))}
                className={inputClass}
              >
                <option value="">—</option>
                {OUI_NON.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
            <label className={labelClass}>
              Parking possible
              <select
                value={(details.parking_recup as string) ?? ""}
                onChange={(e) => onChange(update(details, "parking_recup", e.target.value))}
                className={inputClass}
              >
                <option value="">—</option>
                {OUI_NON.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
            <label className={labelClass}>
              Créneau de récupération
              <select
                value={(details.creneau_recup as string) ?? ""}
                onChange={(e) => onChange(update(details, "creneau_recup", e.target.value))}
                className={inputClass}
              >
                <option value="">— Choisir —</option>
                {CRENEAUX.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
            <div className="flex justify-between">
              <button type="button" className="btn" onClick={() => setSubStep(1)}>
                Précédent
              </button>
              <button type="button" className="btn" onClick={() => setSubStep(3)}>
                Suivant
              </button>
            </div>
          </fieldset>
        )}

        {/* Step 3 — Adresse de livraison */}
        {subStep === 3 && (
          <fieldset className="grid gap-4 rounded-lg border border-dr-tri-border bg-white p-4">
            <legend className="text-sm font-medium text-dr-tri-dark">
              Step 3 — Adresse de livraison
            </legend>
            <label className={labelClass}>
              Adresse
              <MapboxAddressInput
                value={{
                  street: (details.adresse_livraison_street as string) ?? "",
                  postal_code: (details.adresse_livraison_cp as string) ?? "",
                  city: (details.adresse_livraison_ville as string) ?? "",
                  lat: (details.adresse_livraison_lat as number) ?? null,
                  lng: (details.adresse_livraison_lng as number) ?? null,
                }}
                onSelect={(v) => {
                  const line = [v.street, v.postal_code, v.city].filter(Boolean).join(", ")
                  const next = update(update(update(update(update(
                    update(details, "adresse_livraison", line),
                    "adresse_livraison_street", v.street),
                    "adresse_livraison_cp", v.postal_code),
                    "adresse_livraison_ville", v.city),
                    "adresse_livraison_lat", v.lat),
                    "adresse_livraison_lng", v.lng)
                  onChange(next)
                }}
                placeholder="Rechercher une adresse…"
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Étage
              <input
                type="text"
                value={(details.etage_livraison as string) ?? ""}
                onChange={(e) => onChange(update(details, "etage_livraison", e.target.value))}
                placeholder="Ex. RDC, 2e"
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Ascenseur
              <select
                value={(details.ascenseur_livraison as string) ?? ""}
                onChange={(e) => onChange(update(details, "ascenseur_livraison", e.target.value))}
                className={inputClass}
              >
                <option value="">—</option>
                {OUI_NON.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
            <label className={labelClass}>
              Parking possible
              <select
                value={(details.parking_livraison as string) ?? ""}
                onChange={(e) => onChange(update(details, "parking_livraison", e.target.value))}
                className={inputClass}
              >
                <option value="">—</option>
                {OUI_NON.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
            <div className="flex justify-between">
              <button type="button" className="btn" onClick={() => setSubStep(2)}>
                Précédent
              </button>
              <button type="button" className="btn" onClick={() => setSubStep(4)}>
                Suivant
              </button>
            </div>
          </fieldset>
        )}

        {/* Step 4 — Options */}
        {subStep === 4 && (
          <fieldset className="grid gap-4 rounded-lg border border-dr-tri-border bg-white p-4">
            <legend className="text-sm font-medium text-dr-tri-dark">
              Step 4 — Options
            </legend>
            <div className="grid gap-3">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(details.option_aide_monter)}
                  onChange={(e) => onChange(update(details, "option_aide_monter", e.target.checked))}
                  className="h-4 w-4 rounded border-dr-tri-border"
                />
                <span className="text-sm text-dr-tri-dark">Aide à monter l&apos;objet</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(details.option_montage_meuble)}
                  onChange={(e) => onChange(update(details, "option_montage_meuble", e.target.checked))}
                  className="h-4 w-4 rounded border-dr-tri-border"
                />
                <span className="text-sm text-dr-tri-dark">Montage meuble</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(details.option_reprise_ancien)}
                  onChange={(e) => onChange(update(details, "option_reprise_ancien", e.target.checked))}
                  className="h-4 w-4 rounded border-dr-tri-border"
                />
                <span className="text-sm text-dr-tri-dark">Reprise ancien objet</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(details.option_emballage)}
                  onChange={(e) => onChange(update(details, "option_emballage", e.target.checked))}
                  className="h-4 w-4 rounded border-dr-tri-border"
                />
                <span className="text-sm text-dr-tri-dark">Emballage</span>
              </label>
            </div>
            <div className="flex justify-between">
              <button type="button" className="btn" onClick={() => setSubStep(3)}>
                Précédent
              </button>
              <button type="button" className="btn" onClick={() => setSubStep(5)}>
                Suivant
              </button>
            </div>
          </fieldset>
        )}

        {/* Step 5 — Date */}
        {subStep === 5 && (
          <fieldset className="grid gap-4 rounded-lg border border-dr-tri-border bg-white p-4">
            <legend className="text-sm font-medium text-dr-tri-dark">
              Step 5 — Date
            </legend>
            <label className={labelClass}>
              Date souhaitée
              <input
                type="date"
                value={(details.date_souhaitee as string) ?? ""}
                onChange={(e) => onChange(update(details, "date_souhaitee", e.target.value))}
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Créneau
              <select
                value={(details.creneau_livraison as string) ?? ""}
                onChange={(e) => onChange(update(details, "creneau_livraison", e.target.value))}
                className={inputClass}
              >
                <option value="">— Choisir —</option>
                {CRENEAUX.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
            <div className="flex justify-between">
              <button type="button" className="btn" onClick={() => setSubStep(4)}>
                Précédent
              </button>
              <button type="button" className="btn" onClick={() => setSubStep(6)}>
                Suivant
              </button>
            </div>
          </fieldset>
        )}

        {/* Step 6 — Résumé */}
        {subStep === 6 && (
          <fieldset className="grid gap-4 rounded-lg border border-dr-tri-border bg-white p-4">
            <legend className="text-sm font-medium text-dr-tri-dark">
              Step 6 — Résumé
            </legend>
            <div className="grid gap-4 text-sm">
              <div>
                <span className="font-medium text-dr-tri-muted">Objet : </span>
                <span className="text-dr-tri-dark">
                  {OBJECT_TYPES.find((o) => o.value === details.object_type)?.label ?? ((details.object_type as string) || "—")}
                  {(details.dimensions_approx as string) && ` · ${details.dimensions_approx}`}
                  {(details.poids_estime as string) && ` · ${details.poids_estime} kg`}
                  {(details.fragile as string) && ` · Fragile : ${details.fragile}`}
                  {(details.nb_objets as number) && ` · ${details.nb_objets} objet(s)`}
                </span>
              </div>
              <div>
                <span className="font-medium text-dr-tri-muted">Récupération : </span>
                <span className="text-dr-tri-dark">
                  {(details.adresse_recup as string) || "—"}
                  {(details.etage_recup as string) && ` · Étage ${details.etage_recup}`}
                  {(details.ascenseur_recup as string) && ` · Ascenseur ${details.ascenseur_recup}`}
                  {(details.parking_recup as string) && ` · Parking ${details.parking_recup}`}
                  {(details.creneau_recup as string) && ` · Créneau ${CRENEAUX.find((c) => c.value === details.creneau_recup)?.label ?? details.creneau_recup}`}
                </span>
              </div>
              <div>
                <span className="font-medium text-dr-tri-muted">Livraison : </span>
                <span className="text-dr-tri-dark">
                  {(details.adresse_livraison as string) || "—"}
                  {(details.etage_livraison as string) && ` · Étage ${details.etage_livraison}`}
                  {(details.ascenseur_livraison as string) && ` · Ascenseur ${details.ascenseur_livraison}`}
                  {(details.parking_livraison as string) && ` · Parking ${details.parking_livraison}`}
                </span>
              </div>
              <div>
                <span className="font-medium text-dr-tri-muted">Options : </span>
                <span className="text-dr-tri-dark">
                  {[
                    details.option_aide_monter && "Aide à monter",
                    details.option_montage_meuble && "Montage meuble",
                    details.option_reprise_ancien && "Reprise ancien",
                    details.option_emballage && "Emballage",
                  ].filter(Boolean).join(", ") || "Aucune"}
                </span>
              </div>
              <div>
                <span className="font-medium text-dr-tri-muted">Date : </span>
                <span className="text-dr-tri-dark">
                  {(details.date_souhaitee as string) || "—"}
                  {(details.creneau_livraison as string) && ` · ${CRENEAUX.find((c) => c.value === details.creneau_livraison)?.label ?? details.creneau_livraison}`}
                </span>
              </div>
            </div>
            <p className="text-sm text-dr-tri-muted">
              Passez à l&apos;étape suivante pour compléter le lieu et les disponibilités, puis envoyez la demande.
            </p>
            <div className="flex justify-between">
              <button type="button" className="btn" onClick={() => setSubStep(5)}>
                Précédent
              </button>
              {/* Pas de CTA "Envoyer" ici : le wizard principal garde le bouton sur l'étape 4 */}
            </div>
          </fieldset>
        )}
      </div>
    )
  }

  // ——— CAS AUTRES PRESTATIONS : formulaire actuel (type d'objet à déplacer) ———
  return (
    <div className="grid gap-6">
      <p className="text-sm text-dr-tri-muted">
        Précisez le type de prestation et les objets à déplacer.
      </p>

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
    </div>
  )
}
