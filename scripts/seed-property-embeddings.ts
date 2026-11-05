// Loads data/sample-properties.json, embeds each listing, and upserts public.properties.
// Uses generatePropertyEmbedding from src/lib/embeddings/generate.ts.
// Does not call the embedding provider on its own.
//
// From the repo root, with EMBEDDING_API_KEY and SUPABASE_SERVICE_ROLE_KEY set
// (a gitignored .env.local is read automatically):
//   npx tsx scripts/seed-property-embeddings.ts

import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { createSupabaseServiceRoleClient } from '../src/lib/supabase.server'
import {
  assertEmbeddingDimension,
  generatePropertyEmbedding,
} from '../src/lib/embeddings/generate'
import { EMBEDDING_DIMENSIONS } from '../src/lib/embeddings/types'

type SampleProperty = {
  id: string
  title: string
  description: string
  location: string
  price_usd: number
}

async function loadEnvFile(filePath: string): Promise<void> {
  let text: string
  try {
    text = await readFile(filePath, 'utf8')
  } catch {
    return
  }

  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '')
    if (process.env[key] === undefined) process.env[key] = value
  }
}

async function main(): Promise<void> {
  const root = process.cwd()
  await loadEnvFile(path.join(root, '.env.local'))
  await loadEnvFile(path.join(root, '.env'))

  const filePath = path.join(root, 'data', 'sample-properties.json')
  const raw = await readFile(filePath, 'utf8')
  const parsed = JSON.parse(raw) as { properties?: SampleProperty[] }
  const properties = parsed.properties
  if (!properties || properties.length === 0) {
    throw new Error('data/sample-properties.json has no properties array.')
  }

  const supabase = createSupabaseServiceRoleClient()

  for (const property of properties) {
    console.log('Embedding', property.title)

    const result = await generatePropertyEmbedding({
      title: property.title,
      description: property.description,
      locationSummary: property.location,
    })

    if (!result.ok) {
      console.error('Failed to embed', property.title, result.code, result.message)
      process.exitCode = 1
      continue
    }

    if (!assertEmbeddingDimension(result.embedding, EMBEDDING_DIMENSIONS)) {
      console.error(
        'Wrong embedding length for',
        property.title,
        result.embedding.length,
      )
      process.exitCode = 1
      continue
    }

    // pgvector stores the list as text like "[0.1,0.2,...]". Length is 1536.
    const embedding = `[${result.embedding.join(',')}]`

    const { error } = await supabase.from('properties').upsert({
      id: property.id,
      title: property.title,
      description: property.description,
      location: property.location,
      price_usd: property.price_usd,
      embedding,
    })

    if (error) {
      console.error('Failed to seed', property.title, error.message)
      process.exitCode = 1
      continue
    }

    console.log('Seeded', property.title, 'embedding dims:', result.dimensions)
  }
}

main().catch((err: unknown) => {
  console.error(err)
  process.exit(1)
})
