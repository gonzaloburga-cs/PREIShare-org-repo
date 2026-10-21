// Labeled fields for createListingSchema. No server client and no env access.
import { listingStatusSchema } from '../../lib/listings/schema'

export type ListingFormValues = {
  title: string
  description: string
  address_line1: string
  city: string
  region: string
  postal_code: string
  country: string
  price: string
  status: (typeof listingStatusSchema.options)[number]
}

export type ListingFieldErrors = Partial<Record<keyof ListingFormValues, string[]>>

export type ListingFormProps = {
  onSubmit: (values: ListingFormValues) => void | Promise<void>
  submitLabel?: string
  errorMessage?: string | null
  fieldErrors?: ListingFieldErrors
  isSubmitting?: boolean
}

const inputClassName =
  'rounded-md border border-slate-300 px-3 py-2 text-[var(--sea-ink-soft)]'

function fieldMessage(
  fieldErrors: ListingFieldErrors | undefined,
  name: keyof ListingFormValues,
): string | null {
  const messages = fieldErrors?.[name]
  if (!messages || messages.length === 0) return null
  return messages.join(' ')
}

export function ListingForm({
  onSubmit,
  submitLabel = 'Save listing',
  errorMessage = null,
  fieldErrors,
  isSubmitting = false,
}: ListingFormProps) {
  return (
    <form
      className="flex max-w-xl flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        const form = event.currentTarget
        const data = new FormData(form)
        const status = String(data.get('status') ?? 'draft')
        void onSubmit({
          title: String(data.get('title') ?? ''),
          description: String(data.get('description') ?? ''),
          address_line1: String(data.get('address_line1') ?? ''),
          city: String(data.get('city') ?? ''),
          region: String(data.get('region') ?? ''),
          postal_code: String(data.get('postal_code') ?? ''),
          country: String(data.get('country') ?? '') || 'US',
          price: String(data.get('price') ?? ''),
          status: listingStatusSchema.options.includes(
            status as ListingFormValues['status'],
          )
            ? (status as ListingFormValues['status'])
            : 'draft',
        })
      }}
    >
      {errorMessage ? (
        <p role="alert" className="text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}

      <Field
        id="listing-title"
        name="title"
        label="Title"
        required
        disabled={isSubmitting}
        error={fieldMessage(fieldErrors, 'title')}
      />
      <Field
        id="listing-address"
        name="address_line1"
        label="Address"
        required
        disabled={isSubmitting}
        error={fieldMessage(fieldErrors, 'address_line1')}
      />
      <Field
        id="listing-city"
        name="city"
        label="City"
        required
        disabled={isSubmitting}
        error={fieldMessage(fieldErrors, 'city')}
      />
      <Field
        id="listing-region"
        name="region"
        label="Region"
        disabled={isSubmitting}
        error={fieldMessage(fieldErrors, 'region')}
      />
      <Field
        id="listing-postal-code"
        name="postal_code"
        label="Postal code"
        disabled={isSubmitting}
        error={fieldMessage(fieldErrors, 'postal_code')}
      />
      <Field
        id="listing-country"
        name="country"
        label="Country"
        defaultValue="US"
        disabled={isSubmitting}
        error={fieldMessage(fieldErrors, 'country')}
      />
      <Field
        id="listing-price"
        name="price"
        label="Price"
        type="number"
        min="0"
        step="0.01"
        required
        disabled={isSubmitting}
        error={fieldMessage(fieldErrors, 'price')}
      />

      <div className="flex flex-col gap-1 text-sm text-[var(--sea-ink-soft)]">
        <label htmlFor="listing-status">Status</label>
        <select
          id="listing-status"
          name="status"
          defaultValue="draft"
          disabled={isSubmitting}
          className={inputClassName}
          aria-invalid={fieldMessage(fieldErrors, 'status') ? true : undefined}
        >
          {listingStatusSchema.options.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        {fieldMessage(fieldErrors, 'status') ? (
          <p className="text-sm text-red-700">{fieldMessage(fieldErrors, 'status')}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1 text-sm text-[var(--sea-ink-soft)]">
        <label htmlFor="listing-description">Description</label>
        <textarea
          id="listing-description"
          name="description"
          rows={4}
          disabled={isSubmitting}
          className={inputClassName}
          aria-invalid={fieldMessage(fieldErrors, 'description') ? true : undefined}
        />
        {fieldMessage(fieldErrors, 'description') ? (
          <p className="text-sm text-red-700">
            {fieldMessage(fieldErrors, 'description')}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-fit rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isSubmitting ? 'Saving…' : submitLabel}
      </button>
    </form>
  )
}

function Field({
  id,
  name,
  label,
  error,
  type = 'text',
  required = false,
  disabled = false,
  defaultValue,
  min,
  step,
}: {
  id: string
  name: string
  label: string
  error: string | null
  type?: 'text' | 'number'
  required?: boolean
  disabled?: boolean
  defaultValue?: string
  min?: string
  step?: string
}) {
  return (
    <div className="flex flex-col gap-1 text-sm text-[var(--sea-ink-soft)]">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        disabled={disabled}
        {...(defaultValue !== undefined ? { defaultValue } : {})}
        {...(min !== undefined ? { min } : {})}
        {...(step !== undefined ? { step } : {})}
        className={inputClassName}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error ? (
        <p id={`${id}-error`} className="text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  )
}
