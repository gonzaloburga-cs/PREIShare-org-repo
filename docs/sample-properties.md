# Sample properties for semantic search

Eight listings for the later seed. They are not loaded into Supabase yet.

`generatePropertyEmbedding` embeds `title`, then `description`, then `location`. `price_usd` is display only and is not part of the embedding text. Descriptions are full sentences so the model has a situation to capture, not a one-word label.

The word `cabin` does not appear in any title, description, or location. A keyword search for `cabin` should still return no rows. Meaning has to do the matching.

## How a person should rank “quiet cabin near water with good rental upside”

| Rank | Listing | Why |
| --- | --- | --- |
| 1 | Stillwater cottage | Still lake, weekend guests, stays that cover the mortgage. Never says cabin, water, or rental. |
| 2 | Pine bench cottage | Quiet and small, but dry pines with no shore and no guest income. |
| 3 | Harbor office loft | Beside a harbor, but a loud workplace at dawn. |
| later | Lantern row duplex | Strong tenant income, not a lake stay. |
| later | Maple cul-de-sac house | Family street and a campus nearby. |
| later | Baker street flat | City-center flat and cafes. |
| last | Neon alley loft | Nightclub, crowds, music past midnight. |
| last | Hay acreage | Open land, hay and cattle, no house. |

## The eight listings

### 1. Stillwater cottage — quiet waterfront stay, with guest income

| Field | Value |
| --- | --- |
| title | Stillwater cottage |
| location | North shore lane |
| price_usd | 425000 |
| description | A two-bedroom cottage sits on a still lake. Most summer weekends are booked by guests, and those nightly stays have covered the mortgage for three seasons. |

Leave these words out of all three text fields: cabin, quiet, water, rental, upside. “Stillwater” is the title already used in the requirements. Do not add the missing words to help a keyword search.

### 2. Pine bench cottage — quiet, not near water

| Field | Value |
| --- | --- |
| title | Pine bench cottage |
| location | Pine bench |
| price_usd | 340000 |
| description | A small cottage stands in a dry pine grove. The road ends at the property, neighbors are distant, and nights pass with little traffic. |

This is the near miss for “quiet.” It should rank below Stillwater cottage because nothing in the text is a shore or guest income.

### 3. Maple cul-de-sac house — suburban family house

| Field | Value |
| --- | --- |
| title | Maple cul-de-sac house |
| location | Maple glen |
| price_usd | 389000 |
| description | A three-bedroom house sits on a dead-end street. An elementary campus is two blocks away, the yard is fenced, and a playground sits at the corner. |

Best match for “family-friendly home close to good schools.” The text never says family, family-friendly, school, or schools.

### 4. Baker street flat — urban flat, not nightlife

| Field | Value |
| --- | --- |
| title | Baker street flat |
| location | Baker street |
| price_usd | 510000 |
| description | A one-bedroom flat sits above a corner bakery in the city center. Cafes and dinner spots line the same block, and residents walk to work. |

Best match for “downtown condo walkable to restaurants.” The text never says downtown, condo, restaurant, restaurants, or walkable. It should rank above the nightclub loft for a calm city home, and below it for a nightlife query.

### 5. Lantern row duplex — strong rental income

| Field | Value |
| --- | --- |
| title | Lantern row duplex |
| location | Lantern row |
| price_usd | 360000 |
| description | A side-by-side duplex holds two occupied units. Both households have renewed for another year, and the combined monthly payments cover the loan with money left over. |

This is the income listing that is not a lake stay. It should rank high for a query about tenant income, and it should not beat Stillwater cottage for “quiet cabin near water.”

### 6. Neon alley loft — mismatch for a quiet cabin

| Field | Value |
| --- | --- |
| title | Neon alley loft |
| location | Neon alley |
| price_usd | 275000 |
| description | A studio loft sits above a downtown nightclub. Music runs past midnight, crowds fill the sidewalk, and the street stays loud until the bars close. |

This is the clear mismatch for “quiet cabin near water.” Noise and nightlife are the whole description. It should rank last, or tied for last with Hay acreage, on that query. It should rank first for a nightlife query.

### 7. Harbor office loft — near water, wrong use

| Field | Value |
| --- | --- |
| title | Harbor office loft |
| location | Working harbor |
| price_usd | 890000 |
| description | A commercial loft stands beside a working harbor. Weekday tenants run a small shipping desk. The space is loud at dawn when boats load. |

Shares the shore idea with Stillwater cottage and misses the guest stay. It must rank below Stillwater cottage on the cabin query. “Working harbor” is enough location text. Do not add cabin or cottage.

### 8. Hay acreage — no house

| Field | Value |
| --- | --- |
| title | Hay acreage |
| location | County road 12 |
| price_usd | 710000 |
| description | Open acreage is used for hay and cattle. There is no house on the parcel. Access is a county road. |

Best match for “open land for hay and cattle with no house.” It must not rank first on the cabin, school, or city-flat queries.

## What the next seed must not do

- Do not add a ninth listing in that step unless a mentor asks.
- Do not edit these sentences so a missing query word appears.
- Do not store the description text in the `embedding` column. That column is a list of 1536 numbers from `generatePropertyEmbedding`.
- Do not put `price_usd` into the embedded text.
