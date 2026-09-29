import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <h1 className="display-title mb-5 text-4xl font-bold tracking-tight text-[var(--sea-ink)]">
        PREIshare
      </h1>
      <p className="mb-6 max-w-2xl text-base text-[var(--sea-ink-soft)]">
        Investor dashboard shell — starter home route.
      </p>
      <Link
        to="/dashboard"
        className="inline-block rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-[var(--lagoon-deep)] no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]"
      >
        Open dashboard
      </Link>
    </main>
  )
}
