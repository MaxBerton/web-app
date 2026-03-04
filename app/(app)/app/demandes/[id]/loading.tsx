export default function LoadingRequestDetails() {
  return (
    <main className="grid gap-4">
      <header className="card flex justify-between gap-4">
        <div className="grid gap-2">
          <div className="h-4 w-32 animate-pulse rounded bg-dr-tri-border" />
          <div className="h-6 w-48 animate-pulse rounded bg-dr-tri-border" />
          <div className="h-6 w-20 animate-pulse rounded bg-dr-tri-border" />
        </div>
        <div className="h-10 w-36 animate-pulse rounded bg-dr-tri-border" />
      </header>
      <section className="card grid gap-3">
        <div className="h-5 w-24 animate-pulse rounded bg-dr-tri-border" />
        <div className="h-4 flex-1 animate-pulse rounded bg-dr-tri-border" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-dr-tri-border" />
      </section>
      <section className="card">
        <div className="mb-3 h-5 w-32 animate-pulse rounded bg-dr-tri-border" />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-video animate-pulse rounded-lg bg-dr-tri-border" />
          ))}
        </div>
      </section>
      <section className="card grid gap-4">
        <div className="h-5 w-40 animate-pulse rounded bg-dr-tri-border" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded bg-dr-tri-border" />
          ))}
        </div>
        <div className="h-20 animate-pulse rounded bg-dr-tri-border" />
        <div className="h-10 w-24 animate-pulse rounded bg-dr-tri-border" />
      </section>
      <section className="card">
        <div className="h-5 w-28 animate-pulse rounded bg-dr-tri-border" />
        <div className="mt-2 h-16 animate-pulse rounded bg-dr-tri-border" />
      </section>
    </main>
  )
}
