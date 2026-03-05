import Link from "next/link"
import { redirect } from "next/navigation"
import { requireUser } from "@/lib/auth"
import { getRecyclingPricingConfig, getRecyclingSubscription } from "@/lib/recycling"
import { ManageRecyclingForms } from "@/components/recycling/ManageRecyclingForms"

export default async function RecyclingManagePage() {
  const user = await requireUser()
  const [subscription, pricingConfig] = await Promise.all([
    getRecyclingSubscription(user.id),
    getRecyclingPricingConfig(),
  ])
  if (!subscription) redirect("/app/recycling")

  return (
    <main className="grid gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-dr-tri-border pb-4">
        <h1 className="text-xl font-bold text-dr-tri-dark">Gérer mon abonnement recyclage</h1>
        <Link href="/app/recycling" className="text-sm font-medium text-dr-tri-primary hover:underline">
          ← Retour au recyclage
        </Link>
      </header>

      <ManageRecyclingForms
        pricingConfig={pricingConfig}
        subscription={{
          id: subscription.id,
          passes_per_month: subscription.passes_per_month,
          bins_count: subscription.bins_count,
          large_bins_count: subscription.large_bins_count,
          price_cents: subscription.price_cents ?? undefined,
          status: subscription.status,
          paused_from: subscription.paused_from ?? undefined,
          paused_until: subscription.paused_until ?? undefined,
        }}
      />
    </main>
  )
}
