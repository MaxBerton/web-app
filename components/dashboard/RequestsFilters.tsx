import { STATUS_FILTER_OPTIONS, TYPE_FILTER_OPTIONS } from "@/lib/dashboard"

type RequestsFiltersProps = {
  status: string
  service: string
  q: string
}

export function RequestsFilters({ status, service, q }: RequestsFiltersProps) {
  return (
    <form
      method="get"
      action="/app/demandes"
      className="card grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      role="search"
    >
      <input type="hidden" name="page" value="1" />
      <label className="grid gap-1.5 text-sm text-dr-tri-muted">
        Statut
        <select
          name="status"
          defaultValue={status}
          className="rounded border border-dr-tri-border bg-white px-3 py-2 text-dr-tri-dark focus:border-dr-tri-primary focus:outline-none"
        >
          {STATUS_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value || "all"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1.5 text-sm text-dr-tri-muted">
        Service
        <select
          name="service"
          defaultValue={service}
          className="rounded border border-dr-tri-border bg-white px-3 py-2 text-dr-tri-dark focus:border-dr-tri-primary focus:outline-none"
        >
          {TYPE_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value || "all"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1.5 text-sm text-dr-tri-muted sm:col-span-2 lg:col-span-1">
        Recherche (id / description)
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Mot clé ou n° demande"
          className="rounded border border-dr-tri-border bg-white px-3 py-2 text-dr-tri-dark placeholder-dr-tri-muted focus:border-dr-tri-primary focus:outline-none"
        />
      </label>
      <div className="flex flex-wrap items-end gap-2 sm:col-span-2 lg:col-span-1">
        <button type="submit" className="btn">
          Filtrer
        </button>
        <a href="/app/demandes" className="text-sm text-dr-tri-muted hover:text-dr-tri-primary">
          Réinitialiser
        </a>
      </div>
    </form>
  )
}
