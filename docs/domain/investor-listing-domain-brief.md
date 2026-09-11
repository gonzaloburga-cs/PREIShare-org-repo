# Investor Listing Domain Brief (PREIshare)

## Purpose

**Investor Listing** is a PREIShare record describing a property opportunity investors can review, including status, address, money fields, and contacts.

This brief is the shared definition those later types must guarantee. It does not specify TypeScript syntax.

## Actors

- **Listing editor (internal ops)** — creates and updates listings before investors see them. May save incomplete `draft` records.
- **Investor (end user)** — browses published listings and relies on complete, consistent data (title, address, price, contacts).
- **Reviewer / compliance** — checks that status, price, and contact info are trustworthy before publish.
- **Future systems** — website UI, API, and database will all read the same listing shape. They are consumers of this model, not extra field sources.

## Business goals

- One shared definition of a listing across screens and teammates.
- Catch missing or invalid data before production (at compile time once types exist).
- Support nested real-world data: address, financial summary, investor contacts, ownership.
- Keep lifecycle **status** and **property type** as closed lists so “Published”, `PUBLISHED`, and `published` cannot mean three different things.
- Do not invent extra top-level groups beyond identity, address, financials, contacts, and ownership without updating this brief.

## Listing lifecycle statuses

Allowed values only. Status is never free text.

| Status | Who can see it | Meaning |
| --- | --- | --- |
| `draft` | Internal only | Not visible to investors. Required published-level fields may still be missing. |
| `published` | Investors | Visible in browse; must meet full validity rules. |
| `under_offer` | Investors | Active interest; still structured like a published listing. |
| `sold` | History / internal (and any agreed history views) | Closed deal; retained for history. Same structural completeness as published. |
| `archived` | Not in active browse | Removed from active browse; not deleted. |

No other spellings, synonyms, or casing variants are valid (`live`, `active`, `under offer`, `UNDER_OFFER`, and so on are out).

## Nested data groups

A listing is not a flat bag of optional strings. These groups are nested objects (or lists of objects).

### Address

Enough to locate the property:

- Street line 1 (required)
- Street line 2 / unit / suite (optional)
- City (required)
- Region / state / province (required)
- Postal code (required)
- Country (required)

### Financial summary

- Asking price — numeric amount (required for a valid listing)
- Currency — code such as `USD` (required)
- Projected return metrics the team agrees to track — optional

### Investor contacts

One or more people (or firms) tied to the listing:

- Name (required on each contact)
- Role on the listing (from an agreed set, e.g. `broker`, `owner_rep`)
- Reachable channel: **email or phone** (at least one of those two on each contact)

A valid published listing has **at least one** contact.

### Ownership

How contacts relate to the asset. Each row points at a contact and uses a **fixed** relationship, not free text:

- `primary_owner`
- `co_owner`
- `broker`

Optional ownership share (percent) may be present.

## Core identity fields (high level)

- Stable listing id (non-empty)
- Human-readable title (non-empty)
- Property type — fixed set only: `multifamily`, `office`, `retail`, `industrial`, `mixed_use`, `land`
- Status — from the lifecycle list above
- Short description for investors (required once the listing is `published`, `under_offer`, or `sold`)
- Created / updated timestamps (as business concepts; exact string format decided later)

## Success criteria — a valid investor listing

A listing is **valid** for investor-facing lifecycle states (`published`, `under_offer`, `sold`) when all of the following hold:

1. Has a non-empty id and title.
2. Status is exactly one of the allowed lifecycle values (no free-text variants).
3. Property type is exactly one of the allowed property-type values.
4. Address includes enough fields to locate the property (street, city, region/state, postal code, country).
5. Financial summary includes a numeric asking price and a currency code.
6. At least one investor contact with a name and a reachable channel (email or phone).
7. Ownership relationship for each contact is from an agreed fixed set (not free text).
8. Optional fields may be absent; required fields above must never be missing for `published`, `under_offer`, or `sold`.

`draft` and `archived` still use the same field names and nested groups. `draft` may be incomplete while editors work. `archived` is removed from active browse, not deleted. Types in later steps must still use this shape—not a second, looser listing type.

## Out of scope for this topic

- Building UI forms, API routes, or database tables.
- Authentication, payments, or document uploads.
- Exact TypeScript syntax (comes in later steps).
- Extra top-level groups (documents, photos, payments, auth) unless this brief is updated first.

## Handoff note

Later steps must implement types that honor this brief and the companion field inventory. If a type allows a status, property type, ownership relationship, or top-level field group not listed here, the type is wrong.
