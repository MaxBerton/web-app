"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createRecyclingSubscriptionAction } from "@/app/(app)/app/recycling/actions"
import {
  getPassesOptions,
  getPassesOptionsFromConfig,
  computePriceCents,
  computePriceCentsFromConfig,
  type RecyclingPricingConfig,
} from "@/lib/recycling-pricing"

const MIN_BINS = 1
const MAX_BINS = 20
const DEFAULT_BINS = 6

type SubscribeRecyclingFormProps = {
  pricingConfig?: RecyclingPricingConfig
}

export function SubscribeRecyclingForm({ pricingConfig }: SubscribeRecyclingFormProps) {
  const router = useRouter()
  const [passesPerMonth, setPassesPerMonth] = useState(2)
  const [binsCount, setBinsCount] = useState(DEFAULT_BINS)
  const [largeBinsCount, setLargeBinsCount] = useState(0)
  const [replaceWithLarge, setReplaceWithLarge] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const options = pricingConfig ? getPassesOptionsFromConfig(pricingConfig) : getPassesOptions()
  const effectiveLarge = replaceWithLarge ? Math.min(largeBinsCount, binsCount) : largeBinsCount
  const priceCents = pricingConfig
    ? computePriceCentsFromConfig(pricingConfig, passesPerMonth, binsCount, effectiveLarge)
    : computePriceCents(passesPerMonth, binsCount, effectiveLarge)
  const prixFrancs = priceCents / 100
  const priceFormatted = prixFrancs % 1 === 0 ? String(prixFrancs) : prixFrancs.toFixed(2)

  const selectedOption = options.find((o) => o.value === passesPerMonth)
  const frequencyLabel = selectedOption?.label ?? "2 passages / mois"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    const fd = new FormData()
    fd.set("passes_per_month", String(passesPerMonth))
    fd.set("bins_count", String(binsCount))
    fd.set("large_bins_count", String(replaceWithLarge ? Math.min(largeBinsCount, binsCount) : 0))
    const result = await createRecyclingSubscriptionAction(fd)
    setIsSubmitting(false)
    if (result?.error) {
      setError(result.error)
      return
    }
    router.push("/app/recycling")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <p className="text-dr-tri-muted">
        Choisissez la fréquence de passage et la quantité de bacs.
      </p>

      {/* Sélection fréquence */}
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-dr-tri-dark">Sélection fréquence</legend>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {options.map((opt) => (
            <label
              key={opt.value}
              className={`cursor-pointer rounded-dr-tri border-2 p-4 text-center transition-colors ${
                passesPerMonth === opt.value
                  ? "border-dr-tri-primary bg-dr-tri-light-green"
                  : "border-dr-tri-border bg-white hover:border-dr-tri-primary/50"
              }`}
            >
              <input
                type="radio"
                name="passes_per_month"
                value={opt.value}
                checked={passesPerMonth === opt.value}
                onChange={() => setPassesPerMonth(opt.value)}
                className="sr-only"
              />
              <span className="block font-semibold text-dr-tri-dark">{opt.label}</span>
              <span className="mt-1 block text-sm text-dr-tri-muted">{(opt.priceCents / 100).toFixed(0)} CHF</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Nombre de bacs */}
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-dr-tri-dark">Sélection bacs</legend>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-dr-tri border border-dr-tri-border bg-white px-3 py-2">
            <button
              type="button"
              onClick={() => setBinsCount((c) => Math.max(MIN_BINS, c - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-dr-tri-border text-dr-tri-dark hover:bg-dr-tri-light-green"
              aria-label="Moins de bacs"
            >
              −
            </button>
            <span className="min-w-[2rem] text-center font-semibold">{binsCount}</span>
            <button
              type="button"
              onClick={() => setBinsCount((c) => Math.min(MAX_BINS, c + 1))}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-dr-tri-border text-dr-tri-dark hover:bg-dr-tri-light-green"
              aria-label="Plus de bacs"
            >
              +
            </button>
          </div>
          <span className="text-sm text-dr-tri-muted">bacs (par défaut 6)</span>
        </div>
        <p className="mt-2 text-xs text-dr-tri-muted">
          P&apos;tit bac — 37L · Grand bac — 60L
        </p>
      </fieldset>

      {/* Option grands bacs */}
      <label className="flex cursor-pointer items-start gap-3 rounded-dr-tri border border-dr-tri-border bg-white p-4">
        <input
          type="checkbox"
          checked={replaceWithLarge}
          onChange={(e) => {
            setReplaceWithLarge(e.target.checked)
            if (!e.target.checked) setLargeBinsCount(0)
          }}
          className="mt-1 h-4 w-4 rounded border-dr-tri-border text-dr-tri-primary"
        />
        <span className="text-sm text-dr-tri-dark">
          Remplacer certains bacs par des grands bacs (+2 CHF / grand bac)
        </span>
      </label>
      {replaceWithLarge && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-dr-tri-muted">Nombre de grands bacs :</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setLargeBinsCount((c) => Math.max(0, c - 1))}
              className="flex h-8 w-8 items-center justify-center rounded border border-dr-tri-border text-dr-tri-dark hover:bg-dr-tri-light-green"
            >
              −
            </button>
            <span className="min-w-[2rem] text-center font-semibold">{largeBinsCount}</span>
            <button
              type="button"
              onClick={() => setLargeBinsCount((c) => Math.min(binsCount, c + 1))}
              className="flex h-8 w-8 items-center justify-center rounded border border-dr-tri-border text-dr-tri-dark hover:bg-dr-tri-light-green"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Résumé */}
      <div className="card rounded-dr-tri-lg border-2 border-dr-tri-primary/20 bg-dr-tri-light-green/30 p-4">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-dr-tri-muted">Résumé</h3>
        <ul className="space-y-1 text-sm text-dr-tri-dark">
          <li><strong>Fréquence :</strong> {frequencyLabel}</li>
          <li>
            <strong>Bacs :</strong> {binsCount} p&apos;tits bacs
            {effectiveLarge > 0 && `, ${effectiveLarge} grands bacs`}
          </li>
          <li><strong>Total :</strong> {priceFormatted} CHF / mois</li>
        </ul>
      </div>

      {error && (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}

      <button type="submit" className="btn w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? "En cours…" : "Souscrire"}
      </button>
    </form>
  )
}
