import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/portfolio')({
  component: PortfolioPage,
})

function PortfolioPage() {
  return (
    <section aria-labelledby="portfolio-heading">
      <h2 id="portfolio-heading" className="text-xl font-semibold">
        Portfolio
      </h2>
      <p className="mt-2 max-w-prose text-slate-600">
        Holdings will appear here.
      </p>
    </section>
  )
}
