// Create a property for the signed-in sponsor.
// owner_id comes from the session. The form cannot set it.
// RLS WITH CHECK (owner_id = auth.uid()) rejects any other owner.
import { Link, createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useState, type FormEvent } from 'react'
import { z } from 'zod'

const createPropertyInput = z.object({
  title: z.string().trim().min(1, 'Title is required.').max(200),
  address: z.string().trim().min(1, 'Address is required.').max(300),
  city: z.string().trim().min(1, 'City is required.').max(120),
  description: z.string().trim().max(5000).optional(),
  price: z.coerce.number().nonnegative('Price must be zero or greater.'),
})

export const createProperty = createServerFn({ method: 'POST' })
  .validator((data: unknown) => data)
  .handler(async ({ data }) => {
    const parsed = createPropertyInput.safeParse(data)
    if (!parsed.success) {
      return {
        ok: false as const,
        error: parsed.error.issues[0]?.message ?? 'Check the fields and try again.',
      }
    }

    const { getCookie } = await import('@tanstack/react-start/server')
    const { createSupabaseServerClient } = await import('../../lib/supabase.server')

    const accessToken = getCookie('__Host-sb-access-token')
    if (!accessToken) {
      return { ok: false as const, error: 'You must be signed in to add a property.' }
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
      return { ok: false as const, error: 'You must be signed in to add a property.' }
    }

    const description = parsed.data.description
    const { data: row, error } = await supabase
      .from('property_listings')
      .insert({
        owner_id: userData.user.id,
        title: parsed.data.title,
        address_line1: parsed.data.address,
        city: parsed.data.city,
        description: description && description.length > 0 ? description : null,
        price: parsed.data.price,
        country: 'US',
        status: 'draft',
      })
      .select('id')
      .single()

    if (error || !row) {
      return {
        ok: false as const,
        error: error?.message ?? 'Could not save the property.',
      }
    }

    return { ok: true as const, id: row.id }
  })

export const Route = createFileRoute('/dashboard/properties/new')({
  component: NewPropertyPage,
})

const inputClassName =
  'rounded-md border border-slate-300 px-3 py-2 text-[var(--sea-ink-soft)]'

function NewPropertyPage() {
  const navigate = useNavigate()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setPending(true)

    try {
      const result = await createProperty({
        data: { title, address, city, price, description },
      })

      if (!result.ok) {
        setError(result.error)
        return
      }

      await router.invalidate()
      await navigate({ to: '/dashboard/properties' })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not save the property.')
    } finally {
      setPending(false)
    }
  }

  return (
    <section className="flex max-w-lg flex-col gap-4" aria-labelledby="new-property-heading">
      <h1 id="new-property-heading" className="text-2xl font-semibold text-slate-900">
        Add property
      </h1>
      <p className="text-sm text-[var(--sea-ink-soft)]">
        New listings are saved for your sponsor account only. The database
        rejects a row that is not owned by the signed-in sponsor.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm text-[var(--sea-ink-soft)]">
          Title
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            disabled={pending}
            className={inputClassName}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[var(--sea-ink-soft)]">
          Address
          <input
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            required
            disabled={pending}
            className={inputClassName}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[var(--sea-ink-soft)]">
          City
          <input
            value={city}
            onChange={(event) => setCity(event.target.value)}
            required
            disabled={pending}
            className={inputClassName}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[var(--sea-ink-soft)]">
          Price
          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            required
            disabled={pending}
            className={inputClassName}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[var(--sea-ink-soft)]">
          Description
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            disabled={pending}
            rows={4}
            className={inputClassName}
          />
        </label>

        {error ? (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="w-fit rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? 'Saving…' : 'Create property'}
        </button>
      </form>

      <div className="flex gap-4">
        <Link to="/dashboard/properties" className="text-sm text-[var(--sea-ink-soft)]">
          Back to your properties
        </Link>
        <Link to="/dashboard/listings" className="text-sm text-[var(--sea-ink-soft)]">
          Back to your listings
        </Link>
      </div>
    </section>
  )
}
