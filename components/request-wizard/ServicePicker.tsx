"use client"

const SERVICES = [
  { value: "clearance", label: "Débarras" },
  { value: "transport", label: "Transport" },
  { value: "moving", label: "Installation" },
  { value: "recycling", label: "Recyclage" },
  { value: "other", label: "Autre" },
] as const

type ServicePickerProps = {
  name?: string
  value?: string
  onChange?: (value: string) => void
  required?: boolean
}

export function ServicePicker({
  name = "type",
  value = "",
  onChange,
  required,
}: ServicePickerProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="radiogroup" aria-label="Type de service">
      {SERVICES.map((service) => {
        const isSelected = value === service.value
        return (
          <label
            key={service.value}
            className={`cursor-pointer rounded-lg border-2 p-4 transition-colors ${
              isSelected
                ? "border-dr-tri-primary bg-dr-tri-light-green/30"
                : "border-dr-tri-border bg-white hover:border-dr-tri-primary"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={service.value}
              checked={isSelected}
              onChange={() => onChange?.(service.value)}
              required={required}
              className="sr-only"
            />
            <span className="font-medium text-dr-tri-dark">{service.label}</span>
          </label>
        )
      })}
    </div>
  )
}
