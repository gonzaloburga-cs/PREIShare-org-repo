// Validation shared by server actions and later listing forms.
// Columns match docs/data-model/property-listings-schema.md and property_listings.
import { z } from 'zod'

/** Allowed listing status values — same check as the Postgres constraint. */
export const listingStatusSchema = z.enum(['draft', 'published', 'archived'])

/** Omitted text becomes null. Use on create. */
const nullableText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value && value.length > 0 ? value : null))

/** Omitted text stays omitted. Use on update so a missing field is not cleared. */
const patchText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => {
      if (value === undefined) return undefined
      return value.length > 0 ? value : null
    })

export const createListingSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  description: z
    .string()
    .trim()
    .max(5000)
    .optional()
    .transform((value) => (value && value.length > 0 ? value : null)),
  address_line1: z.string().trim().min(1, 'Address is required').max(300),
  city: z.string().trim().min(1, 'City is required').max(120),
  region: nullableText(120),
  postal_code: nullableText(20),
  country: z.string().trim().min(2).max(80).default('US'),
  price: z.coerce.number().nonnegative('Price must be zero or greater'),
  status: listingStatusSchema.default('draft'),
})

export const updateListingSchema = z
  .object({
    id: z.uuid('Listing id must be a valid UUID'),
    title: z.string().trim().min(1, 'Title is required').max(200).optional(),
    description: z
      .string()
      .trim()
      .max(5000)
      .nullable()
      .optional()
      .transform((value) => {
        if (value === undefined) return undefined
        if (value == null) return null
        return value.length > 0 ? value : null
      }),
    address_line1: z
      .string()
      .trim()
      .min(1, 'Address is required')
      .max(300)
      .optional(),
    city: z.string().trim().min(1, 'City is required').max(120).optional(),
    region: patchText(120),
    postal_code: patchText(20),
    country: z.string().trim().min(2).max(80).optional(),
    price: z.coerce
      .number()
      .nonnegative('Price must be zero or greater')
      .optional(),
    status: listingStatusSchema.optional(),
  })
  .refine(
    (value) =>
      value.title !== undefined ||
      value.description !== undefined ||
      value.address_line1 !== undefined ||
      value.city !== undefined ||
      value.region !== undefined ||
      value.postal_code !== undefined ||
      value.country !== undefined ||
      value.price !== undefined ||
      value.status !== undefined,
    { message: 'No fields to update.' },
  )

export type CreateListingInput = z.infer<typeof createListingSchema>
export type UpdateListingInput = z.infer<typeof updateListingSchema>
