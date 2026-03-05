import Link from "next/link"

export default function EmailConfirmedPage() {
  return (
    <main id="content" className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <section className="w-full max-w-xl rounded-dr-tri-lg border border-dr-tri-border bg-white p-8 shadow-sm md:p-10 text-center">
        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600" aria-hidden>
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-dr-tri-dark">Email confirmé</h1>
        <p className="mt-3 text-dr-tri-muted">
          Votre adresse email a bien été vérifiée. Vous pouvez maintenant vous connecter à votre compte.
        </p>
        <div className="mt-8">
          <Link href="/auth/login" className="btn-primary inline-flex w-full justify-center sm:w-auto">
            Se connecter
          </Link>
        </div>
      </section>
    </main>
  )
}
