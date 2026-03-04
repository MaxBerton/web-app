"use client"

export default function AppError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string }
  reset: () => void
}>) {
  return (
    <main className="grid">
      <section className="card grid">
        <h1 className="text-lg font-semibold text-dr-tri-dark">Une erreur est survenue</h1>
        <p className="text-sm text-dr-tri-muted">{error.message || "Veuillez réessayer."}</p>
        <button className="btn mt-2 w-fit" type="button" onClick={reset}>
          Réessayer
        </button>
      </section>
    </main>
  )
}
