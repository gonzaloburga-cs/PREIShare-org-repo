# Embeddings learner notes (PREIshare)

## Plain-language definition

An embedding is a list of numbers that stands for the meaning of a piece of text. For PREIshare that text is either a property description or a buyer’s search phrase. Similar meanings get similar lists, even when the words do not match. The list is not a keyword index, and it is not a sentence a person can read back.

In everyday English, “embed” can mean setting one thing inside another. That is a different meaning. Here the word means the number-list itself.

## Tiny intuition (not real model output)

A real embedding is a long list, often hundreds or thousands of numbers. This toy uses three numbers so “near” and “far” are easy to picture. These figures are made up. A model did not produce them.

- “quiet cabin near water with good rental upside” → [0.90, 0.80, 0.10]
- Stillwater cottage (still lake, guests book weekends, stays cover the mortgage) → [0.88, 0.82, 0.12]
- Harbor office loft (loud commercial loft beside a working harbor) → [0.15, 0.20, 0.93]

The cottage list almost matches the buyer list. The loft list does not. Same idea as a real embedding: similar meaning, similar number pattern.

## PREIshare examples from our requirements

- Buyer query I care about: “quiet cabin near water with good rental upside.”
- Listing A (should feel close to the query): Stillwater cottage. “A two-bedroom cottage on a still lake. Most summer weekends are booked by guests, and those nightly stays have covered the mortgage for three seasons.” The description never says cabin, quiet, water, rental, or upside.
- Listing B (should feel far): Harbor office loft. “A commercial loft beside a working harbor. Weekday tenants run a small shipping desk. The space is loud at dawn when boats load.” It is near water and it is still the wrong place.
- Why A is closer in meaning than B: A cabin and a cottage are the same kind of stay. The still lake covers “quiet” and “near water,” and guests paying for weekends covers “rental upside.” The loft shares the water idea because of the harbor, but it is a loud office, not a place guests book. Hay acreage would be even farther: open land, hay and cattle, no house.

## Generation vs storage (do not mix these up)

These are two jobs. I trigger both. I do not write the numbers, and a coding agent does not invent them.

| Stage | What happens | Where |
| --- | --- | --- |
| Generation | Text goes into an embedding model through an API. The model returns a number-list. The same model must read the buyer’s query later. | App side, later a TypeScript helper that calls the model |
| Storage | That finished number-list is saved on the property row so a later search can find it. | Database: Supabase PostgreSQL with pgvector, the add-on that stores and compares these lists |

Search will later embed the buyer’s query (generation again), then compare that new list with the lists already saved (storage plus comparison). How “close” becomes a ranked list is Step 3.

## Misconceptions to watch for when reviewing agent code later

- Thinking “embedding” only means stuffing one thing inside another, or thinking the original sentence is stored as text inside the number-list.
- Assuming two listings must share the same words to be close. Stillwater cottage never says “cabin” and can still be the closest match.
- Forgetting that every list from the same model must be the same length. People call that length the dimension count.
- Mixing up “create the embedding” with “save the row.” Generation is the model. Storage is the database insert.
- Believing one number in the list is a human-readable score by itself. Closeness comes from comparing two whole lists.
- Calling the coding agent the thing that creates the list, or saying I save the numbers by hand.

## What I can explain to a teammate in 60 seconds

A buyer might type “quiet cabin near water with good rental upside” and never see those words in the listing. An embedding is a list of numbers that stands for meaning, so a still-lake cottage that guests already book can sit close to that sentence. Harbor office loft is also near water, but it is a loud workplace, so its list should sit farther away. First an embedding model creates the list. Then Supabase saves it with pgvector. Search creates a new list for the query and compares it with the saved ones. If two models wrote the lists, the comparison does not mean anything, because the numbers are not on the same scale.

## Open questions before similarity ranking (Step 3)

- How do we turn “closeness” of two number-lists into an ordered list of properties, closest match first?
- What happens if two different embedding models are mixed in one table?
- Which distance metric should the database use (cosine, L2, or inner product), and does a bigger number mean closer or farther?
- Does the search page need to show a score, or is rank order enough for the demo?
