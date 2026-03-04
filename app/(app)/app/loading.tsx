export default function AppLoading() {
  return (
    <main className="grid gap-4">
      <header className="flex items-center justify-between border-b border-dr-tri-border pb-4">
        <div className="h-7 w-48 animate-pulse rounded bg-dr-tri-border" />
        <div className="h-10 w-40 animate-pulse rounded bg-dr-tri-border" />
      </header>
      <section className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card">
            <div className="mb-2 h-4 w-24 animate-pulse rounded bg-dr-tri-border" />
            <div className="h-8 w-12 animate-pulse rounded bg-dr-tri-border" />
          </div>
        ))}
      </section>
      <section>
        <div className="mb-3 h-6 w-40 animate-pulse rounded bg-dr-tri-border" />
        <div className="grid gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="card flex items-center justify-between">
              <div className="h-4 flex-1 animate-pulse rounded bg-dr-tri-border" />
              <div className="ml-2 h-9 w-16 animate-pulse rounded bg-dr-tri-border" />
            </div>
          ))}
        </div>
      </section>
      <aside className="card">
        <div className="mb-3 h-6 w-24 animate-pulse rounded bg-dr-tri-border" />
        <div className="space-y-2">
          <div className="h-4 w-32 animate-pulse rounded bg-dr-tri-border" />
          <div className="h-4 w-40 animate-pulse rounded bg-dr-tri-border" />
        </div>
      </aside>
    </main>
  )
}
