"use client"

import { useEffect, useMemo, useState } from "react"

import { SiteHeader } from "@/components/referrer/site-header"
import { SearchBar } from "@/components/referrer/search-bar"
import { JobFilters, type JobFiltersState } from "@/components/referrer/job-filters"
import { ViewToggle, type ViewMode } from "@/components/referrer/view-toggle"
import { JobList } from "@/components/referrer/job-list"
import { JobCardGrid } from "@/components/referrer/job-card-grid"
import { JobStack } from "@/components/referrer/job-stack"
import { JobDetailModal } from "@/components/referrer/job-detail-modal"
import { ConfigurationError } from "@/lib/errors"
import { listActiveJobs, type Job } from "@/lib/jobs"

type LoadState =
  | { status: "loading" }
  | { status: "success"; jobs: Job[] }
  | { status: "error"; message: string }

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b))
}

export default function ReferrerJobsPage() {
  const [state, setState] = useState<LoadState>({ status: "loading" })
  const [viewMode, setViewMode] = useState<ViewMode>("stack")
  const [filters, setFilters] = useState<JobFiltersState>({
    search: "",
    functionAreas: [],
    remotePolicies: [],
    communities: [],
  })
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  useEffect(() => {
    let active = true
    listActiveJobs()
      .then((jobs) => {
        if (active) setState({ status: "success", jobs })
      })
      .catch((error: unknown) => {
        if (!active) return
        setState({
          status: "error",
          message:
            error instanceof ConfigurationError
              ? "Verbinde Supabase in .env.local, um Positionen zu laden."
              : "Positionen konnten nicht geladen werden. Bitte versuch es erneut.",
        })
      })
    return () => {
      active = false
    }
  }, [])

  const jobs = useMemo(() => (state.status === "success" ? state.jobs : []), [state])

  const filterOptions = useMemo(
    () => ({
      functionAreas: uniqueSorted(jobs.flatMap((job) => (job.functionArea ? [job.functionArea] : []))),
      communities: uniqueSorted(jobs.map((job) => job.community)),
    }),
    [jobs]
  )

  const filteredJobs = useMemo(() => {
    const search = filters.search.trim().toLowerCase()
    return jobs.filter((job) => {
      const matchesSearch =
        !search ||
        job.title.toLowerCase().includes(search) ||
        job.company.name.toLowerCase().includes(search)
      const matchesFunctionArea =
        filters.functionAreas.length === 0 ||
        (job.functionArea != null && filters.functionAreas.includes(job.functionArea))
      const matchesRemote =
        filters.remotePolicies.length === 0 || filters.remotePolicies.includes(job.remotePolicy)
      const matchesCommunity =
        filters.communities.length === 0 || filters.communities.includes(job.community)
      return matchesSearch && matchesFunctionArea && matchesRemote && matchesCommunity
    })
  }, [jobs, filters])

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Offene Positionen
          </h1>
          <p className="mt-2 text-[15px] text-muted-foreground">
            Empfiehl jemanden aus deinem Netzwerk und sichere dir eine Prämie.
          </p>
        </div>

        <SearchBar
          value={filters.search}
          onChange={(search) => setFilters((prev) => ({ ...prev, search }))}
        />

        <div className="mt-6 mb-8 flex items-center justify-between">
          <JobFilters filters={filters} onChange={setFilters} options={filterOptions} />
          <ViewToggle value={viewMode} onChange={setViewMode} />
        </div>

        {state.status === "loading" && (
          <p role="status" className="py-16 text-center text-sm text-muted-foreground">
            Positionen werden geladen…
          </p>
        )}

        {state.status === "error" && (
          <div className="flex flex-col items-center gap-1 rounded-xl border border-dashed border-border py-16 text-center">
            <p role="alert" className="text-sm font-medium text-foreground">
              {state.message}
            </p>
          </div>
        )}

        {state.status === "success" && filteredJobs.length === 0 && (
          <div className="flex flex-col items-center gap-1 rounded-xl border border-dashed border-border py-16 text-center">
            <p className="text-sm font-medium text-foreground">
              {jobs.length === 0 ? "Aktuell keine offenen Positionen" : "Keine Positionen gefunden"}
            </p>
            <p className="text-sm text-muted-foreground">
              {jobs.length === 0
                ? "Schau bald wieder vorbei."
                : "Versuch es mit anderen Filtern oder einem anderen Suchbegriff."}
            </p>
          </div>
        )}

        {state.status === "success" &&
          filteredJobs.length > 0 &&
          (viewMode === "list" ? (
            <JobList jobs={filteredJobs} onSelect={setSelectedJob} />
          ) : viewMode === "grid" ? (
            <JobCardGrid jobs={filteredJobs} onSelect={setSelectedJob} />
          ) : (
            <JobStack jobs={filteredJobs} />
          ))}
      </main>

      <JobDetailModal
        job={selectedJob}
        onOpenChange={(open) => {
          if (!open) setSelectedJob(null)
        }}
      />
    </div>
  )
}
