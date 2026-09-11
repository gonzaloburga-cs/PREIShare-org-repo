# Listing Field Inventory (PREIshare)

**Companion:** [investor-listing-domain-brief.md](./investor-listing-domain-brief.md)  
**Use:** source of truth when defining TypeScript types. Field names are suggestions the types may adopt; **meanings and shapes are mandatory**.

Allowed **data shapes** in this inventory: `text`, `number`, `yes/no`, `fixed choice`, `nested object`, `list`.

`status` and `propertyType` are **fixed choice** only—never free text, never alternate spellings or casing.

## Identity and classification

| Field | Meaning | Shape | Required? | Example / allowed values |
| --- | --- | --- | --- | --- |
| `id` | Stable unique id for the listing | text | yes | `lst_ev_1001` |
| `title` | Short name shown to investors | text | yes | `Riverfront Multifamily Offering` |
| `description` | Longer investor-facing summary | text | yes for `published`, `under_offer`, and `sold` | `Value-add asset near transit...` |
| `status` | Lifecycle state | **fixed choice** (closed list) | yes | see Status below — never free text |
| `propertyType` | Asset class | **fixed choice** (closed list) | yes | see Property type below — never free text |
| `createdAt` | When the listing record was created | text (datetime) | yes | `2026-03-01T10:00:00Z` |
| `updatedAt` | Last meaningful edit | text (datetime) | yes | `2026-03-15T16:30:00Z` |

## Address (nested object)

`address` is a **nested object**, not a single optional string.

| Field | Meaning | Shape | Required? | Example |
| --- | --- | --- | --- | --- |
| `address` | Locatable property address | nested object | yes | — |
| `address.line1` | Street number and name | text | yes | `500 River Rd` |
| `address.line2` | Unit/suite (if any) | text | no | `Suite 200` |
| `address.city` | City | text | yes | `Austin` |
| `address.region` | State/province/region | text | yes | `TX` |
| `address.postalCode` | Postal code | text | yes | `78701` |
| `address.country` | Country code or name | text | yes | `US` |

## Financial summary (nested object)

`financials` is a **nested object**, not a flat price string.

| Field | Meaning | Shape | Required? | Example |
| --- | --- | --- | --- | --- |
| `financials` | Asking price and related metrics | nested object | yes | — |
| `financials.askingPrice` | Listed price amount | number | yes | `12500000` |
| `financials.currency` | Currency code | **fixed choice** (code, not a sentence) | yes | `USD` |
| `financials.projectedIrrPercent` | Optional projected IRR | number | no | `12.5` |
| `financials.capRatePercent` | Optional cap rate | number | no | `5.8` |

Starter allowed currency: `USD`. Do not store currency as free-text labels (`dollars`, `US Dollar`).

## Investor contacts (list of nested objects)

`contacts` is a **list**. A valid published listing needs at least one contact.

| Field | Meaning | Shape | Required? | Example |
| --- | --- | --- | --- | --- |
| `contacts` | People or firms tied to the listing | list of nested objects | yes (at least one item for `published`+) | — |
| `contacts[].name` | Person or firm name | text | yes (each contact) | `Jordan Lee` |
| `contacts[].role` | Why they appear on the listing | **fixed choice** | yes | `broker`, `owner_rep` |
| `contacts[].email` | Email if used | text | one of email/phone required | `jordan@example.com` |
| `contacts[].phone` | Phone if used | text | one of email/phone required | `+1-512-555-0142` |

Contact `role` allowed values (closed list): `broker`, `owner_rep`.

Each contact must have a name and at least one reachable channel (`email` or `phone`). Both channels may be present. There is no `yes/no` “has email” flag—presence of the text field is the signal.

## Ownership (list of nested objects tied to contacts)

`ownership` is a **list** of nested objects. Each row points at a contact.

| Field | Meaning | Shape | Required? | Example |
| --- | --- | --- | --- | --- |
| `ownership` | How contacts relate to the asset | list of nested objects | yes for `published`+ (one row per relevant contact) | — |
| `ownership[].contactNameOrId` | Which contact the row refers to | text | yes | `Jordan Lee` or a contact id |
| `ownership[].relationship` | Relationship to the asset | **fixed choice** | yes | see list below |
| `ownership[].sharePercent` | Optional ownership share | number | no | `60` |

Ownership `relationship` allowed values (closed list): `primary_owner`, `co_owner`, `broker`, `property_manager`. Never free text (`owner`, `Primary Owner`, `PM`).

## Inventory rules (must hold)

1. Do not invent extra top-level groups beyond identity, address, financials, contacts, and ownership without updating the domain brief.
2. `status` and `propertyType` must remain closed lists (union candidates)—**never free text**.
3. Address and financials are nested objects, not flat optional strings only.
4. Contacts are a list (array); a valid published listing needs at least one contact.
5. Every required field above must appear in later TypeScript interfaces unless the decision record deliberately relaxes it.
6. Optional fields (`address.line2`, projected IRR, cap rate, `sharePercent`, a missing email when phone is present) may be absent. Required fields must never be missing for `published`, `under_offer`, or `sold`.
