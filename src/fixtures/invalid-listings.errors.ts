/**
 * INTENTIONAL TYPE ERRORS — this file should NOT typecheck cleanly.
 * Each export demonstrates a failure mode documented in
 * docs/type-safety/expected-type-errors.md
 *
 * Objects are annotated as InvestorListing (a check, not `as` / `any` / @ts-ignore)
 * so tsc is forced to report the violations.
 */
import type { InvestorListing } from "../types";

/** Case: status spelled in a way the union does not allow. */
export const invalidStatusSpelling: InvestorListing = {
  id: "listing-bad-status",
  title: "Downtown duplex offering",
  summary: "Should fail because status is not a ListingStatus member.",
  status: "availble",
  propertyType: "multifamily",
  address: {
    line1: "100 Main St",
    city: "Austin",
    region: "TX",
    postalCode: "78701",
    country: "US",
  },
  financials: {
    askingPrice: 450000,
    currency: "USD",
  },
  contacts: [
    {
      id: "contact-bad-001",
      name: "Alex Rivera",
      email: "alex@example.com",
      role: "broker",
    },
  ],
  primaryContactId: "contact-bad-001",
  ownership: [
    { contactNameOrId: "contact-bad-001", relationship: "primary_owner" },
  ],
  createdAt: "2026-05-01T10:00:00Z",
  updatedAt: "2026-05-01T10:00:00Z",
};

/** Case: required nested address field `city` missing. */
export const missingAddressCity: InvestorListing = {
  id: "listing-missing-city",
  title: "Lakeview fourplex",
  summary: "Should fail because Address.city is required.",
  status: "draft",
  propertyType: "multifamily",
  address: {
    line1: "22 Lake Rd",
    region: "TX",
    postalCode: "78702",
    country: "US",
  },
  financials: {
    askingPrice: 520000,
    currency: "USD",
  },
  contacts: [
    {
      id: "contact-bad-002",
      name: "Sam Lee",
      email: "sam@example.com",
      role: "owner_rep",
    },
  ],
  primaryContactId: "contact-bad-002",
  ownership: [
    { contactNameOrId: "contact-bad-002", relationship: "primary_owner" },
  ],
  createdAt: "2026-05-02T10:00:00Z",
  updatedAt: "2026-05-02T10:00:00Z",
};

/** Case: numeric money field given as a string. */
export const priceAsString: InvestorListing = {
  id: "listing-price-string",
  title: "Cedar Street portfolio slice",
  summary: "Should fail because askingPrice must be a number.",
  status: "published",
  propertyType: "multifamily",
  address: {
    line1: "9 Cedar St",
    city: "Dallas",
    region: "TX",
    postalCode: "75201",
    country: "US",
  },
  financials: {
    askingPrice: "610000",
    currency: "USD",
  },
  contacts: [
    {
      id: "contact-bad-003",
      name: "Jordan Kim",
      email: "jordan@example.com",
      role: "broker",
    },
  ],
  primaryContactId: "contact-bad-003",
  ownership: [
    { contactNameOrId: "contact-bad-003", relationship: "primary_owner" },
  ],
  createdAt: "2026-05-03T10:00:00Z",
  updatedAt: "2026-05-03T10:00:00Z",
};

/** Case: published listing with no contacts — investors would have no one to reach. */
export const emptyPublishedContacts: InvestorListing = {
  id: "listing-empty-contacts",
  title: "Westlake mixed-use offering",
  summary: "Should fail because published listings need at least one contact.",
  status: "published",
  propertyType: "mixed_use",
  address: {
    line1: "400 Westlake Dr",
    city: "Austin",
    region: "TX",
    postalCode: "78746",
    country: "US",
  },
  financials: {
    askingPrice: 8900000,
    currency: "USD",
  },
  contacts: [],
  primaryContactId: "contact-missing",
  ownership: [
    { contactNameOrId: "contact-missing", relationship: "primary_owner" },
  ],
  createdAt: "2026-05-04T10:00:00Z",
  updatedAt: "2026-05-04T10:00:00Z",
};

/** Case: published listing with no ownership rows. */
export const emptyPublishedOwnership: InvestorListing = {
  id: "listing-empty-ownership",
  title: "Eastside land parcel",
  summary: "Should fail because published listings need at least one ownership row.",
  status: "published",
  propertyType: "land",
  address: {
    line1: "12 Manor Rd",
    city: "Austin",
    region: "TX",
    postalCode: "78723",
    country: "US",
  },
  financials: {
    askingPrice: 2100000,
    currency: "USD",
  },
  contacts: [
    {
      id: "contact-bad-004",
      name: "Riley Brooks",
      email: "riley@example.com",
      role: "owner_rep",
    },
  ],
  primaryContactId: "contact-bad-004",
  ownership: [],
  createdAt: "2026-05-05T10:00:00Z",
  updatedAt: "2026-05-05T10:00:00Z",
};
