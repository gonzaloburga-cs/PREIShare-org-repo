// Contract only. No network calls live in this file.
// EMBEDDING_DIMENSIONS matches properties.embedding in
// supabase/migrations/20250315000000_enable_pgvector_properties.sql.

/** Must match the vector column size in the pgvector schema. */
export const EMBEDDING_DIMENSIONS = 1536

/**
 * Text fields from one PREIshare sample property used to build one embedding.
 * title and description are required on the properties table.
 * locationSummary maps to the optional location column and is included only when present.
 */
export type PropertyEmbeddingInput = {
  title: string
  description: string
  /** Optional location phrase. Omit it when properties.location is null. */
  locationSummary?: string
}

export type EmbeddingSuccess = {
  /** The number list stored in properties.embedding. Length must be EMBEDDING_DIMENSIONS. */
  embedding: number[]
  /** Provider and model id for handoff notes. Search math does not read this. */
  model?: string
  dimensions: number
}

export type EmbeddingErrorCode =
  | 'EMPTY_INPUT'
  | 'MISSING_API_KEY'
  | 'PROVIDER_ERROR'
  | 'DIMENSION_MISMATCH'

export type EmbeddingFailure = {
  ok: false
  code: EmbeddingErrorCode
  message: string
}

export type EmbeddingResult = ({ ok: true } & EmbeddingSuccess) | EmbeddingFailure
