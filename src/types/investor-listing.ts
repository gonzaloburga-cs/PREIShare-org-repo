import type { Address } from "./address";
import type { FinancialSummary } from "./financial-summary";
import type { ListingStatus } from "./listing-status";
import type { PropertyType } from "./property-type";

/**
 * Core PREIshare investor listing.
 * Nested `address` and `financials` compose {@link Address} and {@link FinancialSummary}.
 * Contacts are added in a later step.
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

  /** ISO-8601 datetime string when the listing was first created. */
  createdAt: string;

  /** ISO-8601 datetime string when the listing was last updated. */
  updatedAt: string;
}
