// Create page under the protected /dashboard layout. Submit goes through createListing.
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import {
  ListingForm,
  type ListingFieldErrors,
  type ListingFormValues,
} from '../../../components/listings/ListingForm'
import { createListingSchema } from '../../../lib/listings/schema'
import { createListing } from '../../../server/listings'

export const Route = createFileRoute('/dashboard/listings/new')({
  component: NewListingPage,
})

function fieldErrorsFrom(error: {
  flatten: () => { fieldErrors: Record<string, string[] | undefined> }
}): ListingFieldErrors {
  const flattened = error.flatten().fieldErrors
  return Object.fromEntries(
    Object.entries(flattened).flatMap(([key, messages]) =>
      messages && messages.length > 0 ? [[key, messages]] : [],
    ),
  )
}

function NewListingPage() {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<ListingFieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(values: ListingFormValues) {
    setErrorMessage(null)
    setFieldErrors({})
    const parsed = createListingSchema.safeParse(values)
    if (!parsed.success) {
      setErrorMessage('Check the listing fields and try again.')
      setFieldErrors(fieldErrorsFrom(parsed.error))
      return
    }

    setIsSubmitting(true)
    try {
      const result = await createListing({ data: values })
      if (!result.ok) {
        setErrorMessage(result.error)
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors)
        }
        return
      }
      await navigate({ to: '/dashboard/listings' })
    } catch (caught) {
      setErrorMessage(
        caught instanceof Error ? caught.message : 'Could not create listing.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section aria-labelledby="new-listing-heading" className="flex flex-col gap-4">
      <h1 id="new-listing-heading" className="text-2xl font-semibold text-slate-900">
        Add a property listing
      </h1>
      <ListingForm
        onSubmit={handleSubmit}
        submitLabel="Create listing"
        errorMessage={errorMessage}
        fieldErrors={fieldErrors}
        isSubmitting={isSubmitting}
      />
      <Link to="/dashboard/listings" className="w-fit text-sm text-slate-700">
        Back to your listings
      </Link>
    </section>
  )
}
