import Link from "next/link"

const servicesData = [
  { id: "recyclage", title: "Recyclage à domicile", desc: "La déchetterie vient à vous. On récupère et remplace vos bacs.", href: "/services", anchor: "#recyclage" },
  { id: "debarras", title: "Débarras", desc: "Garage, grenier, matériel lourd, meubles…", href: "/services/debarras", anchor: "" },
  { id: "transport", title: "Transport & livraison", desc: "Transport sécurisé de marchandises, livraison sur demande.", href: "/services/demenagement", anchor: "" },
  { id: "entretien", title: "Entretien / travaux", desc: "Jardin, petits travaux, bricolage et services divers.", href: "/services/installation", anchor: "" },
]

const howItWorksSteps = [
  { title: "Vous faites votre demande", desc: "Formulaire en ligne ou contact direct." },
  { title: "On planifie l'intervention", desc: "Jour / créneau selon votre besoin." },
  { title: "On intervient", desc: "Transport, installation ou débarras, selon la demande." },
]

const benefitsData = [
  { title: "Efficacité du service", desc: "Interventions structurées et exécution propre." },
  { title: "Rapidité de l'intervention", desc: "Prise en charge rapide selon disponibilités." },
  { title: "Diversité de l'offre", desc: "Débarras, transport, installation, entretien, recyclage." },
  { title: "Soucieux de l'environnement", desc: "Optimisation des trajets et tri responsable quand applicable." },
]

export default function HomePage() {
  return (
    <main id="content" role="main">
      {/* HERO */}
      <header id="hero" className="bg-dr-tri-primary py-16 md:py-24" aria-labelledby="hero-title">
        <div className="container-dr">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="hero-copy">
              <p className="mb-4 text-sm font-medium uppercase tracking-wide text-white/80 md:text-base">
                Service local • Intervention rapide • Devis sur demande
              </p>
              <h1 id="hero-title" className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                On transporte, on installe, on débarrasse.
              </h1>
              <p className="mt-4 text-lg text-white/90">
                Un service simple pour gagner du temps : débarras, transport, livraison, entretien et recyclage à domicile.
              </p>
              <div className="mt-8 flex flex-wrap gap-4" role="group" aria-label="Actions principales">
                <Link className="btn-primary bg-white text-dr-tri-primary hover:bg-white/90 hover:text-dr-tri-primary" href="/contact">
                  Demander une intervention
                </Link>
                <Link className="btn-secondary border-white bg-transparent text-white hover:bg-white/10" href="/services">
                  Voir les services
                </Link>
              </div>
              <ul className="mt-8 flex flex-wrap gap-6 text-sm text-white/85" aria-label="Points clés">
                <li>Réponse rapide</li>
                <li>Interventions planifiées</li>
                <li>Service pro</li>
              </ul>
            </div>
            <figure className="hero-visual flex items-center justify-center" aria-label="Illustration du service">
              <div
                className="h-64 w-full max-w-md rounded-dr-tri-lg bg-white/10 md:h-80"
                role="img"
                aria-label="Camionnette Dr. Tri et intervention"
              />
              <figcaption className="sr-only">
                Illustration d'une intervention Dr. Tri (transport, installation, débarras).
              </figcaption>
            </figure>
          </div>
        </div>
      </header>

      {/* SERVICES */}
      <section id="services" className="py-16 md:py-20" aria-labelledby="services-title">
        <div className="container-dr">
          <header className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="services-title" className="section-title text-left">
                Nos services
              </h2>
              <p className="mt-1 text-dr-tri-muted">Choisis le service, on s'occupe du reste.</p>
            </div>
            <Link className="link mt-2 shrink-0 sm:mt-0" href="/services" aria-label="Voir tous les services">
              Tout voir
            </Link>
          </header>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" role="list">
            {servicesData.map((service) => (
              <article
                key={service.id}
                className="flex flex-col rounded-dr-tri-lg border border-dr-tri-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                role="listitem"
              >
                <div className="mb-4 h-12 w-12 rounded-full bg-dr-tri-light-green" aria-hidden />
                <h3 className="text-xl font-semibold text-dr-tri-dark">{service.title}</h3>
                <p className="mt-2 flex-1 text-dr-tri-muted">{service.desc}</p>
                <p className="mt-4">
                  <Link className="link" href={service.anchor ? `${service.href}${service.anchor}` : service.href}>
                    En savoir plus
                  </Link>
                </p>
              </article>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link className="btn-primary" href="/contact">
              Demander une intervention
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="border-t border-dr-tri-border bg-white py-16 md:py-20" aria-labelledby="how-title">
        <div className="container-dr">
          <header className="mb-12 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="how-title" className="section-title text-left">
                Comment ça marche
              </h2>
              <p className="mt-1 text-dr-tri-muted">3 étapes. Zéro friction.</p>
            </div>
            <Link className="link mt-2 shrink-0 sm:mt-0" href="/#how-it-works" aria-label="Voir le détail">
              Voir le détail
            </Link>
          </header>

          <ol className="grid gap-8 md:grid-cols-3" aria-label="Étapes du service" role="list">
            {howItWorksSteps.map((step, index) => (
              <li key={index} className="flex flex-col items-center text-center md:items-start md:text-left">
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-dr-tri-primary text-lg font-bold text-white"
                  aria-hidden
                >
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-dr-tri-dark">{step.title}</h3>
                <p className="mt-2 text-dr-tri-muted">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="benefits" className="py-16 md:py-20" aria-labelledby="benefits-title">
        <div className="container-dr">
          <header className="section-head mb-12">
            <h2 id="benefits-title" className="section-title">
              Pourquoi Dr. Tri ?
            </h2>
            <p className="mt-2 text-center text-dr-tri-muted">Un service simple, local et efficace.</p>
          </header>

          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4" aria-label="Bénéfices" role="list">
            {benefitsData.map((benefit, index) => (
              <li key={index} className="rounded-dr-tri-lg border border-dr-tri-border bg-white p-6" role="listitem">
                <h3 className="text-lg font-semibold text-dr-tri-dark">{benefit.title}</h3>
                <p className="mt-2 text-dr-tri-muted">{benefit.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="border-t border-dr-tri-border bg-white py-16 md:py-20" aria-labelledby="pricing-title">
        <div className="container-dr">
          <header className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="pricing-title" className="section-title text-left">
                Tarifs
              </h2>
              <p className="mt-1 text-dr-tri-muted">Des prix clairs : intervention ponctuelle (devis) ou abonnement mensuel.</p>
            </div>
            <Link className="link mt-2 shrink-0 sm:mt-0" href="/#pricing" aria-label="Voir tous les tarifs">
              Voir tous les tarifs
            </Link>
          </header>

          <div className="grid gap-6 lg:grid-cols-3" role="list">
            <article
              className="flex flex-col rounded-dr-tri-lg border border-dr-tri-border bg-dr-tri-background p-6"
              role="listitem"
              aria-label="Intervention ponctuelle"
            >
              <h3 className="text-lg font-semibold text-dr-tri-dark">Intervention ponctuelle</h3>
              <p className="mt-3 text-xl font-bold text-dr-tri-dark">
                <strong>Devis gratuit</strong>
              </p>
              <ul className="mt-4 flex-1 space-y-2 text-dr-tri-muted">
                <li>Débarras (cave, grenier, garage, appartement…)</li>
                <li>Transport & livraison (marchandises, mobilier…)</li>
                <li>Installation (mise en place, manutention…)</li>
                <li>Entretien / petits travaux</li>
              </ul>
              <p className="mt-4 text-sm text-dr-tri-muted">
                Prix selon volume, accès, distance, temps d&apos;intervention.
              </p>
              <p className="mt-6">
                <Link className="btn-primary w-full" href="/contact">
                  Demander une intervention
                </Link>
              </p>
            </article>

            <article
              className="flex flex-col rounded-dr-tri-lg border border-dr-tri-border bg-dr-tri-background p-6"
              role="listitem"
              aria-label="Abonnement recyclage"
            >
              <h3 className="text-lg font-semibold text-dr-tri-dark">Abonnement recyclage</h3>
              <p className="mt-3 text-xl font-bold text-dr-tri-dark">
                <strong>Dès 20 CHF</strong> <span className="text-base font-normal text-dr-tri-muted">/ mois</span>
              </p>
              <ul className="mt-4 flex-1 space-y-2 text-dr-tri-muted">
                <li>1 à 4 passages par mois</li>
                <li>Échange des bacs (propres / désinfectés)</li>
                <li>Tri simplifié à domicile</li>
              </ul>
              <p className="mt-4 text-sm text-dr-tri-muted">
                Idéal si tu veux une routine sans y penser.
              </p>
              <p className="mt-6">
                <Link className="btn-secondary w-full" href="/#pricing">
                  Voir les abonnements
                </Link>
              </p>
            </article>

            <article
              className="flex flex-col rounded-dr-tri-lg border border-dr-tri-border bg-dr-tri-background p-6"
              role="listitem"
              aria-label="Devis sur mesure"
            >
              <h3 className="text-lg font-semibold text-dr-tri-dark">Devis sur mesure</h3>
              <p className="mt-3 text-xl font-bold text-dr-tri-dark">
                <strong>Pro / régulier</strong>
              </p>
              <ul className="mt-4 flex-1 space-y-2 text-dr-tri-muted">
                <li>Demandes récurrentes</li>
                <li>Multi-sites / volume</li>
                <li>Planification + priorisation</li>
              </ul>
              <p className="mt-4 text-sm text-dr-tri-muted">
                On structure une solution adaptée à tes besoins.
              </p>
              <p className="mt-6">
                <Link className="btn-secondary w-full" href="/contact">
                  Demander un devis
                </Link>
              </p>
            </article>
          </div>

          <aside className="mt-10 rounded-dr-tri border border-dr-tri-border bg-dr-tri-light-green/50 px-6 py-4" aria-label="Informations tarifs">
            <p className="text-dr-tri-muted">
              Astuce : plus la demande est précise (photos, accès, adresse), plus le devis est rapide.
            </p>
          </aside>
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="final-cta" className="py-16 md:py-20" aria-labelledby="final-cta-title">
        <div className="container-dr">
          <div className="rounded-dr-tri-lg border border-dr-tri-border bg-dr-tri-primary px-8 py-12 text-center text-white md:px-12">
            <h2 id="final-cta-title" className="text-2xl font-bold md:text-3xl">
              Besoin d'un débarras ou d'un transport ?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/90">
              Décris ta demande en 30 secondes, on te répond rapidement.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4" role="group" aria-label="Actions">
              <Link className="btn-primary bg-white text-dr-tri-primary hover:bg-white/90" href="/contact">
                Demander une intervention
              </Link>
              <Link className="btn-secondary border-white bg-transparent text-white hover:bg-white/10" href="/auth/login">
                Connexion
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
