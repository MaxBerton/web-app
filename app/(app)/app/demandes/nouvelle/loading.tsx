export default function NewRequestLoading() {
  return (
    <main className="grid gap-4">
      <header className="flex items-center justify-between border-b border-dr-tri-border pb-4">
        <div className="h-7 w-48 animate-pulse rounded bg-dr-tri-border" />
        <div className="h-5 w-24 animate-pulse rounded bg-dr-tri-border" />
      </header>
      <div className="card grid gap-4">
        <div className="h-6 w-40 animate-pulse rounded bg-dr-tri-border" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-dr-tri-border" />
          ))}
        </div>
        <div className="h-10 w-24 animate-pulse rounded bg-dr-tri-border ml-auto" />
      </div>
    </main>
  )
}
