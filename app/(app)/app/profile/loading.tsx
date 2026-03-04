export default function ProfileLoading() {
  return (
    <main className="grid gap-4">
      <header className="border-b border-dr-tri-border pb-4">
        <div className="h-7 w-40 animate-pulse rounded bg-dr-tri-border" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-dr-tri-border" />
      </header>
      <div className="card grid gap-4">
        <div className="h-6 w-32 animate-pulse rounded bg-dr-tri-border" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="h-10 animate-pulse rounded bg-dr-tri-border" />
          <div className="h-10 animate-pulse rounded bg-dr-tri-border" />
        </div>
        <div className="h-10 animate-pulse rounded bg-dr-tri-border" />
        <div className="h-10 w-24 animate-pulse rounded bg-dr-tri-border" />
      </div>
      <div className="card grid gap-4">
        <div className="h-6 w-40 animate-pulse rounded bg-dr-tri-border" />
        <div className="h-10 animate-pulse rounded bg-dr-tri-border" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="h-10 animate-pulse rounded bg-dr-tri-border" />
          <div className="h-10 animate-pulse rounded bg-dr-tri-border" />
        </div>
        <div className="h-10 w-40 animate-pulse rounded bg-dr-tri-border" />
      </div>
      <div className="card">
        <div className="h-6 w-24 animate-pulse rounded bg-dr-tri-border" />
        <div className="mt-4 h-10 w-44 animate-pulse rounded bg-dr-tri-border" />
      </div>
      <div className="card">
        <div className="h-6 w-20 animate-pulse rounded bg-dr-tri-border" />
        <div className="mt-4 h-10 w-28 animate-pulse rounded bg-dr-tri-border" />
      </div>
    </main>
  )
}
