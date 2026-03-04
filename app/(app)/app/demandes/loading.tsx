export default function LoadingClientRequests() {
  return (
    <main className="grid gap-4">
      <header className="flex items-center justify-between border-b border-dr-tri-border pb-4">
        <div className="h-7 w-40 animate-pulse rounded bg-dr-tri-border" />
        <div className="h-10 w-36 animate-pulse rounded bg-dr-tri-border" />
      </header>
      <div className="card grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="h-10 animate-pulse rounded bg-dr-tri-border" />
        <div className="h-10 animate-pulse rounded bg-dr-tri-border" />
        <div className="h-10 animate-pulse rounded bg-dr-tri-border" />
        <div className="h-10 animate-pulse rounded bg-dr-tri-border" />
      </div>
      <div className="card">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex items-center gap-4 border-b border-dr-tri-border/50 py-3">
              <div className="h-4 w-20 animate-pulse rounded bg-dr-tri-border" />
              <div className="h-4 w-24 animate-pulse rounded bg-dr-tri-border" />
              <div className="h-4 flex-1 animate-pulse rounded bg-dr-tri-border" />
              <div className="h-5 w-16 animate-pulse rounded bg-dr-tri-border" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
