# PREIshare semantic search — handoff

## 1. Client story recap

PREIshare helps people discover investment properties. Keyword search fails when a buyer types an intent-heavy phrase such as “quiet cabin near water with good rental upside.” Those words may never appear in a listing. The requirements brief asks for one small slice that still finds a fitting home: property text becomes an embedding (a list of numbers for the meaning), pgvector stores that list, similarity ranks the samples, and a public page shows the closest titles first.

This tutorial shipped that slice for a fixed sample set. It did not replace sponsor listing search.

## 2. Stakeholder goals ↔ deliverables

| Stakeholder goal | What we delivered | Where to look |
| --- | --- | --- |
| Search by meaning, not only exact words | App-side embedding of property text and of the buyer sentence, then a similarity rank | `src/lib/embeddings/`, `src/lib/property-search.ts` |
| Store vectors next to sample property text | pgvector on, and `public.properties.embedding` as `vector(1536)` | `supabase/migrations/20250315000000_enable_pgvector_properties.sql` |
| Rankable matches for the demo queries | `match_properties` orders by cosine distance. The helper compares every stored embedding when that function returns a short list | `supabase/migrations/20250315000001_match_properties_function.sql`, `src/lib/property-search.ts` |
| Something a stakeholder can try | `POST /api/properties/search` and a public page at `/search` | `src/routes/api/properties/search.ts`, `src/routes/search.tsx` |
| Proof on the sample listings | Eight seeded rows, all with non-null embeddings, and the 2026-11-05 check notes | `data/sample-properties.json`, `scripts/seed-property-embeddings.ts`, `docs/semantic-search-verification.md` |

The buyer goal in the requirements is a plain-language description with the closest match first. The operator goal is to point at why that first title won. Query 3 in the verification report does not yet meet the Baker street flat check, so the slice is not signed off as demo-ready.

## 3. Architectural decisions (record what you actually chose)

The two planning docs and the running slice do not use the same names. `docs/embedding-data-model.md` and `docs/pgvector-setup-plan.md` still say table `public.semantic_search_samples`, columns including `sample_key`, embedding input equal to the description alone, vector size `DIMENSION_TODO`, and no vector index. The migration that was applied, the seed, and the verification report use the choices below. Do not treat `DIMENSION_TODO` or `semantic_search_samples` as the live schema.

- **What text is embedded:** The data-model contract says the description alone. The seed that actually ran embeds title, description, and location together (`generatePropertyEmbedding` with `locationSummary` set to `location`). Price is stored on the row and is not part of that text. A buyer query is embedded as the sentence only. The same module and the same model build both lists.
- **Embedding dimensions:** `1536`. Column type `vector(1536)`. Model `text-embedding-3-small`. Verification measured 1536 numbers on every stored row. The planning docs were not updated away from `DIMENSION_TODO`.
- **Distance / similarity metric:** Cosine distance, pgvector operator `<=>`. A smaller distance is closer. `match_properties` returns `similarity` as `1` minus that distance, so a higher score is a better match. The search page shows that similarity to three decimal places. It does not show raw distance, and it does not invent a second score.
- **Top-K / match count:** `5`. That is the default argument on `match_properties` and on `searchPropertiesByText`. The API route does not take a different limit.
- **Where embeddings are created:** App-side TypeScript in `src/lib/embeddings/generate.ts`. Postgres does not call the embedding provider. The provider key is `EMBEDDING_API_KEY` on the server. `EMBEDDING_MODEL` is optional and defaults to `text-embedding-3-small`.
- **Seed / backfill path:** `scripts/seed-property-embeddings.ts` reads `data/sample-properties.json` and upserts `public.properties` with the service-role client. The verification count is 8 rows and 0 null embeddings. The requirements and the data model asked for five samples only (S1–S5). The JSON also includes Pine bench cottage, Lantern row duplex, and Neon alley loft.

`public.property_listings` was not given an embedding column. Sponsor auth and the property create form were not part of this slice.

## 4. In scope vs out of scope (this tutorial)

**In scope (done for the demo slice)**

- Sample rows in `public.properties` with stored 1536-number embeddings, including the five titles from the requirements
- One similarity path: `match_properties` plus `searchPropertiesByText`
- `POST /api/properties/search` and the public React page at `/search`
- Verification notes for the four requirements queries, the cabin keyword trap, and empty / nonsense / one-letter input

**Out of scope (explicit non-goals for this handoff)**

- Production auth, rate limits, retries, or multi-tenant isolation. `/search` does not ask the visitor to sign in. The helper uses the service-role client on the server.
- Hybrid keyword plus vector ranking
- Filters for price, beds, baths, or location combined with the vector rank. `price_usd` and `location` are columns on `public.properties`. Search does not filter on them. There is no beds column on this table.
- Automatic re-embed when a title or description changes
- A large evaluation set or an offline quality dashboard
- A CI job that calls the embedding API or regenerates vectors on every pull request

## 5. Demo limitations (be honest)

Verified by Gonzalo Burga on 2026-11-05. The verification sign-off is **not** ready for a stakeholder demo.

- The sample set is eight listings, not the full PREIshare catalog. Odd order can come from that thin set. Query 3, “downtown condo walkable to restaurants,” returns Neon alley loft first (0.435) and Baker street flat second (0.410). The requirements say Baker street flat must be first. Neon alley’s description says “downtown nightclub.” The description was not edited to remove that word.
- Queries 1, 2, and the hay control passed after the refine cycle. “quiet cabin near water with good rental upside” returns Stillwater cottage first (0.551), then Pine bench cottage, then Harbor office loft. A description search for `cabin` returns no rows.
- Before that cycle, `match_properties` often returned one row or none. The ivfflat index was created with `lists = 100` on eight rows. `src/lib/property-search.ts` now compares every stored embedding when the function returns fewer rows than the sample count. `supabase/migrations/20250315000002_exact_property_search.sql` drops that index and has not been run on the hosted database. A demo that calls `match_properties` alone can still show a short list.
- Search fails without `EMBEDDING_API_KEY` and the Supabase server settings in gitignored `.env.local`. This handoff does not claim a latency budget, a cost cap, or catalog-wide coverage.
- The page explains a hit by title, a short description snippet, and the similarity score. It has no separate “why this matched” panel. The operator sentence for Stillwater cottage is still the one in the requirements: a quiet lake stay that guests pay for, and the word cabin never appears.

## 6. How to re-run the demo (handoff checklist)

1. In the Supabase SQL editor, apply `supabase/migrations/20250315000000_enable_pgvector_properties.sql`, then `supabase/migrations/20250315000001_match_properties_function.sql`, then `supabase/migrations/20250315000002_exact_property_search.sql`. The third file is the one not yet applied on the hosted project. Do not apply a migration that creates `public.semantic_search_samples`.
2. Set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `EMBEDDING_API_KEY` in `.env.local`. Optional: `EMBEDDING_MODEL=text-embedding-3-small`. Browser keys, if present, are `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Do not put the service-role key or the embedding key in a `VITE_` name.
3. From the repo root, run `npx tsx scripts/seed-property-embeddings.ts`. Confirm eight rows and zero null embeddings before judging rank.
4. Run `npm run dev`. Open `/search`. If port 3000 is taken, use the port Vite prints. Try the four queries in `docs/semantic-search-requirements.md`.
5. Compare the order with `docs/semantic-search-verification.md`. Expect Stillwater cottage, Maple cul-de-sac house, and Hay acreage to win their queries. Expect Baker street flat to stay second until the sample set changes. Also try an empty search: the page asks for a description, and the API returns 400 `Query is required`.

## 7. Next actions for later Sprint 5 work

These are not built. Each one is a gap this slice already hit.

1. **Filters + vector search.** `public.properties` already has `price_usd`. Add an optional maximum price in `match_properties` and in the API body, and still order the remaining rows by `<=>`. Do not add a beds filter until that column exists. The requirements left beds out of this table.
2. **Hybrid search.** A keyword search for `cabin` returns no sample rows, which is the point of the trap. A later hybrid has to say how a word match and the cosine similarity become one order. Do not hide a missing Stillwater cottage behind a keyword boost, and do not write the missing query words into a description.
3. **Re-embed on update.** Today a vector changes only when the seed script runs again. When title, description, or location changes, regenerate with the same `buildEmbeddingText` recipe and the same 1536-number model, then upsert. Define a backfill for rows whose embedding is null or was built with a different model.
4. **Grow the evaluation set.** The requirements lock five titles and four queries. The seed has three extra listings, and Neon alley loft is why query 3 fails. Either remove that extra row and re-check Baker street flat, or add it to the written expected order. Keep the cabin keyword check beside query 1.
5. **CI considerations.** This repo has no test script that calls the embedding provider. CI can check that migration SQL still says `vector(1536)` and that the helper rejects a list of the wrong length. Live embedding calls and seed runs stay manual so a pull request does not spend provider credit.
6. **Observability.** The API logs a server error when search throws. It does not record query text, latency, or the top score on success. A later log should keep the key out of the message and should be enough to see a short `match_properties` list before the helper fills it in.

## 8. Open questions for mentor / next owner

- The tutorial lock is `text-embedding-3-small` and 1536. Confirm that production stays on that pair. Changing either one means recomputing every stored embedding before the success checks count.
- The demo metric is cosine `<=>`, with similarity `1 - distance`. Confirm PREIshare will keep that operator. Do not mix in L2 (`<->`) or inner product (`<#>`) on the same column.
- Who pays for `EMBEDDING_API_KEY`, and how that key is rotated. The key stays server-only.
- Whether the next demo filters on `price_usd` only, or waits until a beds column is actually added.
- Whether the three extra seed listings stay. Query 3 cannot pass the written Baker street flat check while Neon alley loft remains and its description says “downtown.”

## 9. Sources used for this handoff

- `docs/semantic-search-requirements.md` — client story, five samples, four queries, success checks, and out-of-scope list
- `docs/embedding-data-model.md` — description-only embedding contract and `DIMENSION_TODO`; not the live table
- `docs/pgvector-setup-plan.md` — cosine `<=>` choice, no-index recommendation, and the unbuilt `semantic_search_samples` table
- `docs/semantic-search-verification.md` — 2026-11-05 counts, query scores, keyword trap, refine cycle, and the “not ready” sign-off
