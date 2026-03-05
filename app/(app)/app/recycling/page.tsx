import Link from "next/link"
import { requireUser } from "@/lib/auth"
import { getRecyclingPricingConfig, getRecyclingSubscription, getSubscriptionPickups } from "@/lib/recycling"
import { SubscribeRecyclingForm } from "@/components/recycling/SubscribeRecyclingForm"

export default async function RecyclingPage() {
  const user = await requireUser()
  const [subscription, pricingConfig] = await Promise.all([
    getRecyclingSubscription(user.id),
    getRecyclingPricingConfig(),
  ])
  const pickups = subscription ? await getSubscriptionPickups(subscription.id) : []

  if (!subscription) {
    return (
      <main className="grid gap-6">
        <header className="border-b border-dr-tri-border pb-4">
          <h1 className="text-xl font-bold text-dr-tri-dark">Gérer mon recyclage</h1>
        </header>
        <section className="card grid gap-6" aria-labelledby="subscribe-title">
          <h2 id="subscribe-title" className="text-lg font-semibold text-dr-tri-dark">
            Souscrire à un abonnement
          </h2>
          <SubscribeRecyclingForm pricingConfig={pricingConfig} />
        </section>
      </main>
    )
  }

  return (
    <main className="grid gap-6">
      <header className="border-b border-dr-tri-border pb-4">
        <h1 className="text-xl font-bold text-dr-tri-dark">Mon recyclage</h1>
      </header>

      {/* Carte abonnement */}
      <section className="card grid gap-4 sm:grid-cols-2" aria-labelledby="sub-card-title">
        <div>
          <h2 id="sub-card-title" className="mb-2 flex items-center gap-2">
            <span className="inline-flex rounded-full border px-2.5 py-0.5 text-sm font-medium bg-dr-tri-light-green text-dr-tri-primary border-dr-tri-border">
              Abonnement actif
            </span>
          </h2>
          <p className="text-lg font-semibold text-dr-tri-dark">
            {subscription.passes_per_month} passage{subscription.passes_per_month > 1 ? "s" : ""} / mois
          </p>
          <p className="text-dr-tri-muted">
            {subscription.bins_count} p&apos;tits bacs
            {subscription.large_bins_count > 0 && `, ${subscription.large_bins_count} grands bacs`}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-dr-tri-muted">
            Prochain passage
          </p>
          {subscription.next_pickup_date ? (
            <p className="text-lg font-semibold text-dr-tri-dark">
              {new Date(subscription.next_pickup_date).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
              })}
            </p>
          ) : (
            <p className="text-sm text-dr-tri-muted">Date à planifier</p>
          )}
        </div>
      </section>

      {/* Actions */}
      <section aria-labelledby="actions-title">
        <h2 id="actions-title" className="mb-3 text-sm font-semibold uppercase tracking-wide text-dr-tri-muted">
          Actions
        </h2>
        <div>
          <Link
            href="/app/recycling/manage"
            className="inline-flex items-center gap-3 rounded-dr-tri border border-dr-tri-border bg-white px-4 py-3 text-sm font-medium text-dr-tri-dark transition-shadow hover:shadow-md hover:border-dr-tri-primary"
          >
            Modifier l&apos;abonnement
          </Link>
        </div>
      </section>

      {/* Historique */}
      <section aria-labelledby="history-title">
        <h2 id="history-title" className="mb-3 text-sm font-semibold uppercase tracking-wide text-dr-tri-muted">
          Historique
        </h2>
        {pickups.length === 0 ? (
          <p className="text-sm text-dr-tri-muted">Aucune collecte enregistrée pour le moment.</p>
        ) : (
          <ul className="grid gap-2">
            {pickups.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-dr-tri border border-dr-tri-border bg-white px-4 py-3 text-sm"
              >
                <span className="font-medium text-dr-tri-dark">
                  {new Date(p.pickup_date).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                  })}
                </span>
                <span className="text-dr-tri-muted">
                  {p.completed_at ? "Collecte effectuée" : "Prévue"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
