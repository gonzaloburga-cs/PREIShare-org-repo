import { createFileRoute } from '@tanstack/react-router'
import { MOCK_PROFILE, ProfileCard } from '../../components/dashboard/ProfileCard'

export const Route = createFileRoute('/dashboard/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  return (
    <main>
      <h1 className="display-title mb-3 text-3xl font-bold tracking-tight text-[var(--sea-ink)]">
        Profile
      </h1>
      <ProfileCard profile={MOCK_PROFILE} />
    </main>
  )
}
