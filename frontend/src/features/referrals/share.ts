export function buildJobShareUrl(appUrl: string, jobSlug: string, referralCode?: string): string {
  const url = new URL(`/jobs/${jobSlug}`, appUrl)
  if (referralCode) url.searchParams.set('ref', referralCode)
  return url.toString()
}
