import { signOutAction } from "@/app/actions/auth"

export function SessionCard() {
  return (
    <section className="rounded-lg border border-dr-tri-border bg-white p-6" aria-labelledby="session-heading">
      <h2 id="session-heading" className="text-base font-semibold text-dr-tri-dark mb-1">
        Session
      </h2>
      <form action={signOutAction} className="mt-4">
        <button
          type="submit"
          className="inline-flex items-center rounded-md border border-dr-tri-border bg-white px-3 py-1.5 text-sm font-medium text-dr-tri-dark hover:bg-dr-tri-background transition-colors"
        >
          Déconnexion
        </button>
      </form>
    </section>
  )
}
