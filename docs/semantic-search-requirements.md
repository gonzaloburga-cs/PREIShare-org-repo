# PREIshare semantic search — requirements brief

## Client story

PREIshare helps people discover investment properties. Keyword search falls short when a buyer types something like “quiet cabin near water with good rental upside.” Those words may never appear in a listing, yet a fitting home can still be in the database.

This tutorial adds one small, verifiable slice of semantic search. An **embedding** is a list of numbers that stands for the meaning of a piece of text. A property description is turned into an embedding, stored in Supabase PostgreSQL with the **pgvector** extension (PostgreSQL’s add-on for storing and comparing those number lists), and ranked by **similarity** (how close two embeddings are). PREIshare can then return properties that match intent, not only exact phrases.

You will not type every line of code by hand. Your job is to direct the work: understand the problem, keep the data model small, write clear prompts for a coding agent, and review what comes back. The stack is TypeScript, TanStack Start, React, and Supabase. Each technical term is introduced in plain language the first time it appears.

By the end, stakeholders can see sample properties with stored embeddings, a similarity query, and a basic search page. Expect several prompt, review, and refine cycles. A result counts only when you can say why it ranked highly and can show that the pipeline — text, then embedding, then store, then search — is wired correctly.

## Problem

Buyers describe lifestyle and investment intent in everyday language. Keyword search matches exact words, so “quiet cabin near water with good rental upside” misses a strong listing when those words never appear together. This slice stores meaning-aware embeddings for a fixed sample set and ranks those samples by similarity.

## Actors

| Actor | Goal |
| --- | --- |
| Property buyer / investor | Type a plain-language description and see listings that match the intent, ordered with the closest match first |
| PREIshare operator (you) | Demo the sample queries on stage and point at why the first result won |
| Coding agent | Add the migration, embedding helper, seed data, similarity helper, and search page inside the scope below |

## Sample listings the checks use

Later tests use only these five samples. Descriptions are fixed so a reviewer can see which query words are missing before any search code exists. Do not add the missing words to a description to make a keyword search pass.

| Id | Title | Description | Words that must stay absent |
| --- | --- | --- | --- |
| S1 | Stillwater cottage | A two-bedroom cottage on a still lake. Most summer weekends are booked by guests, and those nightly stays have covered the mortgage for three seasons. | cabin, quiet, water, rental, upside |
| S2 | Maple cul-de-sac house | A three-bedroom house on a dead-end street. An elementary campus is two blocks away, the yard is fenced, and a playground sits at the corner. | family, family-friendly, school, schools |
| S3 | Baker street flat | A one-bedroom flat above a corner bakery in the city center. Cafes and dinner spots line the same block, and residents walk to work. | downtown, condo, restaurant, restaurants, walkable |
| S4 | Hay acreage | Open acreage used for hay and cattle. There is no house on the parcel. Access is a county road. | — |
| S5 | Harbor office loft | A commercial loft beside a working harbor. Weekday tenants run a small shipping desk. The space is loud at dawn when boats load. | cabin, cottage, guest |

S5 is the near miss for water: it is beside a harbor, and it is still the wrong place for a quiet guest stay. S4 is the near miss for lifestyle queries: open farmland with no house.

## Example queries

Each query states the title that must appear first, in plain language.

1. **“quiet cabin near water with good rental upside.”** First result: Stillwater cottage. The description never says cabin, water, or rental, but it is a still lake cottage that guests book on weekends.
2. **“family-friendly home close to good schools.”** First result: Maple cul-de-sac house. The description never says family-friendly or school, but it is a house two blocks from an elementary campus with a fenced yard and a playground.
3. **“downtown condo walkable to restaurants.”** First result: Baker street flat. The description never says downtown, condo, or restaurant, but it is a city-center flat where people walk to cafes and dinner spots.
4. **Control — “open land for hay and cattle with no house.”** First result: Hay acreage. This query exists so the demo can show the winner changes with the words. Hay acreage must not rank first for queries 1, 2, or 3.
5. **Near-water check on query 1.** Stillwater cottage ranks above Harbor office loft. Sharing “near water” (a lake versus a harbor) is not enough: the loft is a loud workplace, and the cottage is a place guests book.

## Success criteria

A stakeholder can watch these checks. “Search works well” and “a relevant property comes back” do not pass.

- [ ] All five samples are stored with the titles and descriptions in the table above, plus an embedding for each description.
- [ ] None of the stored descriptions contain the words listed in that table’s “must stay absent” column.
- [ ] Every stored embedding and the embedding for a new query come from the same model and have the same length. The chosen model name and length are written down in the handoff before the demo.
- [ ] The search page shows the typed query and a ranked list of titles, closest match first.
- [ ] Query 1 returns **Stillwater cottage** first, and **Harbor office loft** is below it.
- [ ] Query 2 returns **Maple cul-de-sac house** first.
- [ ] Query 3 returns **Baker street flat** first.
- [ ] Queries 1, 2, and 3 do not return **Hay acreage** first.
- [ ] The control query returns **Hay acreage** first.
- [ ] A keyword search for the exact word `cabin` over the sample descriptions returns no rows, while query 1 still returns Stillwater cottage first. The demo notes show both outcomes side by side.
- [ ] The operator can say, while pointing at the screen: “Stillwater cottage is first because the text is a quiet lake stay that guests pay for, and the word cabin never appears.”

## In scope

- A short explanation, in the handoff, of embeddings and similarity in plain language
- A data model for the five samples and their embeddings, using Supabase PostgreSQL and pgvector
- A migration that enables pgvector and stores one embedding per sample
- A TypeScript helper that turns property text into an embedding with one chosen model
- A seed path that loads the five descriptions exactly as written above and stores their embeddings
- A similarity search and a TypeScript helper that ranks the five samples for one query string
- A simple public search page in the TanStack Start app that runs that helper and shows the ranked titles
- Verification notes that record the five query checks and the keyword-versus-similarity check for `cabin`

Default for this tutorial: the page lives at `/search` and does not ask the visitor to sign in. Sample rows live in their own table so sponsor login, row-level security, and the existing property-listing flow stay as they are.

## Out of scope

- Production embedding billing, rate limits, retries, and large batch jobs
- Replacing sponsor listing search, or changing sponsor auth, row-level security, or the property create form
- Map search, filters (price, beds, baths), payments, and messaging
- Personalization, business-rule ranking, and hybrid keyword-plus-vector tuning past this demo
- Visual polish, a design system, and a mobile app
- Extra listings beyond the five samples
- Editing a sample description so that a missing query word appears in the text

## Assumptions and open questions

Assumptions for this tutorial:

- Five rows fit on a free-tier Supabase project.
- The copy is English.
- One model and one vector length are used for every sample and every query. Changing the model means recomputing all five embeddings before any success box is checked.
- `/search` is a public demo page.

Resolve these before writing the migration, then keep the answers fixed through the demo:

- Which embedding provider and model name
- Vector length required by that model
- Distance metric (cosine, L2, or inner product)
- Whether the page shows a raw distance, a similarity score, or rank numbers only
- Confirm `/search` with a mentor if the demo should sit on an existing route instead

## Handoff note for later steps

Every implementation prompt should quote this brief. A step is done only when the matching success-criteria boxes can be checked against the five queries. If a prompt adds work from the out-of-scope list, cut that work before reviewing the result.
