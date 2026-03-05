"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  updateRecyclingSubscriptionAction,
  suspendRecyclingSubscriptionAction,
  cancelRecyclingSuspensionAction,
} from "@/app/(app)/app/recycling/actions"
import {
  getPassesOptions,
  getPassesOptionsFromConfig,
  computePriceCents,
  computePriceCentsFromConfig,
  type RecyclingPricingConfig,
} from "@/lib/recycling-pricing"

/**
 * Affiche le prix en francs (CHF).
 * Accepte une valeur en centimes (ex. 2000 → 20 CHF) ou en francs si valeur < 100 (données anciennes).
 */
function formatPrixFrancs(value: number | null | undefined): string {
  const num = Number(value)
  if (!Number.isFinite(num) || num < 0) return "— CHF"
  const francs = num >= 100 ? num / 100 : num
  return francs % 1 === 0 ? `${francs} CHF` : `${francs.toFixed(2)} CHF`
}

type Subscription = {
  id: string
  passes_per_month: number
  bins_count: number
  large_bins_count: number
  price_cents?: number | null
  status?: string
  paused_from?: string | null
  paused_until?: string | null
}

type ManageRecyclingFormsProps = {
  subscription: Subscription
  pricingConfig?: RecyclingPricingConfig
}

export function ManageRecyclingForms({ subscription, pricingConfig }: ManageRecyclingFormsProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [modifyPasses, setModifyPasses] = useState(subscription.passes_per_month)
  const [modifyBins, setModifyBins] = useState(subscription.bins_count)
  const [modifyLargeBins, setModifyLargeBins] = useState(subscription.large_bins_count)

  const options = pricingConfig ? getPassesOptionsFromConfig(pricingConfig) : getPassesOptions()
  const currentPriceCents =
    subscription.price_cents ??
    (pricingConfig
      ? computePriceCentsFromConfig(
          pricingConfig,
          subscription.passes_per_month,
          subscription.bins_count,
          subscription.large_bins_count
        )
      : computePriceCents(
          subscription.passes_per_month,
          subscription.bins_count,
          subscription.large_bins_count
        ))
  const newPriceCents = useMemo(() => {
    if (pricingConfig) return computePriceCentsFromConfig(pricingConfig, modifyPasses, modifyBins, modifyLargeBins)
    return computePriceCents(modifyPasses, modifyBins, modifyLargeBins)
  }, [modifyPasses, modifyBins, modifyLargeBins, pricingConfig])
  const currentPassesLabel =
    options.find((o) => o.value === subscription.passes_per_month)?.label ?? `${subscription.passes_per_month} passage(s) / mois`

  return (
    <div className="grid gap-8">
      {error && (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          {success}
        </p>
      )}

      {/* Mon Abonnement Actuel */}
      <section className="card grid gap-4" aria-labelledby="current-title">
        <h2 id="current-title" className="text-lg font-semibold text-dr-tri-dark">
          Mon abonnement actuel
        </h2>
        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-dr-tri-muted">Passages par mois</dt>
            <dd className="mt-0.5 text-base font-medium text-dr-tri-dark">{currentPassesLabel}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-dr-tri-muted">P&apos;tits bacs (37L)</dt>
            <dd className="mt-0.5 text-base font-medium text-dr-tri-dark">{subscription.bins_count}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-dr-tri-muted">Grands bacs (60L)</dt>
            <dd className="mt-0.5 text-base font-medium text-dr-tri-dark">{subscription.large_bins_count}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-dr-tri-muted">Nombre total de bacs</dt>
            <dd className="mt-0.5 text-base font-medium text-dr-tri-dark">
              {subscription.bins_count + subscription.large_bins_count}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-dr-tri-muted">Tarif (francs / mois)</dt>
            <dd className="mt-0.5 text-base font-semibold text-dr-tri-dark">
              {formatPrixFrancs(currentPriceCents)} / mois
            </dd>
          </div>
        </dl>
        {(subscription.status === "paused" && (subscription.paused_from || subscription.paused_until)) && (
          <div className="mt-2 rounded-dr-tri border border-amber-200 bg-amber-50 p-3">
            <p className="text-sm font-medium text-dr-tri-dark">Suspension en cours</p>
            <p className="mt-1 text-sm text-dr-tri-muted">
              {subscription.paused_from && (
                <span>Suspendu à partir du {new Date(subscription.paused_from + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
              )}
              {subscription.paused_from && subscription.paused_until && " — "}
              {subscription.paused_until ? (
                <span>Reprise le {new Date(subscription.paused_until + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
              ) : subscription.paused_from ? (
                <span>Reprise non définie</span>
              ) : null}
            </p>
            <p className="mt-1 text-xs text-dr-tri-muted">Vous pouvez modifier ces dates dans la section « Suspendre le service » ci-dessous.</p>
            <form
              action={async () => {
                setError(null)
                setSuccess(null)
                const result = await cancelRecyclingSuspensionAction(subscription.id)
                if (result?.error) {
                  setError(result.error)
                  return
                }
                setSuccess("Suspension annulée. Le service est de nouveau actif.")
                router.refresh()
              }}
              className="mt-3"
            >
              <button type="submit" className="text-sm font-medium text-dr-tri-primary hover:underline">
                Annuler la suspension
              </button>
            </form>
          </div>
        )}
      </section>

      {/* Modifier l'abonnement */}
      <section className="card grid gap-4" aria-labelledby="modify-title">
        <h2 id="modify-title" className="text-lg font-semibold text-dr-tri-dark">
          Modifier l&apos;abonnement
        </h2>
        <form
          action={async (fd: FormData) => {
            setError(null)
            setSuccess(null)
            const result = await updateRecyclingSubscriptionAction(subscription.id, fd)
            if (result?.error) {
              setError(result.error)
              return
            }
            setSuccess("Abonnement mis à jour.")
            router.refresh()
          }}
          className="grid gap-4"
        >
          <div>
            <p className="mb-2 text-sm font-medium text-dr-tri-dark">Fréquence</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {options.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer flex-col rounded-dr-tri border-2 p-3 text-center text-sm ${
                    modifyPasses === opt.value
                      ? "border-dr-tri-primary bg-dr-tri-light-green"
                      : "border-dr-tri-border bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="passes_per_month"
                    value={opt.value}
                    checked={modifyPasses === opt.value}
                    onChange={() => setModifyPasses(opt.value)}
                    className="sr-only"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-dr-tri-dark">
              Nombre de p&apos;tits bacs
            </label>
            <input
              type="number"
              name="bins_count"
              min={1}
              max={20}
              value={modifyBins}
              onChange={(e) => setModifyBins(Number(e.target.value) || 1)}
              className="w-full max-w-[8rem] rounded-dr-tri border border-dr-tri-border px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-dr-tri-dark">
              Nombre de grands bacs (+2 CHF / bac)
            </label>
            <input
              type="number"
              name="large_bins_count"
              min={0}
              max={20}
              value={modifyLargeBins}
              onChange={(e) => setModifyLargeBins(Math.max(0, Number(e.target.value) || 0))}
              className="w-full max-w-[8rem] rounded-dr-tri border border-dr-tri-border px-3 py-2"
            />
          </div>
          {(modifyPasses !== subscription.passes_per_month ||
            modifyBins !== subscription.bins_count ||
            modifyLargeBins !== subscription.large_bins_count) && (
            <p className="rounded-dr-tri border border-dr-tri-border bg-dr-tri-light-green/30 px-3 py-2 text-sm font-semibold text-dr-tri-dark">
              Nouveau tarif : {formatPrixFrancs(newPriceCents)} / mois
              {newPriceCents !== currentPriceCents && (
                <span className="ml-2 font-normal text-dr-tri-muted">
                  (actuel : {formatPrixFrancs(currentPriceCents)})
                </span>
              )}
            </p>
          )}
          <button type="submit" className="btn w-fit">
            Enregistrer les modifications
          </button>
        </form>
      </section>

      {/* Suspendre le service */}
      <section className="card grid gap-4" aria-labelledby="suspend-title">
        <h2 id="suspend-title" className="text-lg font-semibold text-dr-tri-dark">
          Suspendre le service
        </h2>
        <p className="text-sm text-dr-tri-muted">
          {subscription.status === "paused" && (subscription.paused_from || subscription.paused_until)
            ? "Modifiez les dates de suspension ci-dessous si besoin, puis enregistrez."
            : "Indiquez à partir de quelle date suspendre la collecte et, si vous le souhaitez, à quelle date reprendre. Sans date de reprise, le prochain passage restera à planifier."}
        </p>
        <form
          action={async (fd: FormData) => {
            setError(null)
            setSuccess(null)
            const result = await suspendRecyclingSubscriptionAction(subscription.id, fd)
            if (result?.error) {
              setError(result.error)
              return
            }
            setSuccess("Service suspendu selon les dates indiquées. Le prochain passage a été mis à jour.")
            router.refresh()
          }}
          className="flex flex-wrap items-end gap-4"
        >
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-dr-tri-dark">Suspendre à partir du</span>
            <input
              type="date"
              name="paused_from"
              required
              min={new Date().toISOString().slice(0, 10)}
              defaultValue={subscription.paused_from ?? undefined}
              className="rounded-dr-tri border border-dr-tri-border px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-dr-tri-dark">Reprendre le (optionnel)</span>
            <input
              type="date"
              name="paused_until"
              defaultValue={subscription.paused_until ?? undefined}
              className="rounded-dr-tri border border-dr-tri-border px-3 py-2"
            />
          </label>
          <button type="submit" className="btn">
            {subscription.status === "paused" ? "Mettre à jour la suspension" : "Suspendre"}
          </button>
        </form>
      </section>
    </div>
  )
}
