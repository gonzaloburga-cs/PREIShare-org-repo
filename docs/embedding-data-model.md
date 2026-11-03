# PREIshare embedding data model

## Purpose

Software-ready design for the five semantic-search samples and their embedding vectors.
This doc is the contract for a later pgvector migration, TypeScript types, seed/backfill, and similarity search.
It is not SQL and not application code yet.

## Sources

- `docs/semantic-search-requirements.md`
- `docs/embeddings-learner-notes.md`
- `docs/vector-search-learner-notes.md`

Scope those docs already locked:

- Five sample listings only: S1 Stillwater cottage, S2 Maple cul-de-sac house, S3 Baker street flat, S4 Hay acreage, S5 Harbor office loft.
- Each stored description is copied verbatim from the requirements table. The words listed there as “must stay absent” stay absent.
- One embedding per description. The same model and the same list length are used for every sample and for every buyer query.
- Samples live in their own table. This slice does not change `public.property_listings`, sponsor login, row-level security, or the property create form.
- Search ranks stored vectors by meaning. A keyword search for `cabin` returns no sample rows, while “quiet cabin near water with good rental upside” still returns Stillwater cottage first.

## Overview

Each **sample property** is one of those five investment listings the public `/search` demo can rank.
Each row has human-readable text plus one **embedding** column: a fixed-length list of numbers that captures the meaning of the description.
Search compares a query embedding to these stored vectors and returns the closest titles first.
The query embedding is generated when the buyer searches. It is not a row in this table.

## Identifiers

| Field | Type (logical) | Required | Notes |
|-------|----------------|----------|-------|
| id | uuid | yes | Primary key. Unique per row. |
| sample_key | text | yes | Stable tutorial id from the requirements table: `S1`, `S2`, `S3`, `S4`, or `S5`. Unique. |

`sample_key` is how seed data and later checks point at a listing. `title` is what the search page shows. The two are not substitutes.

## Core listing fields (this tutorial slice)

| Field | Type (logical) | Required | Notes |
|-------|----------------|----------|-------|
| sample_key | text | yes | `S1`–`S5` only. No sixth sample in this slice. |
| title | text | yes | Short headline. Display and rank labels. Not the embedding input. |
| description | text | yes | Property write-up copied verbatim from the requirements. This is the meaning source. |
| created_at | timestamp | yes | When the row was inserted. Not a search rank. “Newest first” is not semantic order. |

City, price, beds, address, owner, and status are not columns here. The requirements do not list them for this slice, and price or bed filters are out of scope. Those fields already exist on `public.property_listings` for sponsors. They stay on that table.

## What text is embedded

**Embedding input (canonical string):** the `description` value exactly as stored.

Rules:

- The recipe is the description alone, because the requirements ask for an embedding of each description and the absent-word checks apply to that description.
- Do not concatenate `title`, `sample_key`, or `id` into the embedded string. Titles such as “Stillwater cottage” are for the screen.
- Do not embed price, city, or ids. This model has no price or city column.
- Rebuild a vector only from this same recipe. Changing the recipe means recomputing all five embeddings before any success check.
- Store the raw `title` and `description` unchanged. The vector is a separate column derived from the description.

## Embedding column

| Field | Type (logical) | Required | Notes |
|-------|----------------|----------|-------|
| embedding | vector(DIMENSION_TODO) | yes after backfill | One list per sample. Every stored list and every query list is length DIMENSION_TODO. |

### Dimension placeholder

- The only vector size in this contract is **DIMENSION_TODO**.
- Query vectors and stored vectors must use the same model and the same DIMENSION_TODO. A different length breaks insert or search. Lists from two models are not on the same scale, even when both lengths happen to match.
- When the model is chosen, replace DIMENSION_TODO everywhere in one pass: this doc, the migration, and the TypeScript types. Do not leave a second size behind.

### Nullability and backfill

| Field | Null allowed? | Rule |
|-------|----------------|------|
| id | no | Present on insert. |
| sample_key | no | One of `S1`–`S5`. |
| title | no | Copied from the requirements. |
| description | no | Copied verbatim from the requirements. Empty text has no meaning to embed. |
| created_at | no | Set when the row is inserted. |
| embedding | only before backfill | Null is a temporary state during insert-then-embed. |

Lifecycle for every searchable row: store the listing text, generate the embedding from the description, store the vector, then the row may appear in semantic search.
After seed/backfill, all five rows have a non-null embedding of length DIMENSION_TODO. A row with a null embedding is not a search result.

## Separation of concerns

| Concern | Where it lives |
|---------|----------------|
| Human-readable listing | `title` and `description` |
| Which sample the checks mean | `sample_key` |
| Meaning for search | `embedding` column only, length DIMENSION_TODO |
| Buyer’s sentence | Generated at query time into a list of length DIMENSION_TODO. Not stored on this table. |
| Similarity metric | Chosen when the query is written. Not a column. |

Planned comparison, still undecided: cosine, L2, or inner product. Distance scores read as closer when smaller. Similarity scores read as closer when larger. The sort direction has to match the operator. Do not replace `description` with the vector. The page needs the title, and the rank needs the vector.

## In scope vs out of scope (data model)

**In scope**

- One sample table, separate from `public.property_listings`, with `id`, `sample_key`, `title`, `description`, `created_at`, and `embedding`
- Exactly five rows, one embedding each, input text equal to `description`
- One dimension placeholder, DIMENSION_TODO, for stored vectors and query vectors

**Out of scope (do not model yet)**

- Adding an embedding column to `public.property_listings`, or copying sponsor rows into this table
- Owner ids, row-level security changes, accounts, saved searches, and permissions
- City, price, beds, baths, address, photos, map fields, payments, and messaging
- More than one embedding version per property
- A stored query-history table
- A score column. Rank score is computed when the search runs.
- A full-text keyword index used as a stand-in for the vector
- Extra listings beyond S1–S5, or description edits that insert a missing query word
- Provider billing, rate limits, retries, and batch-job infrastructure

## Consistency checklist (must pass before migration)

- [ ] Every field has a purpose tied to the semantic-search requirements
- [ ] Primary key is `id`; `sample_key` is the stable `S1`–`S5` id
- [ ] Embedding input is the description only
- [ ] The only vector size written in this contract is DIMENSION_TODO
- [ ] Raw title, raw description, and vector are separate columns
- [ ] Embedding may be null only before backfill; all five searchable rows are non-null afterward
- [ ] This table is not `public.property_listings`
- [ ] Out-of-scope items above are still out of scope in the migration

## Open questions

- Exact embedding model name, and the integer that will replace DIMENSION_TODO
- Final SQL operator: cosine, L2, or inner product, and whether a larger returned number means closer or farther
- Whether the first search response shows a score beside the title, or title order only. Either way, do not store the score on the sample row.

City and price are not an open choice for this table. They are out of scope for the demo seed.

## Handoff

Next: plan Supabase pgvector enablement and migration order from this contract (`docs/pgvector-setup-plan.md`). The migration creates the sample table and a `vector(DIMENSION_TODO)` column. It does not alter sponsor listings.
