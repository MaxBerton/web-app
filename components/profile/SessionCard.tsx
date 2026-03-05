import { signOutAction } from "@/app/actions/auth"

export function SessionCard() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="inline-flex items-center rounded-md border border-dr-tri-border bg-white px-3 py-1.5 text-sm font-medium text-dr-tri-dark hover:bg-dr-tri-background transition-colors"
      >
        Déconnexion
      </button>
    </form>
  )
}
