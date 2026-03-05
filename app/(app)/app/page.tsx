import Link from "next/link"
import { requireUser } from "@/lib/auth"
import { getClientRequests } from "@/lib/requests"
import {
  getClientProfile,
  getDashboardCounts,
  getClientNextAppointment,
} from "@/lib/dashboard"
import { getRecyclingSubscription } from "@/lib/recycling"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { KpiCards } from "@/components/dashboard/KpiCards"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { RecentRequestsList } from "@/components/dashboard/RecentRequestsList"
import { SupportCard } from "@/components/dashboard/SupportCard"

export default async function ClientDashboardPage() {
  const user = await requireUser()
  const [profile, requests, recyclingSubscription] = await Promise.all([
    getClientProfile(user.id),
    getClientRequests(),
    getRecyclingSubscription(user.id),
  ])

  const counts = getDashboardCounts(requests)
  const nextAppointment = await getClientNextAppointment(requests.map((r) => r.id))
  const nextRecyclingPickup = recyclingSubscription?.next_pickup_date ?? null
  const activeRequests = requests.filter(
    (r) => !["done", "invoiced", "paid", "canceled"].includes(r.status)
  )

  return (
    <main className="grid gap-6">
      <DashboardHeader firstName={profile?.first_name ?? null} />

      <QuickActions />

      <KpiCards
        enCours={counts.enCours}
        terminees={counts.terminees}
        nextAppointment={nextAppointment}
        nextRecyclingPickup={nextRecyclingPickup}
      />

      {activeRequests.length === 0 ? (
        <section className="card grid text-center">
          <h2 className="text-lg font-semibold text-dr-tri-dark">Aucune demande en cours</h2>
          <p className="text-sm text-dr-tri-muted">
            Vous n&apos;avez pas encore de demande. Créez-en une pour commencer.
          </p>
          <Link href="/app/demandes/nouvelle" className="btn mx-auto mt-2 w-fit">
            Créer une demande
          </Link>
        </section>
      ) : (
        <RecentRequestsList requests={activeRequests} />
      )}

      <SupportCard />
    </main>
  )
}
