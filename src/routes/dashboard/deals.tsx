import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/deals')({
  component: DealsPage,
})

function DealsPage() {
  return (
    <section aria-labelledby="deals-heading">
      <h2 id="deals-heading" className="text-xl font-semibold">
        Deals
      </h2>
      <p className="mt-2 max-w-prose text-slate-600">
        Listing rows will appear here.
      </p>
    </section>
  )
}
