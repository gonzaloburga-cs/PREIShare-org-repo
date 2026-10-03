import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  return (
    <section aria-labelledby="profile-heading">
      <h2 id="profile-heading" className="text-xl font-semibold">
        Profile
      </h2>
      <p className="mt-2 max-w-prose text-slate-600">
        A sample profile will appear here.
      </p>
    </section>
  )
}
