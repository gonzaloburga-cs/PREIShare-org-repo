/**
 * How a contact relates to the listed asset.
 * Field names follow `docs/domain/listing-field-inventory.md`.
 * One row per relevant contact — compose as `ownership: Ownership[]` on the listing.
 */

/** Closed ownership relationships — not free text. */
export type OwnershipRelationship =
  | "primary_owner"
  | "co_owner"
  | "broker"
  | "property_manager";

export interface Ownership {
  /**
   * Which contact this row refers to.
   * Pass {@link InvestorContact.id} (or the contact name) — not a loose object.
   */
  contactNameOrId: string;

  /** Relationship to the asset. */
  relationship: OwnershipRelationship;

  /** Optional ownership share (0–100). */
  sharePercent?: number;
}
