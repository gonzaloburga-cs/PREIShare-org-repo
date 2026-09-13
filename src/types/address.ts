/**
 * Locatable property address for a PREIshare investor listing.
 * Field names follow `docs/domain/listing-field-inventory.md`.
 */
export interface Address {
  /** Street number and name. */
  line1: string;

  /** Unit or suite, if any. */
  line2?: string;

  /** City. */
  city: string;

  /** State, province, or region. */
  region: string;

  /** Postal code. */
  postalCode: string;

  /** Country code or name. */
  country: string;
}
