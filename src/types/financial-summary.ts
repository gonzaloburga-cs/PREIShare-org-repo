/**
 * Asking price and related metrics for a PREIshare investor listing.
 * Field names follow `docs/domain/listing-field-inventory.md`.
 * Compose this type under `financials` — do not flatten askingPrice onto the listing.
 */

/** Starter closed currency list from the field inventory. */
export type CurrencyCode = "USD";

export interface FinancialSummary {
  /** Listed price amount (numeric, no currency symbol). */
  askingPrice: number;

  /** Currency code — not a free-text label such as "dollars". */
  currency: CurrencyCode;

  /** Optional projected IRR percent. */
  projectedIrrPercent?: number;

  /** Optional cap rate percent. */
  capRatePercent?: number;
}
