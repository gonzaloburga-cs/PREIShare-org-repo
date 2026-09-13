import type { Address } from "./address";
import type { FinancialSummary } from "./financial-summary";
import type { InvestorContact } from "./investor-contact";
import type { ListingStatus } from "./listing-status";
import type { Ownership } from "./ownership";
import type { PropertyType } from "./property-type";

/**
 * Core PREIshare investor listing.
 * Nested groups compose {@link Address}, {@link FinancialSummary},
 * {@link InvestorContact}, and {@link Ownership}.
 *
 * Source of truth: `docs/domain/investor-listing-domain-brief.md`
 * and `docs/domain/listing-field-inventory.md`.
 */
export interface InvestorListing {
  /** Stable unique id for this listing (assigned by the system). */
  id: string;

  /** Short public headline shown in search results and cards. */
  title: string;

  /** Longer plain-text description of the investment opportunity. */
  summary: string;

  /** Lifecycle state — only values from {@link ListingStatus}. */
  status: ListingStatus;

  /** Asset class — only values from {@link PropertyType}. */
  propertyType: PropertyType;

  /** Locatable property address — nested object, not flat street/city fields. */
  address: Address;

  /** Asking price and related metrics — nested object, not a flat askingPrice. */
  financials: FinancialSummary;

  /** One or more people associated with this listing. */
  contacts: InvestorContact[];

  /**
   * Must match {@link InvestorContact.id} of one entry in `contacts`.
   * TypeScript cannot fully enforce "id exists in array" alone;
   * typed as string so callers pass an id, not a whole loose object.
   */
  primaryContactId: string;

  /** Ownership rows tied to contacts — not free-text owner names. */
  ownership: Ownership[];

  /** ISO-8601 datetime string when the listing was first created. */
  createdAt: string;

  /** ISO-8601 datetime string when the listing was last updated. */
  updatedAt: string;
}
