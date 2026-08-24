export function SubmitJobPage() {
  return (
    <section className="flex flex-col gap-3 py-14">
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Job ingestion</p>
      <h1 className="max-w-lg text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Forward a role to the community inbox.
      </h1>
      <p className="max-w-lg text-sm text-muted-foreground">
        The production email address and provider-specific instructions belong here once the webhook
        provider is selected.
      </p>
    </section>
  )
}
