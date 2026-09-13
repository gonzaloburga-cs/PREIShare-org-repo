/**
 * Closed set of property categories (asset class) from the domain brief / field inventory.
 * Only these exact snake_case strings are allowed—no free text or display labels.
 */
export type PropertyType =
  | "multifamily"
  | "office"
  | "retail"
  | "industrial"
  | "mixed_use"
  | "land";
