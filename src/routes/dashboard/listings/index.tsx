// List page under the protected /dashboard layout. Data comes from listMyListings.
import { Link, createFileRoute } from '@tanstack/react-router'
import { ListingCard } from '../../../components/listings/ListingCard'
import { listMyListings } from '../../../server/listings'

export const Route = createFileRoute('/dashboard/listings/')({
  loader: () => listMyListings(),
  pendingComponent: ListingsLoading,
  errorComponent: ListingsLoadError,
  component: ListingsIndexPage,
})

function ListingsLoading() {
  return <p className="text-sm text-[var(--sea-ink-soft)]">Loading your listings…</p>
}

function ListingsLoadError({ error }: { error: unknown }) {
  const message = error instanceof Error ? error.message : 'Could not load listings.'
  return (
    <p role="alert" className="text-sm text-red-700">
      {message}
    </p>
  )
}

function ListingsIndexPage() {
  const result = Route.useLoaderData()

  if (!result.ok) {
    return (
      <section aria-labelledby="listings-heading">
        <h1 id="listings-heading" className="text-2xl font-semibold text-slate-900">
          Your property listings
        </h1>
        <p role="alert" className="mt-3 text-sm text-red-700">
          {result.error}
        </p>
      </section>
    )
  }

  if (result.listings.length === 0) {
    return (
      <section aria-labelledby="listings-heading" className="flex flex-col gap-3">
        <h1 id="listings-heading" className="text-2xl font-semibold text-slate-900">
          Your property listings
        </h1>
        <p className="text-sm text-[var(--sea-ink-soft)]">
          No properties yet. Add your first listing to get started.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/dashboard/listings/new"
            className="w-fit rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Add listing
          </Link>
          <Link
            to="/dashboard/properties/new"
            className="w-fit rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900"
          >
            Add property
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section aria-labelledby="listings-heading" className="flex flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 id="listings-heading" className="text-2xl font-semibold text-slate-900">
          Your property listings
        </h1>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/dashboard/listings/new"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Add listing
          </Link>
          <Link
            to="/dashboard/properties/new"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900"
          >
            Add property
          </Link>
        </div>
      </header>
      <ul className="m-0 grid list-none gap-3 p-0">
        {result.listings.map((listing) => (
          <li key={listing.id}>
            <ListingCard
              listing={{
                id: listing.id,
                title: listing.title,
                city: listing.city,
                status: listing.status,
              }}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
