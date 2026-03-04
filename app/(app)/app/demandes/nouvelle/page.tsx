import { RequestWizard } from "@/components/request-wizard/RequestWizard"

type NewRequestPageProps = {
  searchParams: Promise<{ error?: string }>
}

export default async function NewRequestPage({ searchParams }: NewRequestPageProps) {
  const params = await searchParams
  const errorMessage =
    params.error === "missing_required"
      ? "La description est obligatoire."
      : params.error === "create_failed"
        ? "La demande n'a pas pu être créée. Réessayez."
        : null

  return (
    <main className="grid gap-4">
      <header className="border-b border-dr-tri-border pb-4">
        <h1 className="text-xl font-bold text-dr-tri-dark">Créer une demande</h1>
      </header>

      {errorMessage && (
        <p className="rounded border border-red-800 bg-red-950/50 px-3 py-2 text-sm text-red-200">
          {errorMessage}
        </p>
      )}

      <RequestWizard />
    </main>
  )
}
