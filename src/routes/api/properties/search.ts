// POST /api/properties/search
// Reads a buyer sentence, calls the existing search helper, and returns JSON.
// Ranking stays on the server. This file does not embed text itself.
import { createFileRoute } from '@tanstack/react-router'

import { searchPropertiesByText } from '../../../lib/property-search'

type SearchBody = {
  query?: unknown
}

export const Route = createFileRoute('/api/properties/search')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json().catch(() => ({}))) as SearchBody
          const query = typeof body.query === 'string' ? body.query.trim() : ''

          if (!query) {
            return Response.json(
              { error: 'Query is required', results: [] },
              { status: 400 },
            )
          }

          const results = await searchPropertiesByText(query)
          return Response.json({ query, results })
        } catch (err) {
          console.error('property search failed', err)
          return Response.json(
            { error: 'Search failed', results: [] },
            { status: 500 },
          )
        }
      },
    },
  },
})
