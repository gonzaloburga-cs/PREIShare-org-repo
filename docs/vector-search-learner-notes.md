# Vector search learner notes (PREIshare)

## 1. My plain-language definition

Vector similarity ranking means: turn the buyer’s query into an embedding, compare that list of numbers to each stored property embedding, score how close the meanings are, and return the closest properties first.

An embedding is a list of numbers that stands for the meaning of a text. One number inside a list is not the score. The score comes from comparing two whole lists.

## 2. How a search runs (steps I can explain)

1. Buyer types a natural-language query from our requirements examples.
2. The embedding model creates a **query embedding** with the same model and the same list length used for the listings. That step is generation.
3. The database compares the query embedding to **stored property embeddings**. Those lists were saved earlier. That step uses storage.
4. Each property gets a **distance or similarity score**.
5. Results are **ranked** best-first and cut to **top-K** (the first K I want to try is K = 5, which is our whole sample set).

```text
[Buyer query text]
        |
        v
[Query embedding] ----compare----> [Property embeddings in database]
        |
        v
[Scores] -> [Sort best-first] -> [Top-K listings shown]
```

## 3. Keyword search vs vector search (same query)

**Example query:** quiet cabin near water with good rental upside

| Approach | What it looks for | Likely miss |
| --- | --- | --- |
| Keyword | Exact words like "cabin", "water", "rental" | Stillwater cottage. The text is “A two-bedroom cottage on a still lake. Most summer weekends are booked by guests, and those nightly stays have covered the mortgage for three seasons.” It never says cabin, quiet, water, rental, or upside. A keyword search for `cabin` returns no sample rows. |
| Vector / semantic | Nearby meaning even when the words differ | Still can miss if the description is empty, misleading, or was never turned into a stored embedding. Then there is no list to compare. |

**My takeaway:** PREIshare needs vector ranking because buyers describe intent, and the listings use other words for the same kind of place. A cabin and a cottage can match. A harbor loft that only shares “near water” should not win.

## 4. Worked ranking examples (no real math required)

These are the sample listings from the requirements brief. The toy numbers below are the picture from my embeddings notes. A model did not produce them.

### Example A — clear winner

Query: "family-friendly home close to good schools"

| Listing blurb (short) | Expected rank | Why |
| --- | --- | --- |
| Maple cul-de-sac house. "A three-bedroom house on a dead-end street. An elementary campus is two blocks away, the yard is fenced, and a playground sits at the corner." | 1 (best) | Same intent: a home near a school, with a yard and a playground. The text never says family-friendly or school. |
| Harbor office loft. Loud commercial loft beside a working harbor. | lower | A workplace, not a family home. |
| Hay acreage. Open land for hay and cattle. No house. | lowest | Unrelated meaning. This listing must not rank first on this query. |

### Example B — different words, same intent

Query: "quiet cabin near water with good rental upside"

Strong match listing: Stillwater cottage. "A two-bedroom cottage on a still lake. Most summer weekends are booked by guests, and those nightly stays have covered the mortgage for three seasons."

Why vector should win: a still lake stands in for quiet and near water, and guest weekends that cover the mortgage stand in for rental upside. The word cabin never appears. In the toy picture the buyer list is `[0.90, 0.80, 0.10]` and the cottage list is `[0.88, 0.82, 0.12]`. The patterns sit together.

Why keyword may fail: the cottage shares none of the words cabin, quiet, water, rental, or upside, so an exact-word search misses it.

Near miss on the same query: Harbor office loft. Toy list `[0.15, 0.20, 0.93]`. It is beside a harbor, so it is also “near water,” and it is a loud office where boats load at dawn. It must rank below Stillwater cottage. Sharing water is not enough.

The control query "open land for hay and cattle with no house" must put Hay acreage first. The winner has to change when the sentence changes.

## 5. Top-K and scores (what I will check later)

- **Top-K:** only return the K nearest properties. Our catalog has five samples, so K = 5 shows the full order. A smaller K, such as 3, still has to put the right title first. K shortens the list. It does not change who is closest.
- **Distance score:** smaller usually means closer when the database is measuring distance.
- **Similarity score:** larger usually means closer when the database is measuring similarity.
- I must know which kind of score the later SQL returns so I do not sort the wrong way. Higher is not always better.
- The stakeholder check is the order of titles. For debugging I still want the property id, the title or a short snippet, and the score, so I can see why that order happened.

## 6. What good ranking is *not*

- Alphabetical order of titles
- “Newest listing first,” unless we add that as a separate product rule later
- A SQL `ILIKE` or other keyword match labeled as semantic search
- A comparison of embeddings built with different models or different list lengths. Those numbers are not on the same scale.

## 7. Assessment questions for a future match_properties-style function

I will reject agent output later unless I can answer YES to these:

1. Does the function take a **query embedding**, or clearly take query text and embed it with the same model and the same list length as the listings?
2. Does it compare that vector to the **stored property embedding column**, not to the raw description text alone?
3. Does it **order** results so the best semantic matches come first, using the correct direction for distance (smaller is closer) or similarity (larger is closer)?
4. Does it support **top-K** (a limit on how many neighbors return)?
5. Does each row include enough fields to explain the hit (at least property id, a human-readable title or snippet, and the score)?
6. Does it avoid silently mixing different embedding sizes or models?
7. On “quiet cabin near water with good rental upside,” does Stillwater cottage rank above Harbor office loft and above Hay acreage, even though the cottage text never contains the word cabin?

## 8. Link back to requirements

Relevant example queries from `docs/semantic-search-requirements.md`:

- “quiet cabin near water with good rental upside.” First result: Stillwater cottage. Harbor office loft stays below it.
- “family-friendly home close to good schools.” First result: Maple cul-de-sac house.
- “open land for hay and cattle with no house.” First result: Hay acreage. That listing must not rank first on the lifestyle queries.

Success criteria this ranking model supports:

- Query 1 returns Stillwater cottage first, and Harbor office loft is below it.
- A keyword search for the exact word `cabin` over the sample descriptions returns no rows, while query 1 still returns Stillwater cottage first.
- Queries 1, 2, and 3 do not return Hay acreage first. The control query returns Hay acreage first.
- The operator can point at the screen and say: “Stillwater cottage is first because the text is a quiet lake stay that guests pay for, and the word cabin never appears.”

## 9. Open questions for later steps

- Which distance metric will Supabase/pgvector use in our migration: cosine, L2, or inner product? I only need the name for now, plus whether a bigger number means closer or farther.
- Is K = 5 the right default for the first API, since that shows all five samples, or should the page use a smaller K?
- For the first UI, is title-plus-rank enough for the demo, with id and score kept for the debugging check?
