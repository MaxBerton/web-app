import Link from "next/link"

type ContactPageProps = {
  searchParams: Promise<{ success?: string; error?: string }>
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams
  const showSuccess = params.success === "1"
  const showError = params.error === "1"

  return (
    <main id="content" role="main">
      {showSuccess && (
        <div className="container-dr py-4">
          <p className="rounded-dr-tri bg-dr-tri-light-green px-4 py-3 text-dr-tri-dark">
            Message envoyé. Nous vous répondrons dans les meilleurs délais.
          </p>
        </div>
      )}
      {showError && (
        <div className="container-dr py-4">
          <p className="rounded-dr-tri border border-red-300 bg-red-50 px-4 py-3 text-red-800">
            Une erreur est survenue. Vous pouvez nous contacter par e-mail ou téléphone.
          </p>
        </div>
      )}
      {/* HERO */}
      <header id="contact-hero" className="bg-dr-tri-primary py-16 md:py-20">
        <div className="container-dr text-white">
          <p className="text-sm font-medium uppercase tracking-wide text-white/80">Une question ?</p>
          <h1 className="mt-2 text-4xl font-bold md:text-5xl">Contactez-nous</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/90">
            Besoin d&apos;une information concernant nos services ? Notre équipe est à votre écoute pour répondre à vos questions.
          </p>
        </div>
      </header>

      {/* CONTACT INFO */}
      <section id="contact-info" className="border-b border-dr-tri-border bg-white py-12 md:py-16">
        <div className="container-dr">
          <div className="grid gap-10 md:grid-cols-2">
            <article className="rounded-dr-tri-lg border border-dr-tri-border bg-dr-tri-background p-6">
              <h2 className="text-xl font-semibold text-dr-tri-dark">Par téléphone</h2>
              <p className="mt-2">
                <a href="tel:+41XXXXXXXXX" className="link text-dr-tri-primary">
                  +41 XX XXX XX XX
                </a>
              </p>
              <small className="mt-2 block text-dr-tri-muted">
                Du lundi au vendredi — réponse rapide
              </small>
            </article>
            <article className="rounded-dr-tri-lg border border-dr-tri-border bg-dr-tri-background p-6">
              <h2 className="text-xl font-semibold text-dr-tri-dark">Par e-mail</h2>
              <p className="mt-2">
                <a href="mailto:contact@drtri.ch" className="link text-dr-tri-primary">
                  contact@drtri.ch
                </a>
              </p>
              <small className="mt-2 block text-dr-tri-muted">
                Nous vous répondons dans les meilleurs délais
              </small>
            </article>
          </div>
        </div>
      </section>

      {/* MAP + FORM */}
      <section id="contact-main" className="py-12 md:py-16">
        <div className="container-dr">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* MAP */}
            <aside className="overflow-hidden rounded-dr-tri-lg border border-dr-tri-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4583.9560985901435!2d6.2045637000000005!3d46.3788299!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478c677814f2683b%3A0xda110fe97065996a!2sDr.Tri!5e1!3m2!1sfr!2sfr!4v1772739700666!5m2!1sfr!2sfr"
                width="100%"
                height="500"
                style={{ border: 0 }}
                loading="lazy"
                title="Carte - Genève"
              />
            </aside>

            {/* FORM */}
            <section className="rounded-dr-tri-lg border border-dr-tri-border bg-white p-6 md:p-8">
              <h2 className="text-xl font-semibold text-dr-tri-dark">Formulaire de contact</h2>
              <p className="mt-1 text-sm text-dr-tri-muted">Champs obligatoires *</p>
              <form action="/api/contact" method="post" className="mt-6 grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1.5 text-dr-tri-dark">
                    Prénom *
                    <input
                      type="text"
                      name="first_name"
                      required
                      className="rounded-dr-tri border border-dr-tri-border px-3 py-2 focus:border-dr-tri-primary focus:outline-none focus:ring-1 focus:ring-dr-tri-primary"
                    />
                  </label>
                  <label className="grid gap-1.5 text-dr-tri-dark">
                    Nom *
                    <input
                      type="text"
                      name="last_name"
                      required
                      className="rounded-dr-tri border border-dr-tri-border px-3 py-2 focus:border-dr-tri-primary focus:outline-none focus:ring-1 focus:ring-dr-tri-primary"
                    />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1.5 text-dr-tri-dark">
                    E-mail *
                    <input
                      type="email"
                      name="email"
                      required
                      className="rounded-dr-tri border border-dr-tri-border px-3 py-2 focus:border-dr-tri-primary focus:outline-none focus:ring-1 focus:ring-dr-tri-primary"
                    />
                  </label>
                  <label className="grid gap-1.5 text-dr-tri-dark">
                    Téléphone
                    <input
                      type="tel"
                      name="phone"
                      className="rounded-dr-tri border border-dr-tri-border px-3 py-2 focus:border-dr-tri-primary focus:outline-none focus:ring-1 focus:ring-dr-tri-primary"
                    />
                  </label>
                </div>
                <label className="grid gap-1.5 text-dr-tri-dark">
                  Message *
                  <textarea
                    name="message"
                    rows={6}
                    required
                    className="rounded-dr-tri border border-dr-tri-border px-3 py-2 focus:border-dr-tri-primary focus:outline-none focus:ring-1 focus:ring-dr-tri-primary"
                  />
                </label>
                <label className="flex gap-2 text-sm text-dr-tri-muted">
                  <input type="checkbox" name="privacy" required className="mt-0.5" />
                  <span>
                    J&apos;accepte que mes données soient utilisées pour traiter ma demande
                    (<Link href="/politique-de-confidentialite" className="link">politique de confidentialité</Link>)
                  </span>
                </label>
                <div className="pt-2">
                  <button type="submit" className="btn-primary">
                    Envoyer
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </section>
    </main>
  )
}
