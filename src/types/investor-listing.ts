import type { Address } from "./address";
import type { FinancialSummary } from "./financial-summary";
import type { InvestorContact } from "./investor-contact";
import type { Ownership } from "./ownership";
import type { PropertyType } from "./property-type";

/**
 * Fields every investor listing has, regardless of status.
 * Nested types stay as composed objects from earlier steps.
 *
 * Source of truth: `docs/domain/investor-listing-domain-brief.md`
 */
export interface InvestorListingBase {
  /** Stable identity — do not reassign after create. */
  readonly id: string;

  /** Set once when the row is created. */
  readonly createdAt: string;

  /** May change when the listing is edited; still not a business key. */
  readonly updatedAt: string;

  title: string;
  summary: string;
  propertyType: PropertyType;
  address: Address;
  financials: FinancialSummary;
  contacts: InvestorContact[];
  /**
   * Must match {@link InvestorContact.id} of one entry in `contacts`.
   * TypeScript cannot fully enforce "id exists in array" alone.
   */
  primaryContactId: string;
  ownership: Ownership[];
}

/**
 * Discriminated union: TypeScript uses `status` to know which shape you have.
 * `soldAt` is required only when status is `sold` (closed deal in the domain brief).
 */
export type InvestorListing =
  | (InvestorListingBase & {
      status: "draft" | "published" | "under_offer" | "archived";
      /** Not used unless the listing is sold. */
      soldAt?: undefined;
    })
  | (InvestorListingBase & {
      status: "sold";
      /** ISO-8601 datetime — required when the listing is sold. */
      soldAt: string;
    });

/** A listing whose status is the closed deal (`sold`). */
export type SoldInvestorListing = Extract<InvestorListing, { status: "sold" }>;

/** A listing that is not sold. */
export type OpenInvestorListing = Exclude<InvestorListing, { status: "sold" }>;
