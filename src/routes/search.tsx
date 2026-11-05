import { createFileRoute } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'

export const Route = createFileRoute('/search')({
  component: PropertySearchPage,
})

type SearchResult = {
  id: string
  title: string
  description: string
  similarity: number
}

const SNIPPET_LENGTH = 160

function snippet(description: string): string {
  const text = description.trim()
  if (text.length <= SNIPPET_LENGTH) return text
  return `${text.slice(0, SNIPPET_LENGTH)}…`
}

function PropertySearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'done'>(
    'idle',
  )
  const [errorMessage, setErrorMessage] = useState('')

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) {
      setResults([])
      setStatus('error')
      setErrorMessage('Type a description of the property you want.')
      return
    }

    setStatus('loading')
    setErrorMessage('')
    setResults([])

    try {
      const res = await fetch('/api/properties/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed }),
      })
      const data = (await res.json()) as {
        error?: string
        results?: SearchResult[]
      }
      if (!res.ok) {
        throw new Error(data.error || 'Search failed')
      }
      // Display only. Do not sort, filter, or invent a score on the client.
      setResults(Array.isArray(data.results) ? data.results : [])
      setStatus('done')
    } catch (err) {
      setResults([])
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Search failed')
    }
  }

  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <h1 className="display-title mb-3 text-4xl font-bold text-[var(--sea-ink)]">
          PREIshare property search
        </h1>
        <p className="mb-6 max-w-2xl text-base leading-8 text-[var(--sea-ink-soft)]">
          Describe the kind of investment property you want. We match meaning,
          not only keywords.
        </p>

        <form onSubmit={onSubmit} className="max-w-xl">
          <label
            htmlFor="q"
            className="text-sm font-semibold text-[var(--sea-ink)]"
          >
            Search
          </label>
          <input
            id="q"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="quiet cabin near water with rental upside"
            className="mt-2 mb-3 block w-full rounded-md border border-[var(--line)] bg-transparent px-3 py-2 text-[var(--sea-ink)]"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-[var(--lagoon-deep)] disabled:opacity-60"
          >
            {status === 'loading' ? 'Searching…' : 'Search'}
          </button>
        </form>

        {status === 'loading' ? (
          <p className="mt-6 text-[var(--sea-ink-soft)]">Searching…</p>
        ) : null}

        {errorMessage ? (
          <p role="alert" className="mt-6 text-[var(--sea-ink)]">
            {errorMessage}
          </p>
        ) : null}

        {status === 'done' && results.length === 0 ? (
          <p className="mt-6 text-[var(--sea-ink-soft)]">
            No matching properties yet. Try different words from the sample
            listings.
          </p>
        ) : null}

        <ul className="mt-6 list-none space-y-4 p-0">
          {results.map((result) => (
            <li key={result.id}>
              <strong className="text-[var(--sea-ink)]">{result.title}</strong>
              <div className="mt-1 text-[var(--sea-ink-soft)]">
                {snippet(
                  typeof result.description === 'string'
                    ? result.description
                    : '',
                )}
              </div>
              <div className="mt-1 text-sm text-[var(--sea-ink)]">
                Similarity:{' '}
                {typeof result.similarity === 'number'
                  ? result.similarity.toFixed(3)
                  : '—'}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
