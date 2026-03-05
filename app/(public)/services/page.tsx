import Link from "next/link"

const servicesData = [
  {
    id: "debarras",
    title: "Débarras",
    href: "/services/debarras",
    description: "Nous intervenons pour vider caves, garages, appartements ou locaux.",
    items: ["garage", "grenier", "appartement", "mobilier"],
    ctaLabel: "Demander un devis",
    ctaHref: "/contact",
  },
  {
    id: "transport",
    title: "Transport & livraison",
    href: "/services/transport-livraison",
    description: "Transport sécurisé de marchandises ou livraison de matériel.",
    items: ["transport mobilier", "livraison", "manutention"],
    ctaLabel: "Demander un devis",
    ctaHref: "/contact",
  },
  {
    id: "recyclage",
    title: "Recyclage à domicile",
    href: "/services/recyclage-domicile",
    description: "Nous mettons à disposition des bacs de tri et récupérons les déchets selon votre abonnement.",
    items: ["papier", "plastique", "verre", "métal"],
    ctaLabel: "Voir les abonnements",
    ctaHref: "/#pricing",
  },
  {
    id: "entretien",
    title: "Entretien & petits travaux",
    href: "/services/installation-manutention",
    description: "Nous proposons également divers services comme l'entretien de jardin ou des petits travaux.",
    items: ["entretien jardin", "bricolage", "manutention"],
    ctaLabel: "Demander un devis",
    ctaHref: "/contact",
  },
]

export default function ServicesPage() {
  return (
    <main id="content">
      {/* HERO */}
      <header id="services-hero" className="bg-dr-tri-primary py-16 md:py-20">
        <div className="container-dr text-center text-white">
          <h1 className="text-4xl font-bold md:text-5xl">Nos services</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
            Dr. Tri vous accompagne pour le transport, le débarras, l&apos;installation et le recyclage.
          </p>
        </div>
      </header>

      {/* INTRO */}
      <section id="services-intro" className="border-b border-dr-tri-border bg-white py-12 md:py-16">
        <div className="container-dr">
          <p className="mx-auto max-w-3xl text-center text-lg text-dr-tri-muted md:text-xl">
            Notre objectif est simple : vous faire gagner du temps. Nous intervenons pour transporter, installer ou débarrasser ce dont vous n&apos;avez plus besoin.
          </p>
        </div>
      </section>

      {/* SERVICES LIST */}
      <section id="services-list" className="py-16 md:py-20">
        <div className="container-dr">
          <div className="grid gap-10 md:grid-cols-2 lg:gap-12">
            {servicesData.map((service) => (
              <article
                key={service.id}
                id={`service-${service.id}`}
                className="flex flex-col rounded-dr-tri-lg border border-dr-tri-border bg-white p-6 shadow-sm md:p-8"
              >
                <h2 className="text-xl font-semibold text-dr-tri-dark md:text-2xl">
                  <Link href={service.href} className="text-dr-tri-dark hover:text-dr-tri-primary hover:underline">
                    {service.title}
                  </Link>
                </h2>
                <p className="mt-3 text-dr-tri-muted">{service.description}</p>
                <ul className="mt-4 list-inside list-disc space-y-1 text-dr-tri-muted">
                  {service.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link className="btn-primary inline-block" href={service.ctaHref}>
                    {service.ctaLabel}
                  </Link>
                  <Link className="link text-sm font-medium" href={service.href}>
                    En savoir plus
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="services-cta" className="border-t border-dr-tri-border bg-dr-tri-light-green/40 py-16 md:py-20">
        <div className="container-dr text-center">
          <h2 className="text-2xl font-bold text-dr-tri-dark md:text-3xl">Besoin d&apos;une intervention ?</h2>
          <p className="mx-auto mt-3 max-w-xl text-dr-tri-muted">
            Décrivez votre besoin et nous vous répondrons rapidement.
          </p>
          <p className="mt-8">
            <Link className="btn-primary" href="/contact">
              Demander une intervention
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
