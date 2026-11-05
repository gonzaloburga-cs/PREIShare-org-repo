-- The ivfflat index was created with lists = 100.
-- This sample table has 8 rows, so most lists are empty.
-- ORDER BY embedding <=> then returns 0 or 1 rows instead of the closest 5.
-- Dropping the index makes match_properties compare every stored embedding.

drop index if exists public.properties_embedding_ivfflat_idx;
