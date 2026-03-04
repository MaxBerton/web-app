"use client"

export default function GlobalError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string }
  reset: () => void
}>) {
  console.error("[global-error]", error)

  return (
    <main className="shell">
      <section className="card grid">
        <h1>Une erreur est survenue</h1>
        <p>Veuillez reessayer.</p>
        <button className="btn" type="button" onClick={reset}>
          Recharger
        </button>
      </section>
    </main>
  )
}
