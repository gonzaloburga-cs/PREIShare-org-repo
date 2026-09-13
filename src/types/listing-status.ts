/**
 * Closed set of listing lifecycle states from the domain brief / field inventory.
 * Only these exact snake_case strings are allowed—no free text or display labels.
 */
export type ListingStatus =
  | "draft"
  | "published"
  | "under_offer"
  | "sold"
  | "archived";
