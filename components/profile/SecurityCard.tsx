import Link from "next/link"

export function SecurityCard() {
  return (
    <section className="rounded-lg border border-dr-tri-border bg-white p-6" aria-labelledby="security-heading">
      <h2 id="security-heading" className="text-base font-semibold text-dr-tri-dark mb-1">
        Sécurité
      </h2>
      <p className="text-sm text-dr-tri-muted mb-4">
        Lien par e-mail pour définir un nouveau mot de passe.
      </p>
      <Link
        href="/auth/forgot-password"
        className="text-sm font-medium text-dr-tri-primary hover:underline underline-offset-2"
      >
        Changer le mot de passe
      </Link>
    </section>
  )
}
