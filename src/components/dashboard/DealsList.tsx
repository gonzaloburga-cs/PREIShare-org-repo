import { useState } from 'react'
import { sampleInvestorListings } from '../../fixtures/sample-investor-listings'
import type { InvestorListing } from '../../types/investor-listing'
import type { ListingStatus } from '../../types/listing-status'

export type DealListItem = {
  id: string
  title: string
  status: ListingStatus
  city: string
  region: string
  askingPrice: number
  currency: 'USD'
  summary: string
  contactName: string
  contactDetail: string
}

const STATUS_LABEL: Record<ListingStatus, string> = {
  draft: 'Draft',
  published: 'Published',
  under_offer: 'Under offer',
  sold: 'Sold',
  archived: 'Archived',
}

function toDealListItem(listing: InvestorListing): DealListItem {
  const contact =
    listing.contacts.find((item) => item.id === listing.primaryContactId) ?? listing.contacts[0]

  return {
    id: listing.id,
    title: listing.title,
    status: listing.status,
    city: listing.address.city,
    region: listing.address.region,
    askingPrice: listing.financials.askingPrice,
    currency: listing.financials.currency,
    summary: listing.summary,
    contactName: contact?.name ?? 'Sample contact',
    contactDetail: contact?.email ?? contact?.phone ?? '',
  }
}

export const MOCK_DEALS: DealListItem[] = sampleInvestorListings.map(toDealListItem)

function formatAskingPrice(amount: number, currency: 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export type DealsListProps = {
  deals?: DealListItem[]
  emptyMessage?: string
  isSampleData?: boolean
}

export function DealsList({
  deals = MOCK_DEALS,
  emptyMessage = 'No deals to show yet.',
  isSampleData = true,
}: DealsListProps) {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <section
      className="deals-list rounded-2xl border border-[rgba(79,184,178,0.25)] px-4 py-4"
      aria-labelledby="deals-list-heading"
    >
      <div className="deals-list__header mb-2">
        <h2 id="deals-list-heading" className="m-0 text-lg font-semibold text-[var(--sea-ink)]">
          Open deals
        </h2>
        {isSampleData ? (
          <p className="sample-data-banner m-0 mt-1 text-sm text-[var(--sea-ink-soft)]" role="note">
            Sample data — placeholders only, not live listings
          </p>
        ) : null}
      </div>
      {deals.length === 0 ? (
        <p className="empty-state m-0 text-sm text-[var(--sea-ink-soft)]" role="status">
          {emptyMessage}
        </p>
      ) : (
        <ul className="m-0 list-none space-y-3 p-0">
          {deals.map((deal) => {
            const isOpen = openId === deal.id
            return (
              <li
                key={deal.id}
                className="deal-card border-b border-[rgba(79,184,178,0.15)] pb-3 last:border-b-0 last:pb-0"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="m-0 text-sm font-semibold text-[var(--sea-ink)]">{deal.title}</h3>
                  <span className="shrink-0 rounded-full border border-[rgba(79,184,178,0.45)] px-2 py-0.5 text-xs text-[var(--sea-ink)]">
                    {STATUS_LABEL[deal.status]}
                  </span>
                </div>
                <p className="m-0 mt-1 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-sm">
                  <span className="text-[var(--sea-ink-soft)]">
                    {deal.city}, {deal.region}
                  </span>
                  <span className="font-semibold tabular-nums text-[var(--sea-ink)]">
                    {formatAskingPrice(deal.askingPrice, deal.currency)}
                  </span>
                </p>
                <button
                  type="button"
                  className="mt-2 text-sm text-[var(--sea-ink-soft)] underline"
                  aria-expanded={isOpen}
                  onClick={() => setOpenId(isOpen ? null : deal.id)}
                >
                  {isOpen ? 'Hide details' : 'Details'}
                </button>
                {isOpen ? (
                  <div className="mt-2 text-sm text-[var(--sea-ink)]">
                    <p className="m-0">{deal.summary}</p>
                    <p className="m-0 mt-1 text-[var(--sea-ink-soft)]">
                      Contact: {deal.contactName}
                      {deal.contactDetail ? ` · ${deal.contactDetail}` : ''}
                    </p>
                  </div>
                ) : null}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
