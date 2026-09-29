export type InvestorProfile = {
  displayName: string
  email: string
  membershipTier: string
  preferredContact: string
  notes: string
}

export const MOCK_PROFILE: InvestorProfile = {
  displayName: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  membershipTier: 'Preferred investor',
  preferredContact: 'Email',
  notes: 'Interested in multifamily and industrial deals in the Southeast.',
}

export type ProfileCardProps = {
  profile?: InvestorProfile
  isSampleData?: boolean
}

export function ProfileCard({ profile = MOCK_PROFILE, isSampleData = true }: ProfileCardProps) {
  return (
    <section
      className="profile-card max-w-xl rounded-2xl border border-[rgba(79,184,178,0.25)] px-4 py-4"
      aria-labelledby="profile-card-heading"
    >
      <div className="profile-card__header mb-2">
        <h2 id="profile-card-heading" className="m-0 text-lg font-semibold text-[var(--sea-ink)]">
          Your profile
        </h2>
        {isSampleData ? (
          <p className="sample-data-banner m-0 mt-1 text-sm text-[var(--sea-ink-soft)]" role="note">
            Sample data — placeholders only, not a live account
          </p>
        ) : null}
      </div>
      <dl className="m-0 space-y-3">
        <div>
          <dt className="text-sm text-[var(--sea-ink-soft)]">Name</dt>
          <dd className="m-0 text-sm font-semibold text-[var(--sea-ink)]">{profile.displayName}</dd>
        </div>
        <div>
          <dt className="text-sm text-[var(--sea-ink-soft)]">Email</dt>
          <dd className="m-0 text-sm text-[var(--sea-ink)]">{profile.email}</dd>
        </div>
        <div>
          <dt className="text-sm text-[var(--sea-ink-soft)]">Membership</dt>
          <dd className="m-0 text-sm text-[var(--sea-ink)]">{profile.membershipTier}</dd>
        </div>
        <div>
          <dt className="text-sm text-[var(--sea-ink-soft)]">Preferred contact</dt>
          <dd className="m-0 text-sm text-[var(--sea-ink)]">{profile.preferredContact}</dd>
        </div>
        <div>
          <dt className="text-sm text-[var(--sea-ink-soft)]">Notes</dt>
          <dd className="m-0 text-sm text-[var(--sea-ink)]">{profile.notes}</dd>
        </div>
      </dl>
    </section>
  )
}
