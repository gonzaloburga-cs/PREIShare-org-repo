-- Rank public.properties by meaning.
-- Depends on supabase/migrations/20250315000000_enable_pgvector_properties.sql.
-- The embedding column is vector(1536). Do not change that length here.
--
-- <=> is cosine distance: a smaller number means a closer meaning.
-- Results are ordered by that distance so the best match is first.
-- similarity is 1 minus the distance, so a higher score is a better match.

create or replace function public.match_properties(
  query_embedding vector(1536),
  match_count int default 5
)
returns table (
  id uuid,
  title text,
  description text,
  location text,
  similarity float
)
language sql
stable
security invoker
set search_path = public
as $$
  select
    p.id,
    p.title,
    p.description,
    p.location,
    (1 - (p.embedding <=> query_embedding))::float as similarity
  from public.properties p
  where p.embedding is not null
  order by p.embedding <=> query_embedding
  limit greatest(match_count, 1);
$$;

-- The caller still has to be allowed to read properties. Row Level Security applies.
grant execute on function public.match_properties(vector(1536), int) to authenticated;
grant execute on function public.match_properties(vector(1536), int) to service_role;
