import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/portfolio')({
  component: PortfolioPage,
})

function PortfolioPage() {
  return (
    <main>
      <h1 className="display-title mb-3 text-3xl font-bold tracking-tight text-[var(--sea-ink)]">
        Portfolio
      </h1>
      <p className="max-w-2xl text-base text-[var(--sea-ink-soft)]">
        Placeholder for holdings and performance.
      </p>
    </main>
  )
}
