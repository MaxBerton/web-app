"use client"

import { useState } from "react"

type PasswordWithToggleProps = {
  name: string
  label: string
  required?: boolean
  minLength?: number
  className?: string
  hint?: string
}

export function PasswordWithToggle({
  name,
  label,
  required = true,
  minLength,
  className,
  hint,
}: PasswordWithToggleProps) {
  const [visible, setVisible] = useState(false)

  return (
    <label className="grid gap-1.5 text-dr-tri-dark">
      {label}
      <span className="relative flex">
        <input
          type={visible ? "text" : "password"}
          name={name}
          required={required}
          minLength={minLength}
          className={className}
          autoComplete={name === "password" ? "new-password" : "new-password"}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-dr-tri-muted hover:bg-dr-tri-background hover:text-dr-tri-dark"
          aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          tabIndex={-1}
        >
          {visible ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </span>
      {hint && <span className="text-xs text-dr-tri-muted">{hint}</span>}
    </label>
  )
}
