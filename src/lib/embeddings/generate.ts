// Server-only. Do not import this file from client components.
// Credentials come from process.env. This file does not contain a key.
import '@tanstack/react-start/server-only'

import {
  EMBEDDING_DIMENSIONS,
  type EmbeddingResult,
  type PropertyEmbeddingInput,
} from './types'

const DEFAULT_EMBEDDING_MODEL = 'text-embedding-3-small'
const DEFAULT_EMBEDDING_URL = 'https://api.openai.com/v1/embeddings'

/**
 * Combine property fields into one string for the embedding model.
 * Same fields always produce the same text.
 * title, then description, then location when it is present.
 */
export function buildEmbeddingText(input: PropertyEmbeddingInput): string {
  const parts = [input.title, input.description, input.locationSummary ?? '']
    .map((part) => part.trim())
    .filter(Boolean)
  return parts.join('\n\n')
}

/** True when the vector is a finite number list of the expected length. */
export function assertEmbeddingDimension(
  embedding: number[],
  expected = EMBEDDING_DIMENSIONS,
): boolean {
  return (
    Array.isArray(embedding) &&
    embedding.length === expected &&
    embedding.every((n) => typeof n === 'number' && Number.isFinite(n))
  )
}

/**
 * Generate an embedding for property text.
 * Reads EMBEDDING_API_KEY from the server environment.
 * Returns ok: true only when the provider list is EMBEDDING_DIMENSIONS long.
 */
export async function generatePropertyEmbedding(
  input: PropertyEmbeddingInput,
): Promise<EmbeddingResult> {
  const text = buildEmbeddingText(input)
  if (!text) {
    return {
      ok: false,
      code: 'EMPTY_INPUT',
      message: 'Property title and description are empty; nothing to embed.',
    }
  }

  const apiKey = process.env.EMBEDDING_API_KEY
  if (!apiKey) {
    return {
      ok: false,
      code: 'MISSING_API_KEY',
      message:
        'Set EMBEDDING_API_KEY in the server environment before generating embeddings.',
    }
  }

  const model = process.env.EMBEDDING_MODEL ?? DEFAULT_EMBEDDING_MODEL

  try {
    const embedding = await callEmbeddingProvider(text, apiKey, model)

    if (!assertEmbeddingDimension(embedding)) {
      return {
        ok: false,
        code: 'DIMENSION_MISMATCH',
        message: `Expected ${EMBEDDING_DIMENSIONS} numbers, got ${embedding.length}.`,
      }
    }

    return {
      ok: true,
      embedding,
      model,
      dimensions: embedding.length,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown provider error'
    return { ok: false, code: 'PROVIDER_ERROR', message }
  }
}

type ProviderBody = {
  data?: Array<{ embedding?: unknown }>
  error?: { message?: string }
}

/** Provider HTTP call. Not exported. The key is sent only as a request header. */
async function callEmbeddingProvider(
  text: string,
  apiKey: string,
  model: string,
): Promise<number[]> {
  const url = process.env.EMBEDDING_API_URL ?? DEFAULT_EMBEDDING_URL
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      input: text,
      dimensions: EMBEDDING_DIMENSIONS,
    }),
  })

  let body: ProviderBody
  try {
    body = (await response.json()) as ProviderBody
  } catch {
    throw new Error(`Embedding provider returned a non-JSON response (${response.status}).`)
  }

  if (!response.ok) {
    throw new Error(
      body.error?.message ?? `Embedding provider returned ${response.status}.`,
    )
  }

  const embedding = body.data?.[0]?.embedding
  if (!isNumberList(embedding)) {
    throw new Error('Embedding provider returned no number list.')
  }

  return embedding
}

function isNumberList(value: unknown): value is number[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === 'number')
  )
}
