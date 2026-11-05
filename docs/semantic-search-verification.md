# Semantic search verification report (PREIshare)

## Scope checked

- Requirements source: `docs/semantic-search-requirements.md`
- UI: `src/routes/search.tsx`
- API: `src/routes/api/properties/search.ts`
- Search helper: `src/lib/property-search.ts`
- Seed inputs: `data/sample-properties.json`, `scripts/seed-property-embeddings.ts`

## Environment

- Date tested: 2026-11-05
- Supabase project (name or ref only, no secrets): hosted project configured in gitignored `.env.local`. The ref is not copied here.
- App run method (e.g. local dev server): `npm run dev`. Port 3000 was already in use, so Vite served http://localhost:3001/
- Embedding model / dimension expected: `text-embedding-3-small`, 1536 numbers. Every stored embedding measured 1536.

## Data checks

| Check | Result | Notes |
| --- | --- | --- |
| Sample properties present | PASS | row count: 8. The five required samples are included, plus Pine bench cottage, Lantern row duplex, and Neon alley loft. |
| Embeddings non-null for all samples | PASS | null count: 0. Each vector length is 1536. |
| Seed script re-runnable without breaking search | SKIPPED | Not re-run during this check. An earlier run exited 0 and upserts by stable id. Search was judged against the rows already stored. |

## Query results (semantic)

Scores are the similarity numbers returned by `POST /api/properties/search` after the refine cycle. The search page showed the same order for the cabin query.

| # | Query | Top 3 results (title or id) | Sensible neighbors? | Notes |
| --- | --- | --- | --- | --- |
| 1 | quiet cabin near water with good rental upside | Stillwater cottage (0.551), Pine bench cottage (0.449), Harbor office loft (0.378) | YES | Expected winner is first. The harbor loft is the near-water miss and sits third. |
| 2 | family-friendly home close to good schools | Maple cul-de-sac house (0.476), Stillwater cottage (0.273), Pine bench cottage (0.261) | YES | Maple is first. The next two are quieter houses, not the city lofts. |
| 3 | downtown condo walkable to restaurants | Neon alley loft (0.435), Baker street flat (0.410), Harbor office loft (0.340) | NO | Baker street flat is the expected first result and came second. Neon alley is a loud downtown loft. |
| 4 | open land for hay and cattle with no house | Hay acreage (0.600), Pine bench cottage (0.369), Maple cul-de-sac house (0.343) | YES | Control winner is first. Hay acreage was not first on queries 1, 2, or 3. |

## Keyword-trap check

- Trap query (paraphrase, not exact listing text): quiet cabin near water with good rental upside
- Expected kind of property: Stillwater cottage, a lake cottage whose weekend guests cover the mortgage. The description does not say cabin, water, or rental.
- Actual top results: Stillwater cottage (0.551), Pine bench cottage (0.449), Harbor office loft (0.378)
- Did semantic search beat exact-keyword matching? YES
- Evidence (one sentence): A description search for `cabin`, `water`, `rental`, `upside`, and `quiet` returned no rows, while the same sentence through semantic search returned Stillwater cottage first.

## Safety / edge cases

| Case | Expected | Actual | PASS / FAIL |
| --- | --- | --- | --- |
| Empty query | Clear error or empty list, no crash | API `""` and `"   "` return 400 `{ error: "Query is required", results: [] }`. The page does not call the API; it shows "Type a description of the property you want." | PASS |
| Nonsense tokens | Low similarity or empty, no crash | `zzzz qqq xxx` returns 200. Top score is 0.185 (Lantern row duplex), then Maple cul-de-sac house 0.149 and Neon alley loft 0.148. | PASS |
| Very short query | Stable response | `a` returns 200. Top score is 0.155 (Lantern row duplex), then Neon alley loft 0.146 and Hay acreage 0.145. | PASS |

## Refine cycle (required)

- Failing or weak example (query + bad ranking or error): Before the change, "quiet cabin near water with good rental upside" returned only Pine bench cottage (0.449). The schools, downtown, and hay queries returned no rows. Expected neighbors were Stillwater cottage, Maple cul-de-sac house, Baker street flat, and Hay acreage.
- Suspected layer (seed data / embedding text / SQL distance / helper / API / UI): SQL distance path. `match_properties` orders with `<=>`, and the ivfflat index was built with `lists = 100` for 8 rows, so the database returned one row or none. `src/lib/property-search.ts` was only passing that short list through. Embeddings were already non-null.
- Change made (files touched): `src/lib/property-search.ts` compares every stored embedding when `match_properties` returns fewer rows than the sample set. `supabase/migrations/20250315000002_exact_property_search.sql` drops `properties_embedding_ivfflat_idx`. `docs/onboarding/repo-map.md` lists that migration. The drop has not been run on the hosted database.
- Re-test result: Queries 1, 2, and 4 now match the requirements. Query 3 still places Neon alley loft above Baker street flat.
- Keep or revert decision: Keep the helper change. An exact comparison of the eight stored vectors is what the demo needs while the approximate index is still present. Do not rewrite Neon alley’s description to remove the word "downtown"; that would force Baker street flat to win by editing the sample.

## Requirements traceability

| Requirement / success criterion | Met? | Evidence |
| --- | --- | --- |
| All five samples are stored with the titles and descriptions in the requirements table, plus an embedding for each description. | YES | 8 rows, 0 null embeddings, length 1536. The five named samples are in that set. |
| None of the stored descriptions for those five samples contain the words in the "must stay absent" column. | YES | Database text search found no `cabin`, `water`, `rental`, `upside`, or `quiet`. The seeded copy for Maple and Baker uses campus, cafes, and dinner spots instead of school, downtown, condo, or restaurant. |
| Every stored embedding and the embedding for a new query come from the same model and have the same length. The model name and length are written down before the demo. | YES | `text-embedding-3-small`, 1536. Recorded in this report. |
| The search page shows the typed query and a ranked list of titles, closest match first. | YES | `/search` keeps the sentence in the search box and lists titles with a snippet and the server similarity score. The page does not sort that list again. |
| Query 1 returns Stillwater cottage first, and Harbor office loft is below it. | YES | Stillwater 0.551, Harbor office loft 0.378 in third place. |
| Query 2 returns Maple cul-de-sac house first. | YES | Maple cul-de-sac house 0.476. |
| Query 3 returns Baker street flat first. | NO | Baker street flat is second (0.410). Neon alley loft is first (0.435). |
| Queries 1, 2, and 3 do not return Hay acreage first. | YES | Hay acreage is absent from those top-three lists. |
| The control query returns Hay acreage first. | YES | Hay acreage 0.600. |
| A keyword search for `cabin` returns no rows, while query 1 still returns Stillwater cottage first. | YES | See the keyword-trap section. |
| The operator can point at the screen and say why Stillwater cottage is first even though the word cabin never appears. | YES | It is a still-lake cottage whose guest stays cover the mortgage. Pine bench is only a quiet cottage. The harbor loft is near water but is a loud workplace. |

## Remaining limitations (honest handoff)

- What this tutorial slice does **not** do yet (filters, auth, production embedding jobs, etc.): No price or bedroom filters, no map, no sponsor sign-in on `/search`, and no production retry or batch embedding job. Sample rows stay in `public.properties`, separate from sponsor listings. The page only shows title, a short description, and the server score.
- Known ranking weaknesses on the sample set: Query 3 ranks the noisy downtown loft above the walkable bakery flat. The hosted database still has the ivfflat index with `lists = 100`. Until `supabase/migrations/20250315000002_exact_property_search.sql` is run in the Supabase SQL editor, `match_properties` by itself can return a short list, and the helper fills the gap by comparing every stored embedding.
- Follow-ups for the next topic: Run the drop-index migration on the hosted project, then call `match_properties` again and confirm it returns five rows without the helper fallback. Decide whether Neon alley loft stays in the demo set. Do not add the missing query words to a description to make a keyword search pass.

## Sign-off

- Verified by: Gonzalo Burga, checks run 2026-11-05
- Ready to demo to a stakeholder? NO
- Blockers before demo: Query 3 does not put Baker street flat first. The drop-index migration is written and not applied on the hosted database, so a demo that calls `match_properties` alone can still show an empty or one-row list.
