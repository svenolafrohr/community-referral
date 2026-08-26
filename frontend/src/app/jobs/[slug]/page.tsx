"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

import { SiteHeader } from "@/components/referrer/site-header"
import { JobDetails } from "@/components/referrer/job-details"
import { ConfigurationError } from "@/lib/errors"
import { getJobBySlug, type Job } from "@/lib/jobs"

type LoadState =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "error"; message: string }
  | { status: "success"; job: Job }

export default function JobDetailPage() {
  const params = useParams<{ slug: string }>()
  const slug = params.slug
  const [state, setState] = useState<LoadState>({ status: "loading" })
  const [loadedSlug, setLoadedSlug] = useState<string | undefined>(undefined)

  if (slug !== loadedSlug) {
    setLoadedSlug(slug)
    setState(slug ? { status: "loading" } : { status: "not-found" })
  }

  useEffect(() => {
    if (!slug) return
    let active = true
    getJobBySlug(slug)
      .then((job) => {
        if (!active) return
        setState(job ? { status: "success", job } : { status: "not-found" })
      })
      .catch((error: unknown) => {
        if (!active) return
        setState({
          status: "error",
          message:
            error instanceof ConfigurationError
              ? "Verbinde Supabase in .env.local, um diese Position zu laden."
              : "Diese Position konnte nicht geladen werden. Bitte versuch es erneut.",
        })
      })
    return () => {
      active = false
    }
  }, [slug])

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-lg px-4 py-10 sm:px-6 sm:py-14">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground hover:underline"
        >
          ← Alle offenen Positionen
        </Link>

        <div className="mt-6">
          {state.status === "loading" && (
            <p role="status" className="text-sm text-muted-foreground">
              Position wird geladen…
            </p>
          )}

          {state.status === "not-found" && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Nicht gefunden
              </p>
              <h1 className="text-xl font-bold text-foreground">
                Diese Position ist nicht mehr verfügbar.
              </h1>
              <p className="text-sm text-muted-foreground">
                Sie wurde möglicherweise besetzt oder entfernt.
              </p>
            </div>
          )}

          {state.status === "error" && (
            <p role="alert" className="rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground">
              {state.message}
            </p>
          )}

          {state.status === "success" && <JobDetails job={state.job} />}
        </div>
      </main>
    </div>
  )
}
