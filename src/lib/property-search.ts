// Server-only. Embedding keys and the service-role key stay on the server.
// This file does not compute vectors. It calls generatePropertyEmbedding.
import '@tanstack/react-start/server-only'

import {
  assertEmbeddingDimension,
  generatePropertyEmbedding,
} from './embeddings/generate'
import { EMBEDDING_DIMENSIONS } from './embeddings/types'
import { createSupabaseServiceRoleClient } from './supabase.server'

export type PropertyMatch = {
  id: string
  title: string
  description: string
  location: string | null
  /** Higher is a closer meaning. Comes from match_properties, not from this file. */
  similarity: number
}

/**
 * Turn a buyer sentence into an embedding, then return the closest properties.
 * matchCount is top-K. The database function orders the best match first.
 */
export async function searchPropertiesByText(
  query: string,
  matchCount = 5,
): Promise<PropertyMatch[]> {
  const trimmed = query.trim()
  if (!trimmed) return []

  const embedded = await generatePropertyEmbedding({
    title: '',
    description: trimmed,
  })
  if (!embedded.ok) {
    throw new Error(`${embedded.code}: ${embedded.message}`)
  }
  if (!assertEmbeddingDimension(embedded.embedding, EMBEDDING_DIMENSIONS)) {
    throw new Error(
      `DIMENSION_MISMATCH: expected ${EMBEDDING_DIMENSIONS} numbers, got ${embedded.embedding.length}.`,
    )
  }

  // Same text form the seed used for the vector(1536) column.
  const queryEmbedding = `[${embedded.embedding.join(',')}]`
  const supabase = createSupabaseServiceRoleClient()
  const { data, error } = await supabase.rpc('match_properties', {
    query_embedding: queryEmbedding,
    match_count: matchCount,
  })

  if (error) {
    throw new Error(`match_properties failed: ${error.message}`)
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    location: row.location,
    similarity: row.similarity,
  }))
}
