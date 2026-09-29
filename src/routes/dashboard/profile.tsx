import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  return (
    <main>
      <h1 className="display-title mb-3 text-3xl font-bold tracking-tight text-[var(--sea-ink)]">
        Profile
      </h1>
      <p className="max-w-2xl text-base text-[var(--sea-ink-soft)]">
        Placeholder for investor profile details.
      </p>
    </main>
  )
}
