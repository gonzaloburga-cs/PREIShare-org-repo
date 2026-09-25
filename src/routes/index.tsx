import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <h1 className="display-title mb-5 text-4xl font-bold tracking-tight text-[var(--sea-ink)]">
        PREIshare
      </h1>
      <p className="max-w-2xl text-base text-[var(--sea-ink-soft)]">
        Investor dashboard shell — starter home route.
      </p>
    </main>
  )
}
