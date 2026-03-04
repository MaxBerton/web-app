import Link from "next/link"

export type ServicePageContent = {
  name: string
  h1: string
  lead: string
  quickInfoChips: string[]
  whatTitle: string
  whatText: string
  examplesTitle: string
  examples: string[]
  howTitle: string
  howSteps: { title: string; text: string }[]
  pricingTitle: string
  pricingText: string
  pricingBullets: string[]
  pricingLinkLabel: string
  pricingLinkHref: string
  faqTitle: string
  faq: { q: string; a: string }[]
  finalCtaTitle: string
  finalCtaParagraph: string
}

type ServiceSubpageProps = {
  content: ServicePageContent
}

export function ServiceSubpage({ content }: ServiceSubpageProps) {
  return (
    <main id="content" role="main">
      <header id="service-hero" className="bg-dr-tri-primary py-16 md:py-20" aria-labelledby="service-title">
        <div className="container-dr text-white">
          <nav className="mb-6 text-sm text-white/80" aria-label="Fil d'Ariane">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="hover:underline">Accueil</Link></li>
              <li aria-hidden>/</li>
              <li><Link href="/services" className="hover:underline">Services</Link></li>
              <li aria-hidden>/</li>
              <li className="text-white" aria-current="page">{content.name}</li>
            </ol>
          </nav>
          <h1 id="service-title" className="text-4xl font-bold md:text-5xl">{content.h1}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/90">{content.lead}</p>
          <div className="mt-8 flex flex-wrap gap-4" role="group" aria-label="Actions">
            <Link className="btn-primary inline-block bg-white text-dr-tri-primary hover:bg-white/90" href="/contact">Demander un devis</Link>
            <Link className="btn-secondary inline-block border-white bg-transparent text-white hover:bg-white/10" href="#examples">Voir les cas</Link>
          </div>
        </div>
      </header>

      <section id="quick-info" className="border-b border-dr-tri-border bg-white py-6" aria-label="Informations clés">
        <div className="container-dr">
          <ul className="flex flex-wrap gap-3">
            {content.quickInfoChips.map((chip) => (
              <li key={chip} className="rounded-full bg-dr-tri-light-green px-4 py-2 text-sm font-medium text-dr-tri-dark">
                {chip}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="what" className="py-12 md:py-16" aria-labelledby="what-title">
        <div className="container-dr">
          <h2 id="what-title" className="section-title text-left text-2xl md:text-3xl">Ce que l&apos;on fait</h2>
          <p className="mt-4 max-w-3xl text-dr-tri-muted">{content.whatText}</p>
        </div>
      </section>

      <section id="examples" className="border-t border-dr-tri-border bg-dr-tri-background py-12 md:py-16" aria-labelledby="examples-title">
        <div className="container-dr">
          <h2 id="examples-title" className="section-title text-left text-2xl md:text-3xl">Cas courants</h2>
          <ul className="mt-6 list-inside list-disc space-y-2 text-dr-tri-muted">
            {content.examples.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section id="how" className="py-12 md:py-16" aria-labelledby="how-title">
        <div className="container-dr">
          <h2 id="how-title" className="section-title text-left text-2xl md:text-3xl">Comment ça se passe</h2>
          <ol className="mt-6 space-y-4">
            {content.howSteps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-dr-tri-primary text-sm font-bold text-white">{i + 1}</span>
                <span><strong>{step.title}</strong> — {step.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="pricing" className="border-t border-dr-tri-border bg-dr-tri-background py-12 md:py-16" aria-labelledby="pricing-title">
        <div className="container-dr">
          <h2 id="pricing-title" className="section-title text-left text-2xl md:text-3xl">Tarifs</h2>
          <p className="mt-4 text-dr-tri-muted">{content.pricingText}</p>
          <ul className="mt-4 list-inside list-disc space-y-1 text-dr-tri-muted">
            {content.pricingBullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <p className="mt-6">
            <Link className="link font-semibold" href={content.pricingLinkHref}>{content.pricingLinkLabel}</Link>
          </p>
        </div>
      </section>

      <section id="faq" className="py-12 md:py-16" aria-labelledby="faq-title">
        <div className="container-dr">
          <h2 id="faq-title" className="section-title text-left text-2xl md:text-3xl">FAQ</h2>
          <div className="mt-6 space-y-2">
            {content.faq.map((item, i) => (
              <details key={i} className="rounded-dr-tri border border-dr-tri-border bg-white px-4 py-3">
                <summary className="cursor-pointer font-medium text-dr-tri-dark">{item.q}</summary>
                <p className="mt-2 text-dr-tri-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="final-cta" className="border-t border-dr-tri-border bg-dr-tri-primary py-16 md:py-20" aria-labelledby="final-cta-title">
        <div className="container-dr text-center text-white">
          <h2 id="final-cta-title" className="text-2xl font-bold md:text-3xl">{content.finalCtaTitle}</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/90">{content.finalCtaParagraph}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4" role="group" aria-label="Actions">
            <Link className="btn-primary inline-block bg-white text-dr-tri-primary hover:bg-white/90" href="/contact">Demander un devis</Link>
            <Link className="btn-secondary inline-block border-white bg-transparent text-white hover:bg-white/10" href="/services">Retour aux services</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
