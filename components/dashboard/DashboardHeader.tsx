import Link from "next/link"

type DashboardHeaderProps = {
  firstName: string | null
}

export function DashboardHeader({ firstName }: DashboardHeaderProps) {
  const greeting = firstName?.trim() ? `Bonjour ${firstName}` : "Bonjour"

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-dr-tri-border pb-4">
      <h1 className="text-xl font-bold text-dr-tri-dark">{greeting}</h1>
      <Link href="/app/demandes/nouvelle" className="btn">
        Nouvelle demande
      </Link>
    </header>
  )
}
