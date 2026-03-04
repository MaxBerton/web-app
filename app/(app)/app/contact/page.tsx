import Link from "next/link"
import { requireUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { contactFormAction } from "./actions"

const PHONE = "+41 00 000 00 00"
const EMAIL = "contact@drtri.ch"

type ContactPageProps = {
  searchParams: Promise<{ success?: string; error?: string }>
}

export default async function AppContactPage({ searchParams }: ContactPageProps) {
  const user = await requireUser()
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, email")
    .eq("id", user.id)
    .single()

  const params = await searchParams
  const showSuccess = params.success === "1"
  const showError = params.error === "1"

  const defaultEmail = profile?.email ?? user.email ?? ""
  const defaultFirstName = profile?.first_name ?? ""
  const defaultLastName = profile?.last_name ?? ""

  return (
    <main className="grid gap-4">
      <header className="border-b border-dr-tri-border pb-4">
        <h1 className="text-xl font-bold text-dr-tri-dark">Contact</h1>
        <p className="mt-1 text-sm text-dr-tri-muted">
          Une question ? Contactez l&apos;équipe Dr.Tri depuis votre espace client.
        </p>
      </header>

      {showSuccess && (
        <p className="rounded-lg bg-dr-tri-light-green px-4 py-3 text-sm text-dr-tri-dark">
          Message envoyé. Nous vous répondrons dans les meilleurs délais.
        </p>
      )}
      {showError && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Une erreur est survenue. Vous pouvez nous contacter par e-mail ou téléphone.
        </p>
      )}

      <section className="card grid gap-6 sm:grid-cols-2">
        <article>
          <h2 className="text-lg font-semibold text-dr-tri-dark">Par téléphone</h2>
          <p className="mt-2">
            <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="link text-dr-tri-primary">
              {PHONE}
            </a>
          </p>
          <p className="mt-1 text-sm text-dr-tri-muted">Du lundi au vendredi</p>
        </article>
        <article>
          <h2 className="text-lg font-semibold text-dr-tri-dark">Par e-mail</h2>
          <p className="mt-2">
            <a href={`mailto:${EMAIL}`} className="link text-dr-tri-primary">
              {EMAIL}
            </a>
          </p>
          <p className="mt-1 text-sm text-dr-tri-muted">Réponse dans les meilleurs délais</p>
        </article>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold text-dr-tri-dark">Envoyer un message</h2>
        <p className="mt-1 text-sm text-dr-tri-muted">Champs obligatoires *</p>
        <form action={contactFormAction} className="mt-6 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm text-dr-tri-muted">
              Prénom *
              <input
                type="text"
                name="first_name"
                required
                defaultValue={defaultFirstName}
                className="w-full rounded border border-dr-tri-border bg-white px-3 py-2 text-dr-tri-dark focus:border-dr-tri-primary focus:outline-none"
              />
            </label>
            <label className="grid gap-1.5 text-sm text-dr-tri-muted">
              Nom *
              <input
                type="text"
                name="last_name"
                required
                defaultValue={defaultLastName}
                className="w-full rounded border border-dr-tri-border bg-white px-3 py-2 text-dr-tri-dark focus:border-dr-tri-primary focus:outline-none"
              />
            </label>
          </div>
          <label className="grid gap-1.5 text-sm text-dr-tri-muted">
            E-mail *
            <input
              type="email"
              name="email"
              required
              defaultValue={defaultEmail}
              className="w-full rounded border border-dr-tri-border bg-white px-3 py-2 text-dr-tri-dark focus:border-dr-tri-primary focus:outline-none"
            />
          </label>
          <label className="grid gap-1.5 text-sm text-dr-tri-muted">
            Message *
            <textarea
              name="message"
              rows={5}
              required
              placeholder="Décrivez votre demande..."
              className="w-full rounded border border-dr-tri-border bg-white px-3 py-2 text-dr-tri-dark placeholder-dr-tri-muted focus:border-dr-tri-primary focus:outline-none"
            />
          </label>
          <button type="submit" className="btn w-fit">
            Envoyer
          </button>
        </form>
      </section>

      <p className="text-sm text-dr-tri-muted">
        Vous pouvez aussi échanger avec l&apos;équipe directement depuis le détail d&apos;une demande (
        <Link href="/app/demandes" className="link">
          Mes demandes
        </Link>
        ).
      </p>
    </main>
  )
}
