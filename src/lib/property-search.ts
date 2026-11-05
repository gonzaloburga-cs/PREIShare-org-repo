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
  /** Higher is a closer meaning. */
  similarity: number
}

/**
 * Turn a buyer sentence into an embedding, then return the closest properties.
 * matchCount is top-K. The closest match is first.
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

  const queryEmbedding = `[${embedded.embedding.join(',')}]`
  const supabase = createSupabaseServiceRoleClient()
  const { data, error } = await supabase.rpc('match_properties', {
    query_embedding: queryEmbedding,
    match_count: matchCount,
  })

  if (error) {
    throw new Error(`match_properties failed: ${error.message}`)
  }

  const listed = (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    location: row.location,
    similarity: row.similarity,
  }))

  const { count, error: countError } = await supabase
    .from('properties')
    .select('id', { count: 'exact', head: true })
    .not('embedding', 'is', null)

  if (countError) {
    throw new Error(`properties read failed: ${countError.message}`)
  }

  const expected = Math.min(Math.max(matchCount, 1), count ?? 0)
  if (listed.length >= expected) return listed

  // The ivfflat index uses lists = 100. With 8 rows, most lists are empty,
  // so match_properties often returns one row or none. Compare every
  // stored embedding until that index is dropped.
  return rankEveryStoredEmbedding(embedded.embedding, matchCount)
}

function vectorFromColumn(value: string): number[] | null {
  const inner = value.trim().replace(/^\[/, '').replace(/\]$/, '')
  if (!inner) return null
  const numbers = inner.split(',').map(Number)
  if (!assertEmbeddingDimension(numbers, EMBEDDING_DIMENSIONS)) return null
  return numbers
}

function cosineSimilarity(left: number[], right: number[]): number {
  let dot = 0
  let leftNorm = 0
  let rightNorm = 0
  for (let index = 0; index < left.length; index++) {
    const leftValue = left[index]
    const rightValue = right[index]
    if (leftValue === undefined || rightValue === undefined) return 0
    dot += leftValue * rightValue
    leftNorm += leftValue * leftValue
    rightNorm += rightValue * rightValue
  }
  const denom = Math.sqrt(leftNorm) * Math.sqrt(rightNorm)
  return denom === 0 ? 0 : dot / denom
}

async function rankEveryStoredEmbedding(
  queryEmbedding: number[],
  matchCount: number,
): Promise<PropertyMatch[]> {
  const supabase = createSupabaseServiceRoleClient()
  const { data, error } = await supabase
    .from('properties')
    .select('id, title, description, location, embedding')
    .not('embedding', 'is', null)

  if (error) {
    throw new Error(`properties read failed: ${error.message}`)
  }

  return (data ?? [])
    .flatMap((row) => {
      if (!row.embedding) return []
      const stored = vectorFromColumn(row.embedding)
      if (!stored) return []
      return [
        {
          id: row.id,
          title: row.title,
          description: row.description,
          location: row.location,
          similarity: cosineSimilarity(queryEmbedding, stored),
        },
      ]
    })
    .sort((left, right) => right.similarity - left.similarity)
    .slice(0, Math.max(matchCount, 1))
}
