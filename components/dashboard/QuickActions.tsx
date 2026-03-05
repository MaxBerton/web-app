import Link from "next/link"

const ACTIONS = [
  {
    label: "Recyclage",
    href: "/app/recycling",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <polyline points="1 4 1 10 7 10" /><polyline points="23 20 23 14 17 14" />
        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
      </svg>
    ),
    description: "Gérer mon abonnement",
  },
  {
    label: "Transport",
    href: "/app/demandes/nouvelle?type=transport",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    description: "Déménagement & livraison",
  },
  {
    label: "Débarras",
    href: "/app/demandes/nouvelle?type=clearance",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
        <path d="M10 11v6m4-6v6" /><path d="M9 6V4h6v2" />
      </svg>
    ),
    description: "Vider un espace",
  },
  {
    label: "Jardin / travaux",
    href: "/app/demandes/nouvelle?type=other",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    description: "Entretien, bricolage, petits travaux",
  },
]

export function QuickActions() {
  return (
    <section aria-labelledby="quick-actions-title">
      <h2 id="quick-actions-title" className="mb-3 text-base font-semibold text-dr-tri-dark">
        Que souhaitez-vous faire ?
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {ACTIONS.map(({ label, href, icon, description }) => (
          <Link
            key={label}
            href={href}
            className="card flex flex-col items-center gap-2 py-5 text-center transition-shadow hover:shadow-md hover:border-dr-tri-primary group"
            aria-label={`${label} — ${description}`}
          >
            <span className="text-dr-tri-muted group-hover:text-dr-tri-primary transition-colors">
              {icon}
            </span>
            <span className="text-sm font-semibold text-dr-tri-dark group-hover:text-dr-tri-primary transition-colors leading-tight">
              {label}
            </span>
            <span className="text-xs text-dr-tri-muted leading-tight hidden sm:block">
              {description}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
