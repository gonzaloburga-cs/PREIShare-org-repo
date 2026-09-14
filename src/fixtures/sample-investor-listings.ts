import type { InvestorListing } from "../types";

/**
 * Published multifamily listing with full nested shapes.
 * Tutorial sample used status `"active"`; PREIshare's closed list uses `"published"`.
 */
export const sampleActiveListing: InvestorListing = {
  id: "listing-001",
  title: "Riverfront Multifamily — 24 Units",
  summary: "Value-add multifamily asset near transit in central Austin.",
  status: "published",
  propertyType: "multifamily",
  address: {
    line1: "1200 River Rd",
    line2: "Suite 100",
    city: "Austin",
    region: "TX",
    postalCode: "78701",
    country: "US",
  },
  financials: {
    askingPrice: 4250000,
    currency: "USD",
    projectedIrrPercent: 12.5,
    capRatePercent: 7.3,
  },
  contacts: [
    {
      id: "contact-001",
      name: "Jordan Lee",
      email: "jordan.lee@example.com",
      phone: "+1-512-555-0142",
      role: "broker",
    },
  ],
  primaryContactId: "contact-001",
  ownership: [
    {
      contactNameOrId: "contact-001",
      relationship: "broker",
      sharePercent: 100,
    },
  ],
  createdAt: "2026-03-01T10:00:00Z",
  updatedAt: "2026-03-15T16:30:00Z",
};

/** Draft listing — still being prepared. */
export const sampleDraftListing: InvestorListing = {
  id: "listing-002",
  title: "Draft — Oak Street Retail Pad",
  summary: "Retail pad still in internal review; not visible to investors.",
  status: "draft",
  propertyType: "retail",
  address: {
    line1: "88 Oak St",
    city: "Dallas",
    region: "TX",
    postalCode: "75201",
    country: "US",
  },
  financials: {
    askingPrice: 980000,
    currency: "USD",
  },
  contacts: [
    {
      id: "contact-002",
      name: "Morgan Patel",
      email: "morgan.patel@example.com",
      role: "owner_rep",
    },
  ],
  primaryContactId: "contact-002",
  ownership: [
    {
      contactNameOrId: "contact-002",
      relationship: "primary_owner",
      sharePercent: 100,
    },
  ],
  createdAt: "2026-04-01T09:00:00Z",
  updatedAt: "2026-04-02T11:15:00Z",
};

/**
 * Under-offer listing — exercises the `under_offer` branch.
 * Tutorial sample used `"under_contract"`.
 */
export const sampleUnderContractListing: InvestorListing = {
  id: "listing-003",
  title: "Cedar Industrial — Under Offer",
  summary: "Industrial asset with active investor interest.",
  status: "under_offer",
  propertyType: "industrial",
  address: {
    line1: "4500 Cedar Blvd",
    city: "Houston",
    region: "TX",
    postalCode: "77002",
    country: "US",
  },
  financials: {
    askingPrice: 6100000,
    currency: "USD",
    capRatePercent: 7.5,
  },
  contacts: [
    {
      id: "contact-003",
      name: "Sam Rivera",
      email: "sam.rivera@example.com",
      role: "owner_rep",
    },
  ],
  primaryContactId: "contact-003",
  ownership: [
    {
      contactNameOrId: "contact-003",
      relationship: "co_owner",
      sharePercent: 60,
    },
  ],
  createdAt: "2026-02-10T14:00:00Z",
  updatedAt: "2026-03-20T08:45:00Z",
};

/**
 * Sold listing — historical closed deal; `soldAt` is required on this branch.
 * Tutorial sample used status `"closed"` and `closedAt`.
 */
export const sampleClosedListing: InvestorListing = {
  id: "listing-004",
  title: "Summit Office — Sold",
  summary: "Office sale retained for history after close.",
  status: "sold",
  soldAt: "2026-01-22T18:00:00Z",
  propertyType: "office",
  address: {
    line1: "1 Summit Plaza",
    city: "San Antonio",
    region: "TX",
    postalCode: "78205",
    country: "US",
  },
  financials: {
    askingPrice: 2750000,
    currency: "USD",
    capRatePercent: 7.2,
  },
  contacts: [
    {
      id: "contact-004",
      name: "Alex Chen",
      email: "alex.chen@example.com",
      role: "broker",
    },
  ],
  primaryContactId: "contact-004",
  ownership: [
    {
      contactNameOrId: "contact-004",
      relationship: "primary_owner",
      sharePercent: 100,
    },
  ],
  createdAt: "2025-11-01T10:00:00Z",
  updatedAt: "2026-01-22T18:00:00Z",
};

/** All valid samples — useful for later UI mocks and typecheck. */
export const sampleInvestorListings: InvestorListing[] = [
  sampleActiveListing,
  sampleDraftListing,
  sampleUnderContractListing,
  sampleClosedListing,
];
