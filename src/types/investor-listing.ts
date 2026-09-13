import type { ListingStatus } from "./listing-status";
import type { PropertyType } from "./property-type";

/**
 * Core PREIshare investor listing — scalars plus closed status / property type.
 * Nested types (address, financials, contacts) are added in later steps.
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

  /**
   * Asking price in whole US dollars (no currency symbol).
   * Example: 450000 means $450,000.
   */
  askingPrice: number;

  /** ISO-8601 datetime string when the listing was first created. */
  createdAt: string;

  /** ISO-8601 datetime string when the listing was last updated. */
  updatedAt: string;
}
