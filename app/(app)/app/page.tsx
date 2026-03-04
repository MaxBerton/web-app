import Link from "next/link"
import { requireUser } from "@/lib/auth"
import { getClientRequests } from "@/lib/requests"
import {
  getClientProfile,
  getDashboardCounts,
  getClientNextAppointment,
} from "@/lib/dashboard"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { KpiCards } from "@/components/dashboard/KpiCards"
import { RecentRequestsList } from "@/components/dashboard/RecentRequestsList"
import { SupportCard } from "@/components/dashboard/SupportCard"

export default async function ClientDashboardPage() {
  const user = await requireUser()
  const [profile, requests] = await Promise.all([
    getClientProfile(user.id),
    getClientRequests(),
  ])

  const counts = getDashboardCounts(requests)
  const nextAppointment = await getClientNextAppointment(requests.map((r) => r.id))

  return (
    <main className="grid gap-4">
      <DashboardHeader firstName={profile?.first_name ?? null} />
      <KpiCards
        enCours={counts.enCours}
        terminees={counts.terminees}
        nextAppointment={nextAppointment}
      />

      {requests.length === 0 ? (
        <section className="card grid text-center">
          <h2 className="text-lg font-semibold text-dr-tri-dark">Aucune demande</h2>
          <p className="text-sm text-dr-tri-muted">
            Vous n&apos;avez pas encore de demande. Créez-en une pour commencer.
          </p>
          <Link href="/app/demandes/nouvelle" className="btn mx-auto mt-2 w-fit">
            Créer une demande
          </Link>
        </section>
      ) : (
        <RecentRequestsList requests={requests} />
      )}

      <SupportCard />
    </main>
  )
}
