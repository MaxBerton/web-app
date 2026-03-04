import Link from "next/link"

const services = [
  { href: "/services/demenagement", title: "Demenagement" },
  { href: "/services/installation", title: "Installation" },
  { href: "/services/debarras", title: "Debarras" },
]

export default function ServicesPage() {
  return (
    <main className="card grid">
      <h1>Nos services</h1>
      <p>Selectionnez le service adapte a votre besoin.</p>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        {services.map((service) => (
          <Link key={service.href} className="card" href={service.href}>
            <strong>{service.title}</strong>
          </Link>
        ))}
      </div>
    </main>
  )
}
