/**
 * Closed set of listing lifecycle states from the domain brief / field inventory.
 * This union is the single source of allowed status spellings—no free text.
 */
export type ListingStatus =
  | "draft"
  | "published"
  | "under_offer"
  | "sold"
  | "archived";
