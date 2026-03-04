import Link from "next/link"

const PHONE = "+41 00 000 00 00"
const EMAIL = "contact@drtri.ch"

export function SupportCard() {
  return (
    <aside className="card" aria-label="Aide et contact">
      <h2 className="mb-3 text-lg font-semibold text-dr-tri-dark">Aide</h2>
      <ul className="grid gap-2 text-sm" style={{ listStyle: "none", margin: 0, padding: 0 }}>
        <li>
          <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="text-dr-tri-muted hover:text-dr-tri-primary">
            Téléphone : {PHONE}
          </a>
        </li>
        <li>
          <a href={`mailto:${EMAIL}`} className="text-dr-tri-muted hover:text-dr-tri-primary">
            E-mail : {EMAIL}
          </a>
        </li>
        <li>
          <Link href="/app/contact" className="text-dr-tri-primary hover:underline">
            Page contact
          </Link>
        </li>
      </ul>
    </aside>
  )
}
