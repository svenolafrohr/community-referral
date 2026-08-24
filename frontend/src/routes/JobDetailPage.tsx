import { useParams } from 'react-router-dom'

export function JobDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  return (
    <section className="page-stack">
      <p className="eyebrow">Job detail route</p>
      <h1>{slug ?? 'Opportunity'}</h1>
      <p>This route is ready for the typed job-detail query, referral CTA, and final frontend composition.</p>
    </section>
  )
}
