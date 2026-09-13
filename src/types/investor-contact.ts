/**
 * A person or firm the team can reach about an investor listing.
 * Field names follow `docs/domain/listing-field-inventory.md`.
 * `id` supports {@link InvestorListing.primaryContactId}; it is not a free-text role.
 */

/** Closed contact roles from the field inventory — not free text. */
export type ContactRole = "broker" | "owner_rep";

interface InvestorContactBase {
  /** Stable id within this listing's contact list. */
  id: string;

  /** Person or firm name. */
  name: string;

  /** Why they appear on the listing. */
  role: ContactRole;
}

/** Contact reachable by email; phone is optional. */
type ContactWithEmail = InvestorContactBase & {
  email: string;
  phone?: string;
};

/** Contact reachable by phone; email is optional. */
type ContactWithPhone = InvestorContactBase & {
  phone: string;
  email?: string;
};

/**
 * At least one reachable channel (`email` or `phone`) is required.
 * Both may be present.
 */
export type InvestorContact = ContactWithEmail | ContactWithPhone;
