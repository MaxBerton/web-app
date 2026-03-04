import Link from "next/link"
import { getClientRequestsFiltered } from "@/lib/requests"
import { RequestsFilters } from "@/components/dashboard/RequestsFilters"
import { RequestsTable } from "@/components/dashboard/RequestsTable"
import { RequestsCards } from "@/components/dashboard/RequestsCards"
import { RequestsPagination } from "@/components/dashboard/RequestsPagination"

const PAGE_SIZE = 20

type DemandesPageProps = {
  searchParams: Promise<{
    status?: string
    service?: string
    q?: string
    page?: string
  }>
}

export default async function ClientDemandesPage({ searchParams }: DemandesPageProps) {
  const params = await searchParams
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1)
  const status = params.status ?? ""
  const service = params.service ?? ""
  const q = params.q ?? ""

  const { data: requests, total } = await getClientRequestsFiltered({
    page,
    pageSize: PAGE_SIZE,
    statusFilter: status || undefined,
    typeFilter: service || undefined,
    search: q || undefined,
  })

  const hasFilters = Boolean(status || service || q)
  const isEmpty = total === 0 && !hasFilters
  const noResults = total === 0 && hasFilters

  return (
    <main className="grid gap-4">
      <header className="border-b border-dr-tri-border pb-4">
        <h1 className="text-xl font-bold text-dr-tri-dark">Mes demandes</h1>
      </header>

      <RequestsFilters status={status} service={service} q={q} />

      {isEmpty && (
        <section className="card grid text-center">
          <h2 className="text-lg font-semibold text-dr-tri-dark">Aucune demande</h2>
          <p className="text-sm text-dr-tri-muted">
            Vous n&apos;avez pas encore créé de demande. Créez-en une pour commencer.
          </p>
          <Link href="/app/demandes/nouvelle" className="btn mx-auto mt-2 w-fit">
            Créer une demande
          </Link>
        </section>
      )}

      {noResults && (
        <section className="card grid text-center">
          <h2 className="text-lg font-semibold text-dr-tri-dark">Aucun résultat</h2>
          <p className="text-sm text-dr-tri-muted">
            Aucune demande ne correspond à vos filtres. Essayez d&apos;élargir les critères ou{" "}
            <Link href="/app/demandes" className="text-dr-tri-primary hover:underline">
              réinitialiser les filtres
            </Link>
            .
          </p>
        </section>
      )}

      {requests.length > 0 && (
        <>
          <div className="hidden md:block">
            <RequestsTable requests={requests} />
          </div>
          <div className="md:hidden">
            <RequestsCards requests={requests} />
          </div>
          <RequestsPagination
            currentPage={page}
            totalItems={total}
            pageSize={PAGE_SIZE}
            status={status}
            service={service}
            q={q}
          />
        </>
      )}
    </main>
  )
}
