# PREIshare pgvector setup plan

## Purpose

Enable storage for the five semantic-search samples in Supabase PostgreSQL using pgvector.
This plan follows `docs/embedding-data-model.md`. It is the contract for the SQL migration step.
It does not generate embeddings, seed the five listings, or build the search page.

## Source of truth

Data model: `docs/embedding-data-model.md`.

The model calls for one sample table, separate from sponsor listings. This plan gives that table the SQL name `public.semantic_search_samples`. It is not `public.property_listings`, and it is not a table named `properties`.

| Item | Value copied from the data model |
| --- | --- |
| Table | `public.semantic_search_samples` |
| Columns | `id`, `sample_key`, `title`, `description`, `created_at`, `embedding` |
| Embedding column | `embedding` |
| Vector type | `vector(DIMENSION_TODO)` |
| Embedded text | `description` only |
| Rows this tutorial stores | `S1` through `S5` only, after a later seed |
| Null embedding | Allowed only until backfill |

`DIMENSION_TODO` is the only vector size in this plan. Do not write a second length. When the embedding model is chosen, replace `DIMENSION_TODO` in the data model, this plan, the migration, and the TypeScript types in one pass.

## Migration goals (what “done” means)

1. The `vector` extension (pgvector) is installed in the database.
2. `public.semantic_search_samples` exists with the columns above. `embedding` is `vector(DIMENSION_TODO)` and may be null.
3. `id`, `sample_key`, `title`, `description`, and `created_at` are required. `sample_key` is unique and limited to `S1`, `S2`, `S3`, `S4`, and `S5`.
4. Sponsor table `public.property_listings` is unchanged. Its policies are unchanged.
5. Verification queries show the extension, the column type, and that a null `embedding` can exist inside a transaction that rolls back.
6. A similarity function and the five seeded rows are later work. This migration does not rank listings yet.

## Safe migration order (must not be reordered)

| Order | Step | Why this order |
| --- | --- | --- |
| 1 | Enable extension `vector` | The `vector(DIMENSION_TODO)` type does not exist until pgvector is on. |
| 2 | Create `public.semantic_search_samples` with `embedding vector(DIMENSION_TODO)` and the other model columns | The column type depends on step 1. |
| 3 | Run the verification queries | Proves the schema before any seed or app code. |

Do not create a vector column before enabling the extension.
Do not add a second embedding column.
Do not change `DIMENSION_TODO` to a different length in the migration.
Do not add an index in this migration. Five rows do not need one. See the index section.

Column shape the migration must create:

| Column | Type | Null | Notes |
| --- | --- | --- | --- |
| id | uuid | no | Primary key. Default `gen_random_uuid()` is fine. |
| sample_key | text | no | Unique. Only `S1`, `S2`, `S3`, `S4`, `S5`. |
| title | text | no | Headline for the page. Not the embedded text. |
| description | text | no | Copied later, verbatim, from the requirements. This is the text that will be embedded. |
| created_at | timestamptz | no | Default `now()` is fine. Not a rank. |
| embedding | vector(DIMENSION_TODO) | yes | Null only before backfill. One list per row. |

`id` and `created_at` can be filled by defaults. The other required text columns cannot.

## Similarity approach (beginner demo)

The data model left the operator open. This plan picks one so later SQL does not mix styles.

**Choice:** cosine distance, pgvector operator `<=>`.

A smaller `<=>` result means the two lists are closer in meaning. Later search SQL sorts ascending (smallest distance first) and then applies top-K. The score is computed when the query runs. It is not a column on `semantic_search_samples`.

**Why this operator:** text embeddings are compared by the pattern of the whole list. Cosine distance asks whether two lists point the same way. That matches the learner notes: similar meaning, similar number pattern. Stillwater cottage should land nearer the cabin query than Harbor office loft.

**Tradeoffs:**

| Operator | Plain meaning | How to read the number |
| --- | --- | --- |
| `<=>` cosine distance | Compares the pattern of the two lists. This plan uses this one. | Smaller means closer. |
| `<->` L2 distance | Straight-line gap between the two lists. | Smaller means closer. A different scale from cosine. Do not mix it into the same demo. |
| `<#>` inner product | Another closeness number. pgvector’s operator is easy to sort backwards if a larger raw product is treated as “better.” | Stay away from it in this tutorial. |

An exact comparison of five stored lists is the whole demo. An approximate index is for a large catalog. It adds setup and does not make these five titles any more correct.

The query embedding is built at search time with the same model and the same `vector(DIMENSION_TODO)` length. It is not stored in this table. A match function that accepts that list, orders by `embedding <=> query_embedding`, and limits to top-K is a follow-up migration. It is out of scope here.

## Index recommendation

Demo scale is five rows. No vector index is required, and this migration must not create one.

A sequential scan reads every stored list, scores it, and sorts. At this size that is the clear, correct plan.

If a later change adds an index anyway:

- Add it only after `embedding` exists.
- Build it only once the seeded rows have non-null embeddings. An index over nulls does not help search.
- Use the cosine operator class `vector_cosine_ops`, because that class matches `<=>`.
- Keep the indexed column as `vector(DIMENSION_TODO)`. Do not introduce another length to satisfy the index.

## Environment values (names only)

Real values stay in the Supabase dashboard or in a gitignored env file. This plan stores no keys.

Enabling pgvector and creating the table does not need an embedding-provider key. The provider is still unchosen. Do not add a provider key name until the model is chosen, and never give that key a `VITE_` prefix.

Names this project already uses:

| Name | Who may read it | Role in this step |
| --- | --- | --- |
| `SUPABASE_URL` | Server only | Project URL for trusted server or CLI work. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Bypasses row-level security. A later seed may need it. The browser must not receive it. |
| `VITE_SUPABASE_URL` | Browser | Public project URL. Not required to enable the extension. |
| `VITE_SUPABASE_ANON_KEY` | Browser | Public anon key. Not required to enable the extension. |

Run this migration from the Supabase SQL editor or the Supabase CLI while logged into the project. Do not commit a database password or a connection string.

## Verification queries (run after migration)

Run these in the SQL editor after steps 1 and 2. They do not seed S1–S5.

1. The `vector` extension is installed.

```sql
select extname
from pg_extension
where extname = 'vector';
```

One row, `vector`, means step 1 worked.

2. The sample table has the model columns, and `embedding` is `vector(DIMENSION_TODO)`.

```sql
select column_name, data_type, udt_name, is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name = 'semantic_search_samples'
order by ordinal_position;
```

Expect `id`, `sample_key`, `title`, `description`, `created_at`, and `embedding`. `embedding` is nullable. `information_schema` often labels a pgvector column as user-defined rather than printing the length. Confirm the length with:

```sql
select a.attname,
       format_type(a.atttypid, a.atttypmod) as column_type
from pg_attribute a
join pg_class c on c.oid = a.attrelid
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname = 'semantic_search_samples'
  and a.attname = 'embedding'
  and not a.attisdropped;
```

`column_type` must be `vector(DIMENSION_TODO)` after the placeholder has been replaced. Until that replacement, the migration’s type clause is still `vector(DIMENSION_TODO)`. Do not accept a different length.

3. A null embedding is allowed, and the check does not leave a sixth sample behind.

```sql
begin;
insert into public.semantic_search_samples (sample_key, title, description, embedding)
values ('S1', 'Verification row', 'Temporary text. Not a stored sample.', null);

select sample_key, embedding is null as embedding_is_null
from public.semantic_search_samples
where sample_key = 'S1';

rollback;
```

`embedding_is_null` must be true. After `rollback`, the table is empty again. Do not commit this row. The real S1 description is the Stillwater cottage text from the requirements, loaded only by the later seed.

4. Optional operator smoke test, only after `DIMENSION_TODO` is replaced with the model’s integer. Both casts must be that same length. A shorter cast, such as a three-number vector, does not prove the column is the right size. Skip this check until the integer is known. The expected shape is two `vector(DIMENSION_TODO)` values compared with `<=>`, and the closer pair returns the smaller distance.

Also confirm the sponsor table was not altered: `public.property_listings` still has no `embedding` column.

## Out of scope for this migration plan

- Choosing the embedding vendor and replacing `DIMENSION_TODO` (do that before the migration file is written, in the data model and here together)
- Generating embeddings, or seeding S1–S5
- A `match` function, search API route, or React page
- A vector index
- Any change to `public.property_listings`, sponsor auth, or sponsor row-level security
- New policies, accounts, saved searches, city, price, beds, photos, or payments on the sample table
- A second embedding column, a stored score column, or a query-history table
- Hybrid keyword plus vector ranking
- Provider billing, rate limits, and batch jobs

## Handoff to next step

The coding agent implements only ordered steps 1 and 2: enable `vector`, then create `public.semantic_search_samples` with the columns and `vector(DIMENSION_TODO)` type in this plan.
The index is not in scope.
The agent must not rename the table, rename `embedding`, or change the vector size.
Verification is the rollback insert and the two read-only checks above. Seed, backfill, and ranking SQL come after that.
