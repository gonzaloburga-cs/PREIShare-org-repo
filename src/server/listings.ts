// Server-only listing reads and writes. No UI routes in this file.
// Uses the sponsor session client so row-level security still applies.
import { createServerFn } from '@tanstack/react-start'
import type { ListingStatus } from '../lib/supabase/types'
import {
  createListingSchema,
  updateListingSchema,
  type CreateListingInput,
  type UpdateListingInput,
} from '../lib/listings/schema'

export type ListingRow = {
  id: string
  owner_id: string
  title: string
  description: string | null
  address_line1: string
  city: string
  region: string | null
  postal_code: string | null
  country: string
  price: number
  status: ListingStatus
  created_at: string
  updated_at: string
}

export type ListingsResult =
  | { ok: true; listings: ListingRow[] }
  | { ok: false; error: string }

export type ListingMutationResult =
  | { ok: true; listing: ListingRow }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> }

type Sponsor = { userId: string; accessToken: string }

async function requireSponsor(): Promise<Sponsor | null> {
  const { getSession } = await import('../lib/auth/session')
  const session = await getSession()
  if (!session?.user.id || !session.access_token) return null
  return { userId: session.user.id, accessToken: session.access_token }
}

async function sponsorListingsClient(accessToken: string) {
  const { createServerSupabaseClient } = await import('../lib/supabase/server')
  return createServerSupabaseClient(accessToken)
}

function fieldErrorsFrom(error: {
  flatten: () => { fieldErrors: Record<string, string[] | undefined> }
}): Record<string, string[]> {
  const flattened = error.flatten().fieldErrors
  return Object.fromEntries(
    Object.entries(flattened).flatMap(([key, messages]) =>
      messages && messages.length > 0 ? [[key, messages]] : [],
    ),
  )
}

function listingPatch(input: UpdateListingInput): Partial<ListingRow> {
  const { id: _id, ...rest } = input
  return Object.fromEntries(
    Object.entries(rest).filter((entry) => entry[1] !== undefined),
  ) as Partial<ListingRow>
}

/** Listings for the signed-in sponsor only. */
export const listMyListings = createServerFn({ method: 'GET' }).handler(
  async (): Promise<ListingsResult> => {
    const sponsor = await requireSponsor()
    if (!sponsor) {
      return { ok: false, error: 'You must be signed in to view listings.' }
    }

    const supabase = await sponsorListingsClient(sponsor.accessToken)
    const { data, error } = await supabase
      .from('property_listings')
      .select('*')
      .eq('owner_id', sponsor.userId)
      .order('created_at', { ascending: false })

    if (error) {
      return { ok: false, error: 'Could not load listings. Try again.' }
    }

    return { ok: true, listings: data ?? [] }
  },
)

/** Create a listing owned by the session user. The body cannot set owner_id. */
export const createListing = createServerFn({ method: 'POST' })
  .validator((input: unknown) => input)
  .handler(async ({ data }): Promise<ListingMutationResult> => {
    const parsed = createListingSchema.safeParse(data)
    if (!parsed.success) {
      return {
        ok: false,
        error: 'Check the listing fields and try again.',
        fieldErrors: fieldErrorsFrom(parsed.error),
      }
    }

    const sponsor = await requireSponsor()
    if (!sponsor) {
      return { ok: false, error: 'You must be signed in to create a listing.' }
    }

    const input: CreateListingInput = parsed.data
    const supabase = await sponsorListingsClient(sponsor.accessToken)
    const { data: row, error } = await supabase
      .from('property_listings')
      .insert({
        owner_id: sponsor.userId,
        title: input.title,
        description: input.description,
        address_line1: input.address_line1,
        city: input.city,
        region: input.region,
        postal_code: input.postal_code,
        country: input.country,
        price: input.price,
        status: input.status,
      })
      .select('*')
      .single()

    if (error || !row) {
      return {
        ok: false,
        error: 'Could not create listing. Check your input and try again.',
      }
    }

    return { ok: true, listing: row }
  })

/** Update a listing only when this sponsor owns the row. */
export const updateListing = createServerFn({ method: 'POST' })
  .validator((input: unknown) => input)
  .handler(async ({ data }): Promise<ListingMutationResult> => {
    const parsed = updateListingSchema.safeParse(data)
    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues.some(
          (issue) => issue.message === 'No fields to update.',
        )
          ? 'No fields to update.'
          : 'Check the listing fields and try again.',
        fieldErrors: fieldErrorsFrom(parsed.error),
      }
    }

    const sponsor = await requireSponsor()
    if (!sponsor) {
      return { ok: false, error: 'You must be signed in to update a listing.' }
    }

    const patch = listingPatch(parsed.data)
    const supabase = await sponsorListingsClient(sponsor.accessToken)
    const { data: row, error } = await supabase
      .from('property_listings')
      .update(patch)
      .eq('id', parsed.data.id)
      .eq('owner_id', sponsor.userId)
      .select('*')
      .single()

    if (error || !row) {
      return {
        ok: false,
        error:
          'Could not update listing. It may not exist or you may not own it.',
      }
    }

    return { ok: true, listing: row }
  })
