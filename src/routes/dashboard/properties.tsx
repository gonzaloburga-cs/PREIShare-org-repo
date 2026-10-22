// Sponsor property list. The query uses the session server client and does not
// filter by sponsor id in React. Postgres RLS (owner_id = auth.uid()) limits rows.
import { Link, createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import type { ListingStatus } from '../../lib/supabase/types'

export type PropertyListItem = {
  id: string
  title: string
  address_line1: string
  city: string
  status: ListingStatus
  price: number
  created_at: string
  updated_at: string
}

const loadSponsorProperties = createServerFn({ method: 'GET' }).handler(
  async (): Promise<{ properties: PropertyListItem[]; error: string | null }> => {
    const { getCookie } = await import('@tanstack/react-start/server')
    const { createSupabaseServerClient } = await import('../../lib/supabase.server')

    const accessToken = getCookie('__Host-sb-access-token')
    if (!accessToken) {
      throw redirect({ to: '/login' })
    }

    const supabase = createSupabaseServerClient({
      get(name) {
        const value = getCookie(name)
        return value ? { value } : undefined
      },
    })

    const { data: userData, error: userError } = await supabase.auth.getUser(
      accessToken,
    )
    if (userError || !userData.user) {
      throw redirect({ to: '/login' })
    }

    const { data, error } = await supabase
      .from('property_listings')
      .select(
        'id, title, address_line1, city, status, price, created_at, updated_at',
      )
      .order('created_at', { ascending: false })

    if (error) {
      return { properties: [], error: 'Could not load properties. Try again.' }
    }

    return { properties: data ?? [], error: null }
  },
)

export const Route = createFileRoute('/dashboard/properties')({
  loader: () => loadSponsorProperties(),
  component: PropertiesPage,
})

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

function formatWhen(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function PropertiesPage() {
  const { properties, error } = Route.useLoaderData()

  return (
    <section className="flex flex-col gap-4" aria-labelledby="properties-heading">
      <header className="flex flex-col gap-1">
        <h1 id="properties-heading" className="text-2xl font-semibold text-slate-900">
          Your properties
        </h1>
        <p className="text-sm text-[var(--sea-ink-soft)]">
          Listings you are allowed to manage. The database only returns rows
          owned by the signed-in sponsor.
        </p>
      </header>

      {error ? (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {!error && properties.length === 0 ? (
        <div className="flex flex-col gap-2">
          <p className="font-medium text-slate-900">No properties yet</p>
          <p className="text-sm text-[var(--sea-ink-soft)]">
            When you add a listing, it will show up here for your sponsor
            account only.
          </p>
          <Link
            to="/dashboard/listings/new"
            className="w-fit rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Add listing
          </Link>
        </div>
      ) : null}

      {properties.length > 0 ? (
        <ul className="m-0 list-none divide-y divide-[var(--line)] rounded-md border border-[var(--line)] p-0">
          {properties.map((property) => (
            <li
              key={property.id}
              className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-slate-900">{property.title}</p>
                <p className="text-sm text-[var(--sea-ink-soft)]">
                  {property.address_line1}, {property.city}
                </p>
                <p className="text-sm text-[var(--sea-ink-soft)]">
                  {formatPrice(property.price)}
                </p>
                <p className="text-sm text-[var(--sea-ink-soft)]">
                  Created {formatWhen(property.created_at)}
                </p>
                <p className="text-sm text-[var(--sea-ink-soft)]">
                  Updated {formatWhen(property.updated_at)}
                </p>
              </div>
              <span className="text-xs uppercase tracking-wide text-[var(--sea-ink-soft)]">
                {property.status}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
