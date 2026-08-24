export function AdminReviewPage() {
  return (
    <section className="flex flex-col gap-3 py-14">
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Internal workflow</p>
      <h1 className="max-w-lg text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Review ingested jobs in Supabase Studio.
      </h1>
      <p className="max-w-lg text-sm text-muted-foreground">
        V0 uses Supabase Studio as the admin interface. This route reserves the future URL without
        introducing an insecure browser-side admin surface.
      </p>
    </section>
  )
}
