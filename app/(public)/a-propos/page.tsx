import Link from "next/link"
import Image from "next/image"
import axelImage from "@/assets/Axel-dr-tri.webp"

const values = [
  { title: "Efficacité", description: "Une organisation simple, des interventions nettes, sans perte de temps." },
  { title: "Fiabilité", description: "Planification claire, communication directe, engagement sur l'exécution." },
  { title: "Respect", description: "Respect des lieux, des délais, et de vos contraintes." },
  { title: "Responsabilité", description: "Quand c'est applicable, tri et acheminement vers les filières adaptées." },
]

export default function AProposPage() {
  return (
    <main id="content" role="main">
      {/* HERO */}
      <header id="about-hero" className="bg-dr-tri-primary py-16 md:py-20" aria-labelledby="about-title">
        <div className="container-dr text-white">
          <nav className="mb-6 text-sm text-white/80" aria-label="Fil d'Ariane">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="hover:underline">Accueil</Link></li>
              <li aria-hidden>/</li>
              <li className="text-white" aria-current="page">À propos</li>
            </ol>
          </nav>
          <h1 id="about-title" className="text-4xl font-bold md:text-5xl">À propos</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/90">
            Dr. Tri simplifie la logistique du quotidien : transport, installation, débarras, et services associés — avec une approche efficace et responsable.
          </p>
        </div>
      </header>

      {/* MISSION */}
      <section id="about-mission" className="border-b border-dr-tri-border bg-white py-12 md:py-16" aria-labelledby="mission-title">
        <div className="container-dr">
          <h2 id="mission-title" className="section-title text-left text-2xl md:text-3xl">Notre mission</h2>
          <p className="mt-4 max-w-3xl text-dr-tri-muted">
            Vous faire gagner du temps. Dr. Tri intervient pour transporter, installer ou débarrasser ce dont vous n&apos;avez plus besoin, avec une organisation simple et une exécution propre.
          </p>
          <ul className="mt-6 list-inside list-disc space-y-1 text-dr-tri-muted" aria-label="Points clés">
            <li>Interventions planifiées</li>
            <li>Devis rapide</li>
            <li>Service local et fiable</li>
          </ul>
        </div>
      </section>

      {/* STORY */}
      <section id="about-story" className="py-12 md:py-16" aria-labelledby="story-title">
        <div className="container-dr">
          <h2 id="story-title" className="section-title text-left text-2xl md:text-3xl">Notre histoire</h2>
          <div className="mt-4 max-w-3xl space-y-4 text-dr-tri-muted">
            <p>
              Dr. Tri est né en 2021 avec une idée simple : proposer un service pratique, accessible et bien exécuté, pour éviter les contraintes logistiques du quotidien.
            </p>
            <p>
              En peu de temps, nous avons développé une méthode de travail axée sur l&apos;efficacité, la ponctualité et la confiance. Chaque intervention est traitée comme un projet : compréhension du besoin, planification, exécution.
            </p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section id="about-values" className="border-t border-dr-tri-border bg-dr-tri-background py-12 md:py-16" aria-labelledby="values-title">
        <div className="container-dr">
          <h2 id="values-title" className="section-title text-left text-2xl md:text-3xl">Nos valeurs</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" role="list">
            {values.map((value) => (
              <article
                key={value.title}
                className="rounded-dr-tri-lg border border-dr-tri-border bg-white p-6"
                role="listitem"
              >
                <h3 className="text-lg font-semibold text-dr-tri-dark">{value.title}</h3>
                <p className="mt-2 text-dr-tri-muted">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM / FOUNDER */}
      <section id="about-team" className="py-12 md:py-16" aria-labelledby="team-title">
        <div className="container-dr">
          <h2 id="team-title" className="section-title text-left text-2xl md:text-3xl">L&apos;équipe</h2>
          <p className="mt-4 max-w-3xl text-dr-tri-muted">
            Une équipe terrain, organisée et réactive, dédiée à des prestations logistiques fiables et simples à déclencher.
          </p>
          <figure className="mt-10 flex flex-col items-center gap-6 rounded-dr-tri-lg border border-dr-tri-border bg-dr-tri-light-green/40 px-6 py-8 md:flex-row md:items-start md:gap-8 md:px-10 md:py-10">
            <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-full md:h-56 md:w-56">
              <Image
                src={axelImage}
                alt="Axel Jenny, fondateur de Dr. Tri"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 192px, 224px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <blockquote className="m-0">
                <p className="text-lg italic text-dr-tri-dark md:text-xl">
                  « Notre objectif : que chaque intervention soit simple, rapide, et bien faite. »
                </p>
              </blockquote>
              <figcaption className="mt-4 font-semibold text-dr-tri-dark">
                Axel Jenny, fondateur de Dr. Tri
              </figcaption>
            </div>
          </figure>
        </div>
      </section>

      {/* CTA */}
      <section id="about-cta" className="border-t border-dr-tri-border bg-dr-tri-primary py-16 md:py-20" aria-labelledby="about-cta-title">
        <div className="container-dr text-center text-white">
          <h2 id="about-cta-title" className="text-2xl font-bold md:text-3xl">Besoin d&apos;une intervention ?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/90">
            Décris ta demande en quelques infos, on te répond rapidement.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4" role="group" aria-label="Actions">
            <Link className="btn-primary inline-block bg-white text-dr-tri-primary hover:bg-white/90" href="/contact">
              Demander une intervention
            </Link>
            <Link className="btn-secondary inline-block border-white bg-transparent text-white hover:bg-white/10" href="/services">
              Voir les services
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
