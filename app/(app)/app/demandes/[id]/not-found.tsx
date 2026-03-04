import Link from "next/link"

export default function RequestNotFoundPage() {
  return (
    <main className="grid gap-4">
      <section className="card grid text-center">
        <h1 className="text-xl font-semibold text-dr-tri-dark">Demande introuvable</h1>
        <p className="mt-2 text-sm text-dr-tri-muted">
          Cette demande n&apos;existe pas ou vous n&apos;avez pas les droits d&apos;accès.
        </p>
        <Link href="/app/demandes" className="btn mx-auto mt-4 w-fit">
          Retour à mes demandes
        </Link>
      </section>
    </main>
  )
}
